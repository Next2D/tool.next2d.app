import type { ITool } from "@/interface/ITool";
import { EventType } from "@/tool/domain/event/EventType";
import type { RoundRectTool } from "@/tool/domain/model/RoundRectTool";
import { execute as roundRectToolStartEventUseCase } from "./RoundRectToolStartEventUseCase";
import { execute as roundRectToolDrawRectPointerDownEventUseCase } from "./RoundRectToolDrawRectPointerDownEventUseCase";
import { execute as roundRectToolPointerOverEventService } from "../service/RoundRectToolPointerOverEventService";
import { execute as roundRectToolPointerOutEventService } from "../service/RoundRectToolPointerOutEventService";
import { execute as roundRectToolChangeCursorEventService } from "../service/RoundRectToolChangeCursorEventService";

/**
 * @description シェイプの角丸矩形ツールの初期起動ユースケース
 *              Initial startup use case of shape rounded rectangle tool
 *
 * @param  {CircleTool} tool
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool: ITool<RoundRectTool>): void =>
{
    // 起動イベントを登録
    tool.addEventListener(EventType.START,
        roundRectToolStartEventUseCase
    );

    // 範囲選択のイベントを登録
    tool.addEventListener(EventType.DRAW_RECT,
        roundRectToolDrawRectPointerDownEventUseCase
    );

    // スクリーンのマウスオーバーイベントを登録
    tool.addEventListener(EventType.POINTER_OVER,
        roundRectToolPointerOverEventService
    );

    // スクリーンのマウスアウトイベントを登録
    tool.addEventListener(EventType.POINTER_OUT,
        roundRectToolPointerOutEventService
    );

    // スクリーン移動中のカーソル変更のイベントを登録
    tool.addEventListener(EventType.CHANGE_CURSOR,
        roundRectToolChangeCursorEventService
    );
};