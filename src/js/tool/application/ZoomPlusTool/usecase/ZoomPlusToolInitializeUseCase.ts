import { ToolImpl } from "@/interface/ToolImpl";
import { EventType } from "@/tool/domain/event/EventType";
import type { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import { execute as zoomPlusToolMouseOverEventUseCase } from "./ZoomPlusToolMouseOverEventUseCase";
import { execute as zoomPlusToolMouseOutEventUseCase } from "./ZoomPlusToolMouseOutEventUseCase";
import { execute as zoomPlusToolChangeCursorEventService } from "../service/ZoomPlusToolChangeCursorEventService";

/**
 * @description スームアップツールの初期起動ユースケース
 *              Zoom up tool initial startup use case
 *
 * @param  {ZoomPlusTool} tool
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool: ToolImpl<ZoomPlusTool>): void =>
{
    tool.addEventListener(EventType.MOUSE_OVER,
        zoomPlusToolMouseOverEventUseCase
    );

    tool.addEventListener(EventType.MOUSE_OUT,
        zoomPlusToolMouseOutEventUseCase
    );

    tool.addEventListener(EventType.CHANGE_CURSOR,
        zoomPlusToolChangeCursorEventService
    );
};