import { $setStandbyMoveState } from "../TimelineAreaUtil";

/**
 * @description タイムラインエリアからマウスが外れた処理
 *              Processing of mouse movement off the timeline area
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

    // 長押し待機モードをoffにする
    $setStandbyMoveState(false);
};