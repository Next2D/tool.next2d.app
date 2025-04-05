import { $setMouseState } from "../../TimelineUtil";
import { $setStandbyMoveState } from "../TimelineAreaUtil";

/**
 * @description タイムラインエリアのマウスアップイベント
 *              Mouse-up events in the timeline area.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // マウスの状態管理をアップに更新
    $setMouseState("up");

    // 長押しモードをOff
    $setStandbyMoveState(false);
};