import { $setMouseState } from "../../TimelineUtil";

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
};