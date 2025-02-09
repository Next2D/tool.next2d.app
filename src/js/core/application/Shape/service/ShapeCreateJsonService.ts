import type { Shape } from "@/core/domain/model/Shape";
import type { IShapePublishJson } from "@/interface/IShapePublishJson";
import { Shape as DisplayShape } from "@next2d/display";

/**
 * @description Next2D Playerの再生用JSONオブジェクトを生成する
 *              Create a JSON object for playback in Next2D Player
 *
 * @param  {Shape} shape
 * @return {object}
 * @method
 * @public
 */
export const execute = (shape: Shape): IShapePublishJson =>
{
    const bounds = shape.getRawBounds();

    const object: IShapePublishJson = {
        "extends": DisplayShape.namespace,
        "recodes": shape.recodes.slice(),
        "bounds": {
            "xMin": bounds.xMin,
            "xMax": bounds.xMax,
            "yMin": bounds.yMin,
            "yMax": bounds.yMax
        }
    };

    if (shape.symbol) {
        object.symbol = shape.symbol;
    }

    return object;
};