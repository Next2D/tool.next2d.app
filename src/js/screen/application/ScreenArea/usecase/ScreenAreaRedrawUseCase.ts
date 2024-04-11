import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as screenAreaAppendCharacterService } from "../service/ScreenAreaAppendCharacterService";
import { $MASK_MODE } from "@/config/LayerModeConfig";

/**
 * @description スクリーンエリアを再描画
 *              Redraw screen area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (movie_clip: MovieClip): Promise<void> =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const frame  = movie_clip.currentFrame;
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

            await screenAreaAppendCharacterService(character, layer);
        }
    }
};