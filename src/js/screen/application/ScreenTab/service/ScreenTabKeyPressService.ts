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

    if (!event.target) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();

    (event.target as HTMLElement).blur();

    return event.preventDefault();
};