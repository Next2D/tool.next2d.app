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
    const children: HTMLCollection = element.children;
    const length: number = children.length;
    for (let idx = 0; idx < length; ++idx) {

        const node: HTMLElement | undefined = children[idx] as HTMLElement;
        if (!node) {
            continue;
        }

        const frame = left_frame + idx;
        node.setAttribute("data-frame", `${frame}`);
        node.setAttribute("data-frame-state", "empty");
        node.setAttribute("class", frame % 5 !== 0
            ? "frame"
            : "frame frame-pointer"
        );
    }
};