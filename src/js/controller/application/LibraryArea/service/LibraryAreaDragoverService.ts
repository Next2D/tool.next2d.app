/**
 * @description ライブラリエリアのドラッグオーバーイベントの処理関数
 *              Function to handle drag-over events in the library area
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    event.stopPropagation();
    event.preventDefault();
};