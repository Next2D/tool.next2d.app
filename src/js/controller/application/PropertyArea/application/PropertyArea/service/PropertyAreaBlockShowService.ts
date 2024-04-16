/**
 * @description 指定のElementを表示に更新
 *              Update specified Element to display
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

        element.setAttribute("style", "");
    }
};