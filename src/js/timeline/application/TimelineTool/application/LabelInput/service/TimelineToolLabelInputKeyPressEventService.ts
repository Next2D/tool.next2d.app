/**
 * @description ラベルInputのキープレスイベント
 *              Label Input Key Press Event
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

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    element.blur();
};