import { EventType } from "@/tool/domain/event/EventType";
import { $setDisableState } from "../../TimelineUtil";

/**
 * @description 連続した表示イベントの終了処理関数
 *              End processing function for consecutive display events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 状態を更新
    $setDisableState(false);

    // イベント削除
    window.removeEventListener(EventType.MOUSE_UP, execute);
};