import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerWindowMouseMoveUseCase } from "../service/TimelineLayerControllerWindowMouseMoveService";
import { $setCursor } from "@/global/GlobalUtil";

/**
 * @description レイヤーコントローラーウィンドウのマウスアップ処理関数
 *              Mouse up processing function for the layer controller window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("auto");

    // イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineLayerControllerWindowMouseMoveUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};