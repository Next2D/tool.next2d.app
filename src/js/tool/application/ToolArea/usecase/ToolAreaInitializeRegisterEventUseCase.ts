import { $TOOL_PREFIX } from "../../../../config/ToolConfig";
import { EventType } from "../../../domain/event/EventType";
import { execute as toolAreaMouseMoveEventService } from "../service/ToolAreaMouseMoveEventService";
import { execute as toolAreaMouseOutEventService } from "../service/ToolAreaMouseOutEventService";
import { execute as toolAreaMouseDownEventService } from "../service/ToolAreaMouseDownEventService";

/**
 * @description ツールエリアの初期起動時のイベント登録
 *              Registration of events at initial startup of the tool area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document.getElementById($TOOL_PREFIX);
    if (!element) {
        return ;
    }

    // ツールエリア内でのマウス移動の処理
    element.addEventListener(EventType.MOUSE_DOWN, (): void =>
    {
        toolAreaMouseDownEventService();
    });

    // ツールエリア内でのマウス移動の処理
    element.addEventListener(EventType.MOUSE_MOVE, (event: PointerEvent): void =>
    {
        toolAreaMouseMoveEventService(event);
    });

    // ツールエリアからマウスが外れた場合の処理
    element.addEventListener(EventType.MOUSE_OUT, (event: PointerEvent): void =>
    {
        toolAreaMouseOutEventService(event);
    });
};