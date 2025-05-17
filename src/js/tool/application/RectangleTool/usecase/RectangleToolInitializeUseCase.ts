import type { ITool } from "@/interface/ITool";
import { EventType } from "@/tool/domain/event/EventType";
import type { RectangleTool } from "@/tool/domain/model/RectangleTool";
import { execute as rectangleToolStartEventUseCase } from "./RectangleToolStartEventUseCase";
import { execute as rectangleToolDrawRectPointerDownEventUseCase } from "./RectangleToolDrawRectPointerDownEventUseCase";
import { execute as rectangleToolPointerOverEventService } from "../service/RectangleToolPointerOverEventService";
import { execute as rectangleToolPointerOutEventService } from "../service/RectangleToolPointerOutEventService";
import { execute as rectangleToolChangeCursorEventService } from "../service/RectangleToolChangeCursorEventService";

/**
 * @description シェイプの矩形ツールの初期起動ユースケース
 *              Initial startup use case of shape rectangle tool
 *
 * @param  {CircleTool} tool
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool: ITool<RectangleTool>): void =>
{
    // 起動イベントを登録
    tool.addEventListener(EventType.START,
        rectangleToolStartEventUseCase
    );

    // 範囲選択のイベントを登録
    tool.addEventListener(EventType.DRAW_RECT,
        rectangleToolDrawRectPointerDownEventUseCase
    );

    // スクリーンのマウスオーバーイベントを登録
    tool.addEventListener(EventType.POINTER_OVER,
        rectangleToolPointerOverEventService
    );

    // スクリーンのマウスアウトイベントを登録
    tool.addEventListener(EventType.POINTER_OUT,
        rectangleToolPointerOutEventService
    );

    // スクリーン移動中のカーソル変更のイベントを登録
    tool.addEventListener(EventType.CHANGE_CURSOR,
        rectangleToolChangeCursorEventService
    );
};