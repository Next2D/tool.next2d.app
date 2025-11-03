import type { Character } from "@/core/domain/model/Character";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";

/**
 * @description キャラクターのセーブデータからの復元を実行します。
 *              Restore from the character's save data.
 *
 * @param  {Character} character
 * @param  {ICharacterSaveObject} save_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    character: Character,
    save_object: ICharacterSaveObject
): void => {

    character.libraryId  = save_object.libraryId;
    character.depth      = save_object.depth;
    character.blendMode  = save_object.blendMode;
    character.startFrame = save_object.startFrame;
    character.endFrame   = save_object.endFrame;
    character.name       = save_object.name;

    if (save_object.parentMovieClipId) { // 旧バージョンではreferencePositionが存在しないのでチェック
        character.parentMovieClipId = save_object.parentMovieClipId;
    }

    // 配列を上書き
    if (save_object.matrix) {
        character.matrix.set(save_object.matrix);
    }
    if (save_object.colorTransform) {
        character.colorTransform.set(save_object.colorTransform);
    }

    // 中心点を上書き
    if (save_object.referencePosition) { // 旧バージョンではreferencePositionが存在しないのでチェック
        // pivotが存在する場合はpivotを優先
        if (save_object.referencePosition.pivot
            && save_object.referencePosition.pivot !== "none"
        ) {
            character.referencePosition.pivot = save_object.referencePosition.pivot;
        } else {
            // pivotが存在しない場合はx,yをセット
            character.referencePosition.pivot = "none";
            character.referencePosition.x = save_object.referencePosition.x;
            character.referencePosition.y = save_object.referencePosition.y;
        }
    }
};