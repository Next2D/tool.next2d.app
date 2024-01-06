import { $TIMELINE_HEADER_LABEL_INDEX } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description ラベルElementの表示情報を更新
 *              Update label Element display information
 *
 * @param  {HTMLElement} element
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, frame: number): void =>
{
    const node: HTMLElement | undefined = element.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
    if (!node) {
        return ;
    }

    const scene = $getCurrentWorkSpace().scene;
    if (scene.hasLabel(frame)) {
        if (!node.classList.contains("frame-border-box-marker")) {
            node.setAttribute("class", "frame-border-box-marker");
            node.textContent = scene.getLabel(frame);
        }
    } else {
        if (!node.classList.contains("frame-border-box")) {
            node.setAttribute("class", "frame-border-box");
            node.textContent = "";
        }
    }
};