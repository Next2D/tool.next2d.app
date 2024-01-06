import { $TIMELINE_HEADER_FRAME_INDEX } from "@/config/TimelineConfig";

/**
 * @description フレーム数表示のElementを更新
 *              Updated Element for frame count display
 *
 * @param  {HTMLElement} element
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, frame: number): void =>
{
    const node: HTMLElement | undefined = element.children[$TIMELINE_HEADER_FRAME_INDEX] as HTMLElement;
    if (!node) {
        return ;
    }

    if (frame % 5 === 0) {
        const value: string = `${frame}`;
        if (!node.textContent || node.textContent !== value) {
            node.textContent = value;
        }
    } else {
        if (node.textContent) {
            node.textContent = "";
        }
    }
};