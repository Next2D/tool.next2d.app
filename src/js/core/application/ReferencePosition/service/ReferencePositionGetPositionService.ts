import type { Character } from "@/core/domain/model/Character";
import type { IPivotType } from "@/interface/IPivotType";
import type { IPosition } from "@/interface/IPosition";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { Matrix } from "@next2d/geom";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";

/**
 * @description 指定された座標をCharacterのmatrixを考慮した座標に変換して返却
 *              Converts the specified coordinates to coordinates considering the Character's matrix and returns them
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {Character} character
 * @return {IPosition}
 * @method
 * @public
 */
export const execute = (pivot: IPivotType, x: number, y: number, character: Character): IPosition =>
{
    const rawBounds = character.getRawBounds();
    if (!rawBounds) {
        return { "x": 0, "y": 0 };
    }

    let dx = x;
    let dy = y;
    const width  = Math.abs(rawBounds.xMax - rawBounds.xMin);
    const height = Math.abs(rawBounds.yMax - rawBounds.yMin);
    switch (pivot)
    {
        case "top-left":
            dx = 0;
            dy = 0;
            break;

        case "top-center":
            dx = width / 2;
            dy = 0;
            break;

        case "top-right":
            dx = width;
            dy = 0;
            break;

        case "middle-left":
            dx = 0;
            dy = height / 2;
            break;

        case "middle-center":
            dx = width / 2;
            dy = height / 2;
            break;

        case "middle-right":
            dx = width;
            dy = height / 2;
            break;

        case "bottom-left":
            dx = 0;
            dy = height;
            break;

        case "bottom-center":
            dx = width / 2;
            dy = height;
            break;

        case "bottom-right":
            dx = width;
            dy = height;
            break;

        default:
            break;
    }

    const matrix = Matrix.multiply(
        $getConcatenatedMatrix(),
        character.matrix
    );

    const workSpace = $getCurrentWorkSpace();
    const instance = workSpace.getLibrary(character.libraryId);
    if (instance && instance.type === $MOVIE_CLIP_TYPE) {
        dx += rawBounds.xMin;
        dy += rawBounds.yMin;
    }

    return {
        "x": dx * matrix[0] + dy * matrix[2] + matrix[4],
        "y": dx * matrix[1] + dy * matrix[3] + matrix[5]
    };
};