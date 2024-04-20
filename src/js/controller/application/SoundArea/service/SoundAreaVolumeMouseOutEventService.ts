/**
 * @description 音量Input Elementのマウスアウト処理関数
 *              Mouse out processing function of volume Input Element
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