import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { MovieClip as DisplayMovieClip } from "@next2d/display";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCanvas } from "@/global/GlobalUtil";
import { $clearUseLibraryIds } from "@/tool/application/PublishTool/PublishToolUtil";
import { Loader, Sprite } from "@next2d/display";
import { Matrix } from "@next2d/geom";
import { execute as publishToolCreateToObjectUseCase } from "@/tool/application/PublishTool/usecase/PublishToolCreateToObjectUseCase";

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

    // matrixの適用分の座標を補正
    const bounds = movieClip.getBounds(null);
    const x = bounds.width / 2;
    const y = bounds.height / 2;

    movieClip.x = -bounds.x - x;
    movieClip.y = -bounds.y - y;

    const container = new Sprite();
    container.addChild(movieClip);

    const concatMatrix = $getConcatenatedMatrix();
    container.matrix = new Matrix(
        concatMatrix[0], concatMatrix[1],
        concatMatrix[2], concatMatrix[3],
        0, 0
    );

    const scale = window.devicePixelRatio;

    const canvas = await next2d.captureToCanvas(container, {
        "matrix": new Matrix(scale, 0, 0, scale),
        "canvas": $getCanvas()
    });

    canvas.style.width  = `${container.width}px`;
    canvas.style.height = `${container.height}px`;

    return canvas;
};