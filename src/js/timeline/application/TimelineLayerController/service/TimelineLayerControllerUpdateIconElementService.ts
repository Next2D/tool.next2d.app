import type { Layer } from "@/core/domain/model/Layer";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerGetClassNameService } from "@/timeline/application/TimelineLayer/service/TimelineLayerGetClassNameService";

/**
 * @description レイヤーアイコンの更新
 *              Update layer icon
 *
 * @param  {Layer} layer
 * @param  {number} before_mode
 * @param  {number} after_mode
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    layer: Layer,
    before_mode: LayerModeImpl,
    after_mode: LayerModeImpl
): void => {

    const element: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!element) {
        return ;
    }

    // 現在のclass名を取得
    const beforeClassName = timelineLayerGetClassNameService(before_mode);

    // 変更になるclass名を取得
    const afterClassName = timelineLayerGetClassNameService(after_mode);

    // 現在のクラス名からElementを取得
    const iconElement = element.querySelector(`.${beforeClassName}`) as HTMLElement;
    if (!iconElement) {
        return ;
    }

    // classを更新
    iconElement.classList.remove(beforeClassName);
    iconElement.classList.add(afterClassName);
};