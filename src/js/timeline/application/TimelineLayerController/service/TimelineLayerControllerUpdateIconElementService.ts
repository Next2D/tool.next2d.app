import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerGetClassNameService } from "@/timeline/application/TimelineLayer/service/TimelineLayerGetClassNameService";

/**
 * @description レイヤーアイコンの更新
 *              Update layer icon
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    const element: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!element) {
        return ;
    }

    // 変更になるclass名を取得
    const afterClassName = timelineLayerGetClassNameService(layer.mode);

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

    const textElement = element
        .querySelector(".identification-view-text") as HTMLElement;

    if (!textElement) {
        return ;
    }

    const exitIconElement = element.querySelector(".timeline-exit-icon") as HTMLElement;
    if (!exitIconElement) {
        return ;
    }
    const insertIconElement = element.querySelector(".timeline-insert-icon") as HTMLElement;
    if (!insertIconElement) {
        return ;
    }

    switch (layer.mode) {

        case 2: // マスクレイヤー
        case 4: // ガイドレイヤー
            if (textElement.classList.contains("view-text")) {
                textElement.classList.remove("view-text");
            }
            if (!textElement.classList.contains("view-in-text")) {
                textElement.classList.add("view-in-text");
            }
            break;

        default:
            if (!textElement.classList.contains("view-text")) {
                textElement.classList.add("view-text");
            }
            if (textElement.classList.contains("view-in-text")) {
                textElement.classList.remove("view-in-text");
            }
            exitIconElement.setAttribute("style", "display: none;");
            insertIconElement.setAttribute("style", "display: none;");
            break;

    }
};