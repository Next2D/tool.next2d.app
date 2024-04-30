import type { ToolImpl } from "@/interface/ToolImpl";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import { $setActiveTool } from "../../ToolUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as arrowToolDisplayObjectMouseDownEventUseCase } from "./ArrowToolDisplayObjectMouseDownEventUseCase";
import { execute as arrowToolScreenMouseDownEventUseCase } from "./ArrowToolScreenMouseDownEventUseCase";

/**
 * @description アローツールの初期起動ユースケース
 *              Arrow Tool initial startup use case
 *
 * @param  {ArrowTool} tool
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool: ToolImpl<ArrowTool>): void =>
{
    // TODO 各種イベントを登録

    // DisplayObject選択時のイベントを登録
    tool.addEventListener(EventType.DISPLAY_OBJRCY,
        arrowToolDisplayObjectMouseDownEventUseCase
    );

    // Screen選択時のイベントを登録
    tool.addEventListener(EventType.SCREEN,
        arrowToolScreenMouseDownEventUseCase
    );

    // 初期選択ツールとしてセット
    $setActiveTool(tool);
};