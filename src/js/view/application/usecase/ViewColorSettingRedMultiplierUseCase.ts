import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateRedMultiplierElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateRedMultiplierElementValueService";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";

/**
 * @description 選択中のElementの赤色値を更新する
 *              Update the red value of the selected Element
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} red
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    red: number
): void => {

    // 先祖のキャッシュを削除する
    timelineSceneListCacheRemoveService(work_space);

    // アクティブでない場合は何もしない
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

    // Elementの更新
    const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
    if (element) {
        // redを更新
        const container = element.querySelector(".canvas-container") as HTMLDivElement;
        if (container) {
            if (container.dataset.colorTransform !== "true") {
                container.dataset.colorTransform = "true";

                const canvas = element.querySelector("canvas");
                if (canvas) {
                    if (!canvas.dataset.base64) {
                        canvas.dataset.base64 = canvas.toDataURL();
                    }
                    container.style.setProperty("--mask", `url("${canvas.dataset.base64}")`);
                }
            }

            const colorTransform = character.colorTransform;
            const r = Math.max(0, Math.min(255 * colorTransform[0] + colorTransform[4], 255));
            const g = Math.max(0, Math.min(255 * colorTransform[1] + colorTransform[5], 255));
            const b = Math.max(0, Math.min(255 * colorTransform[2] + colorTransform[6], 255));
            container.style.setProperty("--color-transform", `${r} ${g} ${b}`);
        }
    }

    // 選択中のElementがない場合は何もしない
    if (!movie_clip.selectedDepths.size
        || !movie_clip.isSingleSelectedOfDisplayObject()
    ) {
        return ;
    }

    // カラーエリアの値を更新
    colorSettingUpdateRedMultiplierElementValueService(red);
};