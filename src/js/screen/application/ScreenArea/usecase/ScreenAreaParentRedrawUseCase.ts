import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Character } from "@/core/domain/model/Character";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { $MASK_MODE } from "@/config/LayerModeConfig";
import { execute as screenAreaAppendCharacterService } from "../service/ScreenAreaAppendCharacterService";

/**
 * @description 先祖のMovieClipを半透明・イベントなし状態でスクリーンエリアに再描画
 *              Redraw ancestor MovieClips in screen area with semi-transparent and no event state
 *
 * @param  {MovieClip} movie_clip
 * @param  {Character} ignore_character
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    movie_clip: MovieClip,
    ignore_character: Character
): Promise<void> => {

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const frame = movie_clip.currentFrame;
    const layers = movie_clip.layers;
    for (let idx = layers.length - 1; idx > -1; --idx) {

        const layer = layers[idx];
        if (!layer) {
            continue;
        }

        // 非表示の場合はスキップ
        if (layer.disable) {
            continue;
        }

        // マスクの親レイヤーでロックされている場合はスキップ
        if (layer.mode === $MASK_MODE && layer.lock) {
            continue;
        }

        const activeCharacters = layer.getActiveCharacters(frame);
        if (!activeCharacters.length) {
            continue;
        }

        // 昇順に並ぶかえ
        const characters = activeCharacters
            .sort((a, b) => a.depth < b.depth ? -1 : 1);

        for (let idx = 0; idx < characters.length; ++idx) {

            const character = characters[idx];
            if (!character) {
                continue;
            }

            if (ignore_character.id === character.id) {
                continue;
            }

            await screenAreaAppendCharacterService(character, layer);
        }
    }
};