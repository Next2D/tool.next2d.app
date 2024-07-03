import { Character } from "@/core/domain/model/Character";
import { PlaceObjectImpl } from "@/interface/PlaceObjectImpl";

/**
 * @description 指定のキャラクタークラスからPlaceObjectを生成する
 *              Generate a PlaceObject from the specified character class.
 *
 * @param  {Character} character
 * @return {object}
 * @method
 * @public
 */
export const execute = (character: Character): PlaceObjectImpl =>
{
    const placeObject: PlaceObjectImpl = {};

    // matrixが設定されている場合は追加
    const matrix = character.matrix;
    if (matrix[0] !== 1 || matrix[1] !== 0
        || matrix[2] !== 0 || matrix[3] !== 1
        || matrix[4] !== 0 || matrix[5] !== 0
    ) {
        placeObject.matrix = matrix.slice(0);
    }

    // colorTransformが設定されている場合は追加
    const colorTransform = character.colorTransform;
    if (colorTransform[0] !== 1 || colorTransform[1] !== 1
        || colorTransform[2] !== 1 || colorTransform[3] !== 1
        || colorTransform[4] !== 0 || colorTransform[5] !== 0
        || colorTransform[6] !== 0 || colorTransform[7] !== 0
    ) {
        placeObject.colorTransform = colorTransform.slice(0);
    }

    // blendModeが設定されている場合は追加
    if (character.blendMode !== "normal") {
        placeObject.blendMode = character.blendMode;
    }

    // surfaceFilterListが設定されている場合は追加
    const filters = [];
    for (let idx = 0; idx < character.filters.length; ++idx) {
        const filter = character.filters[idx];
        if (!filter.state) {
            continue;
        }

        filters.push({
            "class": filter.name,
            "params": filter.toParamArray()
        });
    }
    if (filters.length) {
        placeObject.surfaceFilterList = filters;
    }

    return placeObject;
};