import type { Shape } from "@/core/domain/model/Shape";
import type { ShapePublishJsonImpl } from "@/interface/ShapePublishJsonImpl";

/**
 * @description Next2D Playerの再生用JSONオブジェクトを生成する
 *              Create a JSON object for playback in Next2D Player
 *
 * @param  {Shape} shape
 * @return {object}
 * @method
 * @public
 */
export const execute = (shape: Shape): ShapePublishJsonImpl =>
{
    const bounds = shape.getRawBounds();

    const object: ShapePublishJsonImpl = {
        "extends":  next2d.display.Shape.namespace,
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