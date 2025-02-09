import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCanvas } from "@/global/GlobalUtil";
import { $clearUseLibraryIds } from "@/tool/application/PublishTool/PublishToolUtil";
import { Loader } from "@next2d/display";
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

    return new Promise(async (resolve) =>
    {
        // Plyerのキャッシュをリセット
        next2d.player.cacheStore.reset();

        const canvas = $getCanvas();

        // 利用ライブラリIDのマッピングを初期化
        $clearUseLibraryIds();

        // JSONオブジェクトを生成
        const object = await publishToolCreateToObjectUseCase(movie_clip);

        const loader = new Loader();
        loader.loadJSON(object);

        const movieClip = loader.content;
        movieClip.gotoAndStop(frame);

        // matrixの適用分の座標を補正
        const bounds = movieClip.getBounds(null);
        const x = bounds.width / 2;
        const y = bounds.height / 2;

        movieClip.x = -bounds.x - x;
        movieClip.y = -bounds.y - y;

        const sprite = new next2d.display.Sprite();
        sprite.addChild(movieClip);

        const concatMatrix = $getConcatenatedMatrix();
        sprite.transform.matrix = new next2d.geom.Matrix(
            concatMatrix[0], concatMatrix[1],
            concatMatrix[2], concatMatrix[3],
            0, 0
        );

        const container = new next2d.display.Sprite();
        container.addChild(sprite);

        const matrix = new next2d.geom.Matrix();
        matrix.translate(
            container.width / 2,
            container.height / 2
        );
        const scale = window.devicePixelRatio;
        matrix.scale(scale, scale);

        const bitmapData = new next2d.display.BitmapData(container.width * scale, container.height * scale);
        bitmapData.ca(container, matrix, null, canvas, (canvas: HTMLCanvasElement): void =>
        {
            canvas.style.width  = `${container.width}px`;
            canvas.style.height = `${container.height}px`;
            resolve(canvas);
        });
    });
};