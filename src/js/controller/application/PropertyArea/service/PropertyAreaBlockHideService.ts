/**
 * @description 指定のElementを非表示に更新
 *              Update to hide the specified Element
 *
 * @param  {array} names
 * @return {void}
 * @method
 * @public
 */
export const execute = (names: string[]): void =>
{
    for (let idx = 0; idx < names.length; ++idx) {

        const element: HTMLElement | null = document
            .getElementById(names[idx]);

        if (!element) {
            continue;
        }

        element.setAttribute("style", "display: none;");
    }
};