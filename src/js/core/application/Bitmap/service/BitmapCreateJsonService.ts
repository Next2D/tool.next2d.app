import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { IBitmapPublishJson } from "@/interface/IBitmapPublishJson";
import { Shape } from "@next2d/display";

/**
 * @description Next2D Playerの再生用JSONオブジェクトを生成する
 *              Create a JSON object for playback in Next2D Player
 *
 * @param  {Bitmap} bitmap
 * @return {object}
 * @method
 * @public
 */
export const execute = (bitmap: Bitmap): IBitmapPublishJson =>
{
    const object: IBitmapPublishJson = {
        "extends": Shape.namespace,
        "buffer": bitmap.buffer ? Array.from(bitmap.buffer) : [],
        "bounds": {
            "xMin": 0,
            "xMax": bitmap.width,
            "yMin": 0,
            "yMax": bitmap.height
        }
    };

    if (bitmap.symbol) {
        object.symbol = bitmap.symbol;
    }

    return object;
};