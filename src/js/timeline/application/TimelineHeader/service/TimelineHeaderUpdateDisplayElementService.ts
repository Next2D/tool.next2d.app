import { $TIMELINE_HEADER_DISPLAY_INDEX } from "@/config/TimelineConfig";

/**
 * @description 表示Elementの表示情報を更新
 *              Updated display information for Script Element
 *
 * @param  {HTMLElement} element
 * @param  {number} frame
 * @param  {number} fps
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, frame: number, fps: number): void =>
{
    const node: HTMLElement | undefined = element.children[$TIMELINE_HEADER_DISPLAY_INDEX] as HTMLElement;
    if (!node) {
        return ;
    }

    if (frame % 5 === 0) {
        if (!node.classList.contains("frame-border-end")) {
            node.setAttribute("class", "frame-border-end");
        }
    } else {
        if (!node.classList.contains("frame-border")) {
            node.setAttribute("class", "frame-border");
        }
    }

    if (frame % fps === 0 && fps > 4) {
        const value: string = `${frame / fps}s`;
        if (!node.textContent || node.textContent !== value) {
            node.textContent = value;
        }
    } else {
        if (node.textContent) {
            node.textContent = "";
        }
    }
};