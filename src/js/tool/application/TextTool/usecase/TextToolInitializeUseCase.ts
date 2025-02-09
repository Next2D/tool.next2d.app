import type { ITool } from "@/interface/ITool";
import { EventType } from "@/tool/domain/event/EventType";
import type { TextTool } from "@/tool/domain/model/TextTool";
import { execute as textToolStartEventUseCase } from "./TextToolStartEventUseCase";
import { execute as textToolDrawRectMouseDownEventUseCase } from "./TextToolDrawRectMouseDownEventUseCase";
import { execute as textToolMouseOverEventService } from "../service/TextToolMouseOverEventService";
import { execute as textToolMouseOutEventService } from "../service/TextToolMouseOutEventService";
import { execute as textToolChangeCursorEventService } from "../service/TextToolChangeCursorEventService";

/**
 * @description テキストツールの初期起動ユースケース
 *              Text tool initial startup use case
 *
 * @param  {TextTool} tool
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool: ITool<TextTool>): void =>
{
    // 起動イベントを登録
    tool.addEventListener(EventType.START,
        textToolStartEventUseCase
    );

    // 範囲選択のイベントを登録
    tool.addEventListener(EventType.DRAW_RECT,
        textToolDrawRectMouseDownEventUseCase
    );

    // スクリーンのマウスオーバーイベントを登録
    tool.addEventListener(EventType.POINTER_OVER,
        textToolMouseOverEventService
    );

    // スクリーンのマウスアウトイベントを登録
    tool.addEventListener(EventType.POINTER_OUT,
        textToolMouseOutEventService
    );

    // スクリーン移動中のカーソル変更のイベントを登録
    tool.addEventListener(EventType.CHANGE_CURSOR,
        textToolChangeCursorEventService
    );
};