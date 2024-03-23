/**
 * @description レイヤーコントローラーの挿入アイコンを非表示
 *              Hide the insert icon of the layer controller
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    const iconElement = element
        .querySelector(".timeline-insert-icon") as HTMLElement;

    // styleを初期化
    if (iconElement) {
        iconElement.setAttribute("style", "display: none;");
    }

    const exitElement = element
        .querySelector(".timeline-exit-icon") as HTMLElement;

    if (exitElement) {
        exitElement.setAttribute("style", "display: none;");
    }
};