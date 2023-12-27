import { EventType } from "@/tool/domain/event/EventType";
import { $setLockState } from "../../TimelineUtil";

/**
 * @description 連続したロックイベントの終了処理関数
 *              End processing function for consecutive lock events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 状態を更新
    $setLockState(false);

    // イベント削除
    window.removeEventListener(EventType.MOUSE_UP, execute);
};