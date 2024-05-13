import { ToolImpl } from "@/interface/ToolImpl";
import { EventType } from "@/tool/domain/event/EventType";
import type { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import { execute as zoomPlusToolMouseOverEventUseCase } from "../service/ZoomPlusToolMouseOverEventService";
import { execute as zoomPlusToolMouseOutEventUseCase } from "../service/ZoomPlusToolMouseOutEventService";
import { execute as zoomPlusToolChangeCursorEventService } from "../service/ZoomPlusToolChangeCursorEventService";
import { execute as zoomPlusToolStageRectMouseDownEventUseCase } from "./ZoomPlusToolStageRectMouseDownEventUseCase";
import { execute as zoomPlusToolStartEventUseCase } from "./ZoomPlusToolStartEventUseCase";

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
    // ズームインツールの起動イベントを登録
    tool.addEventListener(EventType.START,
        zoomPlusToolStartEventUseCase
    );

    // スクリーンのマウスオーバーイベントを登録
    tool.addEventListener(EventType.MOUSE_OVER,
        zoomPlusToolMouseOverEventUseCase
    );

    // スクリーンのマウスアウトイベントを登録
    tool.addEventListener(EventType.MOUSE_OUT,
        zoomPlusToolMouseOutEventUseCase
    );

    // スクリーン移動中のカーソル変更のイベントを登録
    tool.addEventListener(EventType.CHANGE_CURSOR,
        zoomPlusToolChangeCursorEventService
    );

    // 範囲選択のイベントを登録
    tool.addEventListener(EventType.STAGE_RECT,
        zoomPlusToolStageRectMouseDownEventUseCase
    );
};