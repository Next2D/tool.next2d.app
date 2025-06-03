import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { MovieClip as DisplayMovieClip } from "@next2d/display";
import type { Character } from "@/core/domain/model/Character";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCanvas } from "@/global/GlobalUtil";
import { $clearUseLibraryIds } from "@/tool/application/PublishTool/PublishToolUtil";
import { Loader, Sprite } from "@next2d/display";
import { Matrix } from "@next2d/geom";
import { execute as publishToolCreateToObjectUseCase } from "@/tool/application/PublishTool/usecase/PublishToolCreateToObjectUseCase";
import { $multiplyMatrix } from "../../CoreUtil";

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
    const parentMatrix = $multiplyMatrix(
        new Float32Array([scale, 0, 0, scale, 0, 0]), concatMatrix
    );

    const matrix = new Matrix();
    const tMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
    if (character) {
        const multiMatrix = $multiplyMatrix(
            parentMatrix, character.matrix
        );

        const rawMatrix = $multiplyMatrix(
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
        tMatrix.set([
            parentMatrix[0], parentMatrix[1],
            parentMatrix[2], parentMatrix[3]
        ], 0);

        matrix.a = parentMatrix[0];
        matrix.b = parentMatrix[1];
        matrix.c = parentMatrix[2];
        matrix.d = parentMatrix[3];
    }

    const scaleX = Math.sqrt(
        tMatrix[0] * tMatrix[0]
            + tMatrix[1] * tMatrix[1]
    );
    const scaleY = Math.sqrt(
        tMatrix[2] * tMatrix[2]
            + tMatrix[3] * tMatrix[3]
    );

    const rectangle = movieClip.getBounds();
    const canvas = await next2d.captureToCanvas(container, {
        "matrix": new Matrix(
            tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3],
            -rectangle.x * scaleX, -rectangle.y * scaleY
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