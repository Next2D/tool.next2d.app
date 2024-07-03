import { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCanvas } from "@/global/GlobalUtil";
import { execute as publishToolCreateToObjectUseCase } from "@/tool/application/PublishTool/usecase/PublishToolCreateToObjectUseCase";

/**
 * @description MovieClipの現在のフレームの描画を行う
 *              Draw the current frame of the MovieClip
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): Promise<HTMLCanvasElement> =>
{
    return new Promise(async (resolve) =>
    {
        const canvas = $getCanvas();

        const width  = movie_clip.width;
        const height = movie_clip.height;

        const object = await publishToolCreateToObjectUseCase(movie_clip);

        const loader = new next2d.display.Loader();
        loader.loadJSON(object);

        const bitmapData = new next2d.display.BitmapData(width, height);
        bitmapData.draw(loader.content, null, null, canvas, (canvas: HTMLCanvasElement): void =>
        {
            resolve(canvas);
        });
    });
};