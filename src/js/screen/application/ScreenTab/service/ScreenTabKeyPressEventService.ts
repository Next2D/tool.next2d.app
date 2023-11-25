/**
 * @description Enterキーでfocusを終了
 *              Exit focus with Enter key
 *
 * @params {KeyboardEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: KeyboardEvent): void =>
{
    if(event.key !== "Enter") {
        return ;
    }

    if (!event.currentTarget) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();

    // 入力終了
    const element: HTMLElement = event.currentTarget as HTMLElement;
    element.blur();

    return event.preventDefault();
};