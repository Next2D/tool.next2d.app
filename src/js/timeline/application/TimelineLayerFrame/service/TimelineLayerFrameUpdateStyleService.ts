import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のフレームElementのStyleを更新
 *              Update the Style of the specified Frame Element
 *
 * @param  {HTMLElement} element
 * @param  {number} left_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, left_frame: number): void =>
{
    let frames: number[] | null = null;

    const layerId = parseInt(element.dataset.layerId as NonNullable<string>);
    const targetLayers = timelineLayer.targetLayers;
    if (targetLayers.size && targetLayers.has(layerId)) {
        frames = targetLayers.get(layerId) as NonNullable<Array<number>>;
    }

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
        if (frames && frames.indexOf(frame) > -1) {
            classValues.push("frame-active");
        }

        node.setAttribute("data-frame", `${frame}`);
        node.setAttribute("data-frame-state", "empty");
        node.setAttribute("class", classValues.join(" "));
    }
};