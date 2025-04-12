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
    if (event.key !== "Enter") {
        return ;
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();

    // 入力終了
    element.blur();
};