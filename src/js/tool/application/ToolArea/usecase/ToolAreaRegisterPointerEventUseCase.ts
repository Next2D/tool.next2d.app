import { execute as toolAreaActiveWindowMoveService } from "../service/ToolAreaActivePointerMoveService";
import { execute as toolAreaActiveWindowMouseUpUseCase } from "../service/ToolAreaActiveWindowMouseUpService";
import { $TOOL_PREFIX } from "@/config/ToolConfig";

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
    element.onpointermove = toolAreaActiveWindowMoveService;
    element.onpointerup   = toolAreaActiveWindowMouseUpUseCase;
    element.setPointerCapture(event.pointerId);
};