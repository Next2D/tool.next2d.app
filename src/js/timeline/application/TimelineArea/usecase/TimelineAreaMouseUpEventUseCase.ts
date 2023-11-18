import { $setMouseState } from "../../TimelineUtil";
import { execute as timelineAreaActiveWindowMoveService } from "../service/TimelineAreaActiveWindowMoveService";

/**
 * @description タイムラインエリアのマウスアップイベント
 *              Mouse-up events in the timeline area.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // マウスの状態管理をアップに更新
    $setMouseState("up");

    // 状態更新
    timelineAreaActiveWindowMoveService(event);
};