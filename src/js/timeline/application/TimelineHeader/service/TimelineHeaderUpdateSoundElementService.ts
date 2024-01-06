import { $TIMELINE_HEADER_SOUND_INDEX } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description サウンドElementの表示情報を更新
 *              Updated display information for Sound Element
 *
 * @param  {HTMLElement} element
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, frame: number): void =>
{
    const node: HTMLElement | undefined = element.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;
    if (!node) {
        return ;
    }

    if ($getCurrentWorkSpace().scene.hasSound(frame)) {
        if (!node.classList.contains("frame-border-box-sound")) {
            node.setAttribute("class", "frame-border-box-sound");
        }
    } else {
        if (!node.classList.contains("frame-border-box")) {
            node.setAttribute("class", "frame-border-box");
        }
    }
};