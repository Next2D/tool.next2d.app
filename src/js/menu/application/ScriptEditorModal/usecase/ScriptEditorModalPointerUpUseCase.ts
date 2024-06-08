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
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // windowイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE, scriptEditorModalPointerMoveService);
    element.removeEventListener(EventType.MOUSE_UP, execute);
};