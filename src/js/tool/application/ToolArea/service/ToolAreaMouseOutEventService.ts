import { $setStandbyMoveState } from "../ToolAreaUtil";

/**
 * @description ツールエリアからマウスが外れた処理
 *              Handling of mouse off tool area
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