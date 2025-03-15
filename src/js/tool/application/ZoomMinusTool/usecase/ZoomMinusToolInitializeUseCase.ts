import type { ITool } from "@/interface/ITool";
import { EventType } from "@/tool/domain/event/EventType";
import type { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import { execute as zoomMinusToolMouseOverEventUseCase } from "../service/ZoomMinusToolMouseOverEventService";
import { execute as zoomMinusToolMouseOutEventUseCase } from "../service/ZoomMinusToolMouseOutEventService";
import { execute as zoomMinusToolChangeCursorEventService } from "../service/ZoomMinusToolChangeCursorEventService";
import { execute as zoomMinusToolStartEventUseCase } from "./ZoomMinusToolStartEventUseCase";
import { execute as zoomMinusToolScreenEventUseCase } from "./ZoomMinusToolScreenEventUseCase";

/**
 * @description スームアップツールの初期起動ユースケース
 *              Zoom up tool initial startup use case
 *
 * @param  {ZoomPlusTool} tool
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool: ITool<ZoomPlusTool>): void =>
{
    // ズームアウトツールの起動イベントを登録
    tool.addEventListener(EventType.START,
        zoomMinusToolStartEventUseCase
    );

    tool.addEventListener(EventType.POINTER_OVER,
        zoomMinusToolMouseOverEventUseCase
    );

    tool.addEventListener(EventType.POINTER_OUT,
        zoomMinusToolMouseOutEventUseCase
    );

    tool.addEventListener(EventType.CHANGE_CURSOR,
        zoomMinusToolChangeCursorEventService
    );

    tool.addEventListener(EventType.SCREEN,
        zoomMinusToolScreenEventUseCase
    );
};