import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as colorSettingUpdateAlphaOffsetElementValueService } from "@/controller/application/ColorSetting/service/ColorSettingUpdateAlphaOffsetElementValueService";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";

/**
 * @description 選択中のElementのアルファオフセット値を更新する
 *              Update the alpha offset value of the selected Element
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} alpha
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    alpha: number
): void => {

    // アクティブでない場合は何もしない
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

    // Elementの更新
    const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
    if (element) {
        // alphaを更新
        const container = element.querySelector(".canvas-container") as HTMLDivElement;
        if (container) {
            container.style.setProperty("--alpha", `${character.alpha}`);
        }

        // canvasのopacityも更新
        const canvas = element.querySelector("canvas");
        if (canvas) {
            canvas.style.opacity = `${character.alpha}`;
        }
    }

    // 選択中のElementがない場合は何もしない
    if (!movie_clip.selectedDepths.size
        || !movie_clip.isSingleSelectedOfDisplayObject()
    ) {
        return ;
    }

    // カラーエリアの値を更新
    colorSettingUpdateAlphaOffsetElementValueService(alpha);
};