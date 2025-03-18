import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptEditorModalPointerMoveService } from "../service/ScriptEditorModalPointerMoveService";

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
    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // windowイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, scriptEditorModalPointerMoveService);
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
};