import { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCanvas } from "@/global/GlobalUtil";
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
        const canvas = $getCanvas();

        const object = await publishToolCreateToObjectUseCase(movie_clip);

        const loader = new next2d.display.Loader();
        loader.loadJSON(object);

        const movieClip = loader.content;
        movieClip.gotoAndStop(frame);

        const bounds = movieClip.getBounds(null);
        const matrix = new next2d.geom.Matrix();
        matrix.tx = -bounds.x;
        matrix.ty = -bounds.y;

        const bitmapData = new next2d.display.BitmapData(movieClip.width, movieClip.height);
        bitmapData.draw(movieClip, matrix, null, canvas, (canvas: HTMLCanvasElement): void =>
        {
            return resolve(canvas);
        });
    });
};