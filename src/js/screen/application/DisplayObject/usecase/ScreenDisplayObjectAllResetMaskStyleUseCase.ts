import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as screenDisplayObjectResetMaskStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectResetMaskStyleService";

/**
 * @description レイヤーに配置された全てのDisplayObjectのマスクスタイルをリセット
 *              Reset the mask style of all DisplayObjects placed on the layer
 *
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip, layer: Layer): void =>
{
    const activeCharacters = layer.getActiveCharacters(movie_clip.currentFrame);
    if (!activeCharacters.length) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const elements = element
        .querySelectorAll(`.layer-id-${layer.id}`);

    for (let idx = 0; activeCharacters.length > idx; ++idx) {

        const character = activeCharacters[idx];
        if (!character) {
            continue ;
        }

        const node = elements[character.depth] as HTMLElement;
        if (!node) {
            continue ;
        }

        // マスクのスタイルをリセット
        screenDisplayObjectResetMaskStyleService(node);
    }
};