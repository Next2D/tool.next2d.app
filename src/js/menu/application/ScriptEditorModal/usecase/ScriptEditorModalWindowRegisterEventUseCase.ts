import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptEditorModalWindowMouseMoveService } from "../service/ScriptEditorModalWindowMouseMoveService";
import { execute as scriptEditorModalWindowMouseUpUseCase } from "./ScriptEditorModalWindowMouseUpUseCase";

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

    // windowイベントを登録
    window.addEventListener(EventType.MOUSE_MOVE, scriptEditorModalWindowMouseMoveService);
    window.addEventListener(EventType.MOUSE_UP, scriptEditorModalWindowMouseUpUseCase);
};