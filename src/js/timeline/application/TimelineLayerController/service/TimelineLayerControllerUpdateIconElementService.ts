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
    after_mode: LayerModeImpl
): void => {

    const element: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!element) {
        return ;
    }

    // 変更になるclass名を取得
    const afterClassName = timelineLayerGetClassNameService(after_mode);

    // 現在のクラス名からElementを取得
    const iconElement = element.querySelector(".identification-class") as HTMLElement;
    if (!iconElement) {
        return ;
    }

    const classList = iconElement.classList;
    for (let idx = 0; idx < classList.length; ++idx) {
        const className = classList[idx];
        if (className === "identification-class") {
            continue;
        }

        if (className === afterClassName) {
            continue;
        }

        iconElement.classList.remove(className);
    }

    // レイヤータイプのクラスを追加
    if (!iconElement.classList.contains(afterClassName)) {
        iconElement.classList.add(afterClassName);
    }
};