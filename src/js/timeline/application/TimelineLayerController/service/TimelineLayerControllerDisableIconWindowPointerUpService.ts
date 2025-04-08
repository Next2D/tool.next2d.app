import { EventType } from "@/tool/domain/event/EventType";
import { $setDisableState } from "../../TimelineUtil";

/**
 * @description 連続した表示イベントの終了処理関数
 *              End processing function for consecutive display events
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 状態を更新
    $setDisableState(false);

    // イベントの伝播を止める
    event.stopPropagation();

    // イベント削除
    window.removeEventListener(EventType.POINTER_UP, execute);
    window.removeEventListener(EventType.POINTER_CANCEL, execute);
};