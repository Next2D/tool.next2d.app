import type { ToolImpl } from "@/interface/ToolImpl";
import { EventType } from "@/tool/domain/event/EventType";
import type { CircleTool } from "@/tool/domain/model/CircleTool";
import { execute as circleToolStartEventUseCase } from "./CircleToolStartEventUseCase";
import { execute as circleToolDrawRectMouseDownEventUseCase } from "./CircleToolDrawRectMouseDownEventUseCase";
import { execute as circleToolMouseOverEventService } from "../service/CircleToolMouseOverEventService";
import { execute as circleToolMouseOutEventService } from "../service/CircleToolMouseOutEventService";
import { execute as circleToolChangeCursorEventService } from "../service/CircleToolChangeCursorEventService";

/**
 * @description シェイプの円ツールの初期起動ユースケース
 *              Shape Circle Tool initial startup use case
 *
 * @param  {ArrowTool} tool
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool: ToolImpl<CircleTool>): void =>
{
    // 起動イベントを登録
    tool.addEventListener(EventType.START,
        circleToolStartEventUseCase
    );

    // 範囲選択のイベントを登録
    tool.addEventListener(EventType.DRAW_RECT,
        circleToolDrawRectMouseDownEventUseCase
    );

    // スクリーンのマウスオーバーイベントを登録
    tool.addEventListener(EventType.MOUSE_OVER,
        circleToolMouseOverEventService
    );

    // スクリーンのマウスアウトイベントを登録
    tool.addEventListener(EventType.MOUSE_OUT,
        circleToolMouseOutEventService
    );

    // スクリーン移動中のカーソル変更のイベントを登録
    tool.addEventListener(EventType.CHANGE_CURSOR,
        circleToolChangeCursorEventService
    );
};