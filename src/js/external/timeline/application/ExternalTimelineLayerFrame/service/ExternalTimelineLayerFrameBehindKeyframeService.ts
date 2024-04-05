import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定キーフレーム以下のキーフレームを後方に移動
 *              Move the keyframes below the specified keyframe backward
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

    let frame = layer.maxFrame - 1;
    while (true) {

        // 追加したキーフレーム以下になったら終了
        if (keyframe > frame) {
            break;
        }

        // キーフレームを後方に移動
        const activeCharacters = layer.getActiveCharacters(frame);
        if (activeCharacters.length) {
            frame = activeCharacters[0].startFrame - 1;
            for (let idx = 0; idx < activeCharacters.length; ++idx) {
                const character = activeCharacters[idx];
                character.move(num_frame);
            }
            continue;
        }

        // 空のキーフレームを後方に移動
        const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (activeEmptyCharacter) {
            frame = activeEmptyCharacter.startFrame - 1;
            activeEmptyCharacter.move(num_frame);
            continue;
        }

        // 何もヒットしなければ終了
        break;
    }
};