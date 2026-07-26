import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { MovieClip as DisplayMovieClip } from "@next2d/display";
import type { Character } from "@/core/domain/model/Character";
import { execute as publishToolCreateToObjectUseCase } from "@/tool/application/PublishTool/usecase/PublishToolCreateToObjectUseCase";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCanvas } from "@/global/GlobalUtil";
import { $clearUseLibraryIds } from "@/tool/application/PublishTool/PublishToolUtil";
import { Matrix } from "@next2d/geom";
import {
    Loader,
    Sprite
} from "@next2d/display";

/**
 * @description MovieClipの現在のフレームの描画を行う
 *              Draw the current frame of the MovieClip
 *
 * @param  {MovieClip} movie_clip
 * @param  {number} frame
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    movie_clip: MovieClip,
    character: Character | null = null,
    frame: number = 1
): Promise<HTMLCanvasElement> => {

    // 利用ライブラリIDのマッピングを初期化
    $clearUseLibraryIds();

    // JSONオブジェクトを生成
    const object = await publishToolCreateToObjectUseCase(movie_clip);

    const loader = new Loader();
    await loader.loadJSON(object as any);

    const movieClip = loader.content as DisplayMovieClip;
    movieClip.gotoAndStop(frame);

    const container = new Sprite();
    container.addChild(movieClip);

    const concatMatrix = $getConcatenatedMatrix();

    const scale = window.devicePixelRatio;

    // MovieClipは軸平行でラスタライズし、回転・シアーはCSS(--transform)側で当てる。
    // 倍率は「親との合成行列の各基底ベクトルの長さ」で求める必要がある。
    // 親と自身のスケールの掛け算では、親が非等方かつ自身に回転がある場合に一致しない。
    const matrix = new Matrix();
    let scaleX = scale;
    let scaleY = scale;
    if (character) {
        const rawMatrix = Matrix.multiply(
            concatMatrix, character.matrix
        );

        matrix.a = rawMatrix[0];
        matrix.b = rawMatrix[1];
        matrix.c = rawMatrix[2];
        matrix.d = rawMatrix[3];

        scaleX = scale * Math.hypot(rawMatrix[0], rawMatrix[1]);
        scaleY = scale * Math.hypot(rawMatrix[2], rawMatrix[3]);

    } else {

        matrix.a = scale;
        matrix.b = 0;
        matrix.c = 0;
        matrix.d = scale;
    }

    const rectangle = movieClip.getBounds();
    const canvas = await next2d.captureToCanvas(container, {
        "matrix": new Matrix(
            scaleX, 0, 0, scaleY,
            -rectangle.x * scaleX,
            -rectangle.y * scaleY
        ),
        "canvas": $getCanvas(),
        "videoSync": true,
        "bgColor": "#000000"
    });

    // alphaを設定
    canvas.style.opacity = `${character ? character.alpha : 1}`;

    // 実際のサイズを設定
    container.matrix = matrix;
    canvas.style.width  = `${Math.ceil(canvas.width / scale)}px`;
    canvas.style.height = `${Math.ceil(canvas.height / scale)}px`;

    return canvas;
};