import { $MASK_MODE } from "@/config/LayerModeConfig";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as screenDisplayObjectUpdateMaskStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskStyleService";
import { execute as screenAreaAppendCharacterService } from "@/screen/application/ScreenArea/service/ScreenAreaAppendCharacterService";

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
    if (layer.mode !== $MASK_MODE) {
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
    if (layer.lock) {
        for (let idx = 0; idx < length; ++idx) {
            const node = elements[idx] as HTMLElement;
            if (!node) {
                continue ;
            }

            node.style.display = "none";
        }
    } else {
        // 非表示設定でなければ表示
        if (!layer.disable) {
            if (length) {
                for (let idx = 0; idx < length; ++idx) {
                    const node = elements[idx] as HTMLElement;
                    if (!node) {
                        continue ;
                    }

                    node.style.display = "";
                }
            } else {
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
            }
        }
    }

    const index = movie_clip.layers.indexOf(layer);
    for (let idx = index + 1; movie_clip.layers.length > idx; ++idx) {

        const childLayer = movie_clip.layers[idx];

        const activeCharacters = childLayer.getActiveCharacters(movie_clip.currentFrame);
        if (!activeCharacters.length) {
            continue;
        }

        const elements = element
            .querySelectorAll(`.layer-id-${childLayer.id}`);

        for (let idx = 0; idx < activeCharacters.length; ++idx) {

            const character = activeCharacters[idx];
            if (!character) {
                continue;
            }

            const element = elements[character.depth] as HTMLElement;
            if (!element) {
                continue;
            }

            screenDisplayObjectUpdateMaskStyleService(
                element,
                childLayer,
                character.x,
                character.y
            );
        }
    }
};