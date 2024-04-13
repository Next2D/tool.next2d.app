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

    const prevCharacters = layer.getActiveCharacters(keyframe);
    if (prevCharacters.length) {
        // キーフレームの終了位置を補正
        for (let idx = 0; idx < prevCharacters.length; idx++) {
            const prevCharacter = prevCharacters[idx];
            if (!prevCharacter) {
                continue;
            }
            prevCharacter.endFrame += num_frame;
        }
    } else {
        // 空のキーフレームの終了位置を補正
        const prevEmptyCharacter = layer.getActiveEmptyCharacter(keyframe);
        if (prevEmptyCharacter) {
            prevEmptyCharacter.endFrame += num_frame;
        }
    }
};