import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptEditorModalWindowMouseMoveService } from "../service/ScriptEditorModalWindowMouseMoveService";

/**
 * @description スクリプトエディタの移動の終了処理関数
 *              End processing function for script editor moves
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // windowイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, scriptEditorModalWindowMouseMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};