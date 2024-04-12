import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定キーフレーム以下のキーフレームを前方に移動
 *              Move the keyframes below the specified keyframe forward
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

    const maxFrame = layer.maxFrame;
    if (keyframe >= maxFrame) {
        return ;
    }

    let frame = keyframe;
    while (true) {

        // 追加したキーフレーム以下になったら終了
        if (frame >= maxFrame) {
            break;
        }

        // キーフレームを前方に移動
        const activeCharacters = layer.getActiveCharacters(frame);
        if (activeCharacters.length) {
            frame = activeCharacters[0].endFrame;
            for (let idx = 0; idx < activeCharacters.length; ++idx) {
                const character = activeCharacters[idx];
                character.move(-num_frame);
            }
            continue;
        }

        // 空のキーフレームを前方に移動
        const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (activeEmptyCharacter) {
            frame = activeEmptyCharacter.endFrame;
            activeEmptyCharacter.move(-num_frame);
            continue;
        }

        // 何もヒットしなければ終了
        break;
    }
};