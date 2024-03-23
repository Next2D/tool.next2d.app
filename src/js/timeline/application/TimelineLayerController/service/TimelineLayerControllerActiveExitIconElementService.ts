/**
 * @description レイヤーコントローラーの親子関係の解除アイコンを表示
 *              Display the parent-child relationship release icon of the layer controller
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    const exitElement = element
        .querySelector(".timeline-exit-icon") as HTMLElement;

    if (!exitElement) {
        return ;
    }

    // styleを初期化
    exitElement.setAttribute("style", "");
};