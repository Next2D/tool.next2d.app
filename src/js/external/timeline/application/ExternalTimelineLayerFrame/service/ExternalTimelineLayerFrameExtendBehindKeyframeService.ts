import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定キーフレームの終了位置を後方に伸ばす
 *              Extend the end position of the specified keyframe backward
 *
 * @param  {Layer} layer
 * @param  {number} keyframe
 * @param  {number} num_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    layer: Layer,
    keyframe: number,
    num_frame: number
): void => {

    const characters = layer.getActiveCharacters(keyframe);
    if (characters.length) {
        // キーフレームの終了位置を補正
        for (let idx = 0; idx < characters.length; idx++) {
            const character = characters[idx];
            if (!character) {
                continue;
            }
            character.endFrame += num_frame;
        }
    } else {
        // 空のキーフレームの終了位置を補正
        const emptyCharacter = layer.getActiveEmptyCharacter(keyframe);
        if (emptyCharacter) {
            emptyCharacter.endFrame += num_frame;
        }
    }
};