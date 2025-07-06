import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { IBitmapSaveObject } from "@/interface/IBitmapSaveObject";

/**
 * @description Bitmapオブジェクトを保存用のオブジェクトに変換する
 *              Convert Bitmap object to save object
 *
 * @param  {Bitmap} bitmap
 * @return {IBitmapSaveObject}
 * @method
 * @public
 */
export const execute = (bitmap: Bitmap): IBitmapSaveObject =>
{
    return {
        "id":        bitmap.id,
        "name":      bitmap.name,
        "type":      bitmap.type,
        "symbol":    bitmap.symbol,
        "folderId":  bitmap.folderId,
        "width":     bitmap.width,
        "height":    bitmap.height,
        "imageType": bitmap.imageType,
        "buffer":    bitmap.binary
    };
};