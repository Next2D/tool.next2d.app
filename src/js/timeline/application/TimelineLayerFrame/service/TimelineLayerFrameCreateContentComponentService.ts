import { execute as timelineLayerFrameContentComponent } from "../component/TimelineLayerFrameContentComponent";
/**
 * @description 指定レイヤーのフレームElementを追加
 *              Add frame Element on specified layer
 *
 * @param  {HTMLElement} element
 * @param  {number} index
 * @param  {number} length
 * @param  {number} layer_id
 * @param  {number} left_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    element: HTMLElement,
    index: number,
    length: number,
    layer_id: number,
    left_frame: number
): void => {

    for (let idx = index; idx < length; ++idx) {
        element.insertAdjacentHTML("beforeend",
            timelineLayerFrameContentComponent(layer_id, left_frame + idx)
        );
    }
};