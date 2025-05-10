import { execute as toolAreaPointerMoveService } from "../service/ToolAreaPointerMoveService";
import { execute as toolAreaActivePointerUpUseCase } from "./ToolAreaActivePointerUpUseCase";
import { $TOOL_PREFIX } from "@/config/ToolConfig";
import { EventType } from "@/tool/domain/event/EventType";

/**
 * @description ツールエリアの移動関数をwindowに登録
 *              Register tool area move function in window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TOOL_PREFIX);

    if (!element) {
        return ;
    }

    // 移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        toolAreaPointerMoveService,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        toolAreaActivePointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        toolAreaActivePointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        toolAreaActivePointerUpUseCase
    );
};