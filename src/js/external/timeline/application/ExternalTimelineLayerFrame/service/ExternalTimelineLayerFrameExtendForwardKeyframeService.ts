import { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定キーフレームの開始位置を前方に伸ばす
 *              Extend the start position of the specified keyframe forward
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

    const nextCharacters = layer.getActiveCharacters(keyframe);
    if (nextCharacters.length) {
        // キーフレームの終了位置を補正
        for (let idx = 0; idx < nextCharacters.length; idx++) {
            const nextCharacter = nextCharacters[idx];
            if (!nextCharacter) {
                continue;
            }
            nextCharacter.startFrame -= num_frame;
        }
    } else {
        // 空のキーフレームの終了位置を補正
        const nextEmptyCharacter = layer.getActiveEmptyCharacter(keyframe);
        if (nextEmptyCharacter) {
            nextEmptyCharacter.startFrame -= num_frame;
        }
    }
};