/**
 * @description レイヤーコントローラーの挿入アイコンを表示
 *              Display the insert icon of the layer controller
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

    if (!iconElement) {
        return ;
    }

    // styleを初期化
    iconElement.setAttribute("style", "");
};