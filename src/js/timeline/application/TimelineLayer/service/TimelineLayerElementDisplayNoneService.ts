/**
 * @description 指定のレイヤーElementを非表示にする
 *              Hide the specified Layer Element
 *
 * @param  {number} layer_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number): void =>
{
    const element: HTMLElement | null = document
        .getElementById(`layer-id-${layer_id}`);

    if (!element) {
        return ;
    }

    element.style.display = "none";
};