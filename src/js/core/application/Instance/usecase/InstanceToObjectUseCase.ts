import type { Instance } from "@/core/domain/model/Instance";
import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { IBitmapSaveObject } from "@/interface/IBitmapSaveObject";
import { execute as bitmapToObjectService } from "@/core/application/Bitmap/service/BitmapToObjectService";
import { $BITMAP_TYPE } from "@/config/InstanceConfig";

/**
 * @description Instanceをオブジェクトに変換するユースケース
 *              Use case to convert Instance to object
 *
 * @param  {I} instance
 * @return {IBitmapSaveObject}
 * @method
 * @public
 */
export const execute = <I extends Instance>(instance: I): IBitmapSaveObject =>
{
    switch (instance.type) {

        case $BITMAP_TYPE:
            return bitmapToObjectService(instance as unknown as Bitmap);

        default:
            throw new Error(`Instance type "${instance.type}" is not supported for conversion to object.`);

    }
};