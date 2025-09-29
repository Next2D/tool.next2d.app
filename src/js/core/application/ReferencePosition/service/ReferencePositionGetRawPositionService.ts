import type { Character } from "@/core/domain/model/Character";
import type { IPivotType } from "@/interface/IPivotType";
import type { IPosition } from "@/interface/IPosition";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $getPivotPosition } from "@/controller/application/ReferenceSetting/ReferenceSettingUtil";

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
    let dx = x;
    let dy = y;
    if (pivot !== "none") {

        const rawBounds = character.getRawBounds();
        if (!rawBounds) {
            return { "x": 0, "y": 0 };
        }

        const width  = Math.abs(rawBounds.xMax - rawBounds.xMin);
        const height = Math.abs(rawBounds.yMax - rawBounds.yMin);

        const position = $getPivotPosition(pivot, width, height);
        dx = position.x;
        dy = position.y;

        const workSpace = $getCurrentWorkSpace();
        const instance = workSpace.getLibrary(character.libraryId);
        if (instance && instance.type === $MOVIE_CLIP_TYPE) {
            dx += rawBounds.xMin;
            dy += rawBounds.yMin;
        }
    }

    return {
        "x": Math.round(dx * 100) / 100,
        "y": Math.round(dy * 100) / 100
    };
};