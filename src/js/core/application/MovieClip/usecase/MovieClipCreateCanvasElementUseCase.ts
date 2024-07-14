import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCanvas } from "@/global/GlobalUtil";
import { $clearUseLibraryIds } from "@/tool/application/PublishTool/PublishToolUtil";
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
export const execute = (movie_clip: MovieClip, frame: number = 1): Promise<HTMLCanvasElement> =>
{
    return new Promise(async (resolve) =>
    {
        // Plyerのキャッシュをリセット
        next2d.player.cacheStore.reset();

        const canvas = $getCanvas();

        // 利用ライブラリIDのマッピングを初期化
        $clearUseLibraryIds();

        // JSONオブジェクトを生成
        const object = await publishToolCreateToObjectUseCase(movie_clip);

        const loader = new next2d.display.Loader();
        loader.loadJSON(object);

        const movieClip = loader.content;
        movieClip.gotoAndStop(frame);

        const bounds = movieClip.getBounds(null);
        const matrix = new next2d.geom.Matrix();
        matrix.tx = -bounds.x;
        matrix.ty = -bounds.y;

        const scale = window.devicePixelRatio;
        matrix.scale(scale, scale);

        const bitmapData = new next2d.display.BitmapData(movieClip.width * scale, movieClip.height * scale);
        bitmapData.draw(movieClip, matrix, null, canvas, (canvas: HTMLCanvasElement): void =>
        {
            canvas.style.width  = `${movieClip.width}px`;
            canvas.style.height = `${movieClip.height}px`;
            resolve(canvas);
        });
    });
};