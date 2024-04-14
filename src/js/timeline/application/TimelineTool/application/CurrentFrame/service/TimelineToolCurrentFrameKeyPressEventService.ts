/**
 * @description タイムラインのフレームInput Elementのキープレスイベント処理関数
 *              Keypress event processing function for the frame Input Element of the timeline
 *
 * @param  {KeyboardEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: KeyboardEvent): void =>
{
    if (event.key !== "Enter") {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    const element: HTMLInputElement | null = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    element.blur();
};