import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateRedOffsetElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateRedOffsetElementValueService";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";

/**
 * @description 選択中のElementの赤色オフセット値を更新する
 *              Update the red offset value of the selected Element
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
            const colorTransform = character.colorTransform;
            const r = Math.max(0, Math.min(255 * colorTransform[0] + colorTransform[4], 255));
            const g = Math.max(0, Math.min(255 * colorTransform[1] + colorTransform[5], 255));
            const b = Math.max(0, Math.min(255 * colorTransform[2] + colorTransform[6], 255));
            container.style.setProperty("--color-transform", `${r} ${g} ${b}`);
        }
    }

    // 選択中のElementがない場合は何もしない
    if (!movie_clip.selectedDepths.size
        || movie_clip.selectedDepths.size > 1
    ) {
        return ;
    }

    // カラーエリアの値を更新
    colorSettingUpdateRedOffsetElementValueService(red);
};