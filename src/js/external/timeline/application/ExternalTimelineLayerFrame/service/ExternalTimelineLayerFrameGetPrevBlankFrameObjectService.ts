import { Layer } from "@/core/domain/model/Layer";
import { FrameObjectImpl } from "@/interface/FrameObjectImpl";

/**
 * @description 指定レイヤーの指定キーフレームより前の空きフレームの幅を取得
 *              Get the width of the empty frame before the specified keyframe of the specified layer
 *
 * @param  {Layer} layer
 * @param  {number} keyframe
 * @return {object | null}
 * @method
 * @public
 */
export const execute = (layer: Layer, keyframe: number): FrameObjectImpl | null =>
{
    let frame = keyframe - 1;
    while (frame) {

        const characters = layer.getActiveCharacters(frame);
        if (characters.length) {
            const character = characters[0];

            // キーフレームがあればnullを返す
            if (character.endFrame === keyframe) {
                return null;
            }

            return {
                "start": character.endFrame,
                "end": keyframe
            };
        }

        const emptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (emptyCharacter) {

            // キーフレームがあればnullを返す
            if (emptyCharacter.endFrame === keyframe) {
                return null;
            }

            return {
                "start": emptyCharacter.endFrame,
                "end": keyframe
            };
        }

        --frame;
    }

    return {
        "start": 1,
        "end": keyframe
    };
};