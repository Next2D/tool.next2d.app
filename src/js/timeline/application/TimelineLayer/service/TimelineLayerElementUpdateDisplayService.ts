/**
 * @description 指定のレイヤーElementのdisplayを更新
 *              Update the display of the specified Layer Element
 *
 * @param  {number} layer_id
 * @param  {string} display
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, display: "" | "none"): void =>
{
    const element: HTMLElement | null = document
        .getElementById(`layer-id-${layer_id}`);

    if (!element) {
        return ;
    }

    element.style.display = display;
};