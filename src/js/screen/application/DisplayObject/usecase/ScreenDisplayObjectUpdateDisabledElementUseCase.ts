import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as screenAreaAppendCharacterService } from "@/screen/application/ScreenArea/service/ScreenAreaAppendCharacterService";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { $MASK_MODE } from "@/config/LayerModeConfig";

/**
 * @description マスクの表示と子のレイヤーの表示を更新
 *              Update mask display and child layer display
 *
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (movie_clip: MovieClip, layer: Layer): Promise<void> =>
{
    // マスクの親でロック中なら何もしないで終了
    if (layer.mode === $MASK_MODE && layer.lock) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const elements = element
        .querySelectorAll(`.layer-id-${layer.id}`);

    const length = elements.length;

    // 表示で配置がなければ追加
    if (!layer.disable && !length) {
        const activeCharacters = layer.getActiveCharacters(movie_clip.currentFrame);
        if (!activeCharacters.length) {
            return ;
        }

        for (let idx = 0; activeCharacters.length > idx; ++idx) {
            const character = activeCharacters[idx];
            if (!character) {
                continue;
            }

            await screenAreaAppendCharacterService(character, layer);
        }

    } else {
        if (!length) {
            return ;
        }

        for (let idx = 0; idx < length; ++idx) {
            const node = elements[idx] as HTMLElement;
            if (!node) {
                continue ;
            }

            node.style.display = layer.disable ? "none" : "";
        }
    }
};