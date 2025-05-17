import type { ITool } from "@/interface/ITool";
import { EventType } from "@/tool/domain/event/EventType";
import type { CircleTool } from "@/tool/domain/model/CircleTool";
import { execute as circleToolStartEventUseCase } from "./CircleToolStartEventUseCase";
import { execute as circleToolDrawRectPointerDownEventUseCase } from "./CircleToolDrawRectPointerDownEventUseCase";
import { execute as circleToolPointerOverEventService } from "../service/CircleToolPointerOverEventService";
import { execute as circleToolPointerOutEventService } from "../service/CircleToolPointerOutEventService";
import { execute as circleToolChangeCursorEventService } from "../service/CircleToolChangeCursorEventService";

/**
 * @description シェイプの円ツールの初期起動ユースケース
 *              Shape Circle Tool initial startup use case
 *
 * @param  {CircleTool} tool
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool: ITool<CircleTool>): void =>
{
    // 起動イベントを登録
    tool.addEventListener(EventType.START,
        circleToolStartEventUseCase
    );

    // 範囲選択のイベントを登録
    tool.addEventListener(EventType.DRAW_RECT,
        circleToolDrawRectPointerDownEventUseCase
    );

    // スクリーンのマウスオーバーイベントを登録
    tool.addEventListener(EventType.POINTER_OVER,
        circleToolPointerOverEventService
    );

    // スクリーンのマウスアウトイベントを登録
    tool.addEventListener(EventType.POINTER_OUT,
        circleToolPointerOutEventService
    );

    // スクリーン移動中のカーソル変更のイベントを登録
    tool.addEventListener(EventType.CHANGE_CURSOR,
        circleToolChangeCursorEventService
    );
};