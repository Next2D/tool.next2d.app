import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { MovieClip as DisplayMovieClip } from "@next2d/display";
import type { Character } from "@/core/domain/model/Character";
import { execute as publishToolCreateToObjectUseCase } from "@/tool/application/PublishTool/usecase/PublishToolCreateToObjectUseCase";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
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
    loader.loadJSON(object as any);

    const movieClip = loader.content as DisplayMovieClip;
    movieClip.gotoAndStop(frame);

    const container = new Sprite();
    container.addChild(movieClip);

    const concatMatrix = $getConcatenatedMatrix();

    const scale = window.devicePixelRatio;
    const parentMatrix = Matrix.multiply(
        new Float32Array([scale, 0, 0, scale, 0, 0]),
        new Float32Array([
            characterCalcGetScaleXService(concatMatrix), 0,
            0, characterCalcGetScaleYService(concatMatrix),
            concatMatrix[4], concatMatrix[5]
        ])
    );

    const matrix = new Matrix();
    const tMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
    if (character) {
        const multiMatrix = Matrix.multiply(
            parentMatrix,
            new Float32Array([
                character.scaleX, 0, 0, character.scaleY, character.x, character.y
            ])
        );

        const rawMatrix = Matrix.multiply(
            concatMatrix, character.matrix
        );

        matrix.a = rawMatrix[0];
        matrix.b = rawMatrix[1];
        matrix.c = rawMatrix[2];
        matrix.d = rawMatrix[3];

        tMatrix.set([
            multiMatrix[0], multiMatrix[1],
            multiMatrix[2], multiMatrix[3]
        ], 0);

    } else {
        tMatrix.set([scale, 0, 0, scale], 0);

        matrix.a = scale;
        matrix.b = 0;
        matrix.c = 0;
        matrix.d = scale;
    }

    const scaleX = Math.hypot(tMatrix[0], tMatrix[1]);
    const scaleY = Math.hypot(tMatrix[2], tMatrix[3]);

    const rectangle = movieClip.getBounds();
    const canvas = await next2d.captureToCanvas(container, {
        "matrix": new Matrix(
            scaleX, 0, 0, scaleY,
            -rectangle.x * scaleX,
            -rectangle.y * scaleY
        ),
        "canvas": $getCanvas(),
        "videoSync": true
    });

    // 実際のサイズを設定
    container.matrix = matrix;
    canvas.style.width  = `${container.width}px`;
    canvas.style.height = `${container.height}px`;

    return canvas;
};