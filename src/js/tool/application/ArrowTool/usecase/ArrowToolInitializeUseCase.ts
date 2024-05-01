import type { ToolImpl } from "@/interface/ToolImpl";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import { $setActiveTool } from "../../ToolUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenDisplayObjectMouseDownEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectMouseDownEventUseCase";
import { execute as screenAreaArrowToolMouseDownEventService } from "@/screen/application/ScreenArea/service/ScreenAreaArrowToolMouseDownEventService";
import { execute as stageRectMouseDownEventUseCase } from "@/screen/application/StageRect/usecase/StageRectMouseDownEventUseCase";

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
    // DisplayObject選択時のイベントを登録
    tool.addEventListener(EventType.DISPLAY_OBJRCY,
        screenDisplayObjectMouseDownEventUseCase
    );

    // Screen選択時のイベントを登録
    tool.addEventListener(EventType.SCREEN,
        screenAreaArrowToolMouseDownEventService
    );

    // 範囲選択のイベントを登録
    tool.addEventListener(EventType.STAGE_RECT,
        stageRectMouseDownEventUseCase
    );

    // 初期選択ツールとしてセット
    $setActiveTool(tool);
};