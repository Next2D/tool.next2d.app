import { $getLayerFromElement } from "../../TimelineUtil";
import type { MovieClip } from "@/core/domain/model/MovieClip";

/**
 * @description 指定のフレームElementのStyleを更新
 *              Update the Style of the specified Frame Element
 *
 * @param  {MovieClip} movie_clip
 * @param  {HTMLElement} element
 * @param  {number} left_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    element: HTMLElement,
    left_frame: number
): void => {

    const layer = $getLayerFromElement(element);
    if (!layer) {
        return;
    }

    const startFrame = movie_clip.selectedStartFrame;
    const endFrame   = movie_clip.selectedEndFrame;

    const children: HTMLCollection = element.children;
    const length: number = children.length;
    for (let idx = 0; idx < length; ++idx) {

        const node: HTMLElement | undefined = children[idx] as HTMLElement;
        if (!node) {
            continue;
        }

        const frame = left_frame + idx;

        const classValues = [];
        classValues.push("frame");

        // 5フーレム毎のポインタークラスをセット
        if (frame % 5 === 0) {
            classValues.push("frame-pointer");
        }

        // アクティブフレームのクラスをセット
        if (startFrame > 0 && frame >= startFrame  && endFrame > frame) {
            classValues.push("frame-active");
        }

        node.setAttribute("data-frame", `${frame}`);
        node.setAttribute("data-frame-state", "empty");
        node.setAttribute("class", classValues.join(" "));
    }
};