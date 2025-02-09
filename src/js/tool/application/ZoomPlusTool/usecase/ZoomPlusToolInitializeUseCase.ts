import { ITool } from "@/interface/ITool";
import { EventType } from "@/tool/domain/event/EventType";
import type { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import { execute as zoomPlusToolMouseOverEventService } from "../service/ZoomPlusToolMouseOverEventService";
import { execute as zoomPlusToolMouseOutEventService } from "../service/ZoomPlusToolMouseOutEventService";
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
export const execute = (tool: ITool<ZoomPlusTool>): void =>
{
    // ズームインツールの起動イベントを登録
    tool.addEventListener(EventType.START,
        zoomPlusToolStartEventUseCase
    );

    // スクリーンのマウスオーバーイベントを登録
    tool.addEventListener(EventType.POINTER_OVER,
        zoomPlusToolMouseOverEventService
    );

    // スクリーンのマウスアウトイベントを登録
    tool.addEventListener(EventType.POINTER_OUT,
        zoomPlusToolMouseOutEventService
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