import { $TIMELINE_HEADER_SCRIPT_INDEX } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description スクリプトElementの表示情報を更新
 *              Updated display information for Script Element
 *
 * @param  {HTMLElement} element
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, frame: number): void =>
{
    const node: HTMLElement | undefined = element.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
    if (!node) {
        return ;
    }

    if ($getCurrentWorkSpace().scene.hasAction(frame)) {
        // スクリプトがあればアイコンをセット
        if (!node.classList.contains("frame-border-box-action")) {
            node.setAttribute("class", "frame-border-box-action");
        }
    } else {
        // スクリプトがない時は通常のクラス設定
        if (!node.classList.contains("frame-border-box")) {
            node.setAttribute("class", "frame-border-box");
        }
    }
};