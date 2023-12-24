/**
 * @description フーレムInput Elementのマウスアウト処理関数
 *              Mouse-out processing function for Hoolem Input Element
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    event.stopPropagation();
    event.preventDefault();

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    element.style.cursor = "";
};