import { $setStandbyMoveState } from "../PropertyAreaUtil";

/**
 * @description プロパティエリアからマウスが外れた処理
 *              Handling of mouse movement away from the property area
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