import { ToolImpl } from "@/interface/ToolImpl";
import { EventType } from "@/tool/domain/event/EventType";
import type { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import { execute as zoomMinusToolMouseOverEventUseCase } from "./ZoomMinusToolMouseOverEventUseCase";
import { execute as zoomMinusToolMouseOutEventUseCase } from "./ZoomMinusToolMouseOutEventUseCase";
import { execute as zoomMinusToolChangeCursorEventService } from "../service/ZoomMinusToolChangeCursorEventService";

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
        zoomMinusToolMouseOverEventUseCase
    );

    tool.addEventListener(EventType.MOUSE_OUT,
        zoomMinusToolMouseOutEventUseCase
    );

    tool.addEventListener(EventType.CHANGE_CURSOR,
        zoomMinusToolChangeCursorEventService
    );
};