/**
 * @description 範囲選択のマウスムーブイベントの実行関数
 *              Execution function of the mouse-move event of the range selection
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を停止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        // TODO
    });
};