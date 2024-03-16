/**
 * @description グループウィンドウのマウスムーブイベント
 *              Mouse move event of group window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();
};