import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptEditorModalPointerMoveService } from "../service/ScriptEditorModalPointerMoveService";
import { execute as scriptEditorModalPointerUpUseCase } from "./ScriptEditorModalPointerUpUseCase";

/**
 * @description スクリプトエディタの移動処理を登録
 *              Register Script Editor move process
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

    // windowイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(EventType.MOUSE_MOVE, scriptEditorModalPointerMoveService);
    element.addEventListener(EventType.MOUSE_UP, scriptEditorModalPointerUpUseCase);
};