import type { ToolImpl } from "@/interface/ToolImpl";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenDisplayObjectMouseDownEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectMouseDownEventUseCase";
import { execute as screenAreaArrowToolMouseDownEventUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaArrowToolMouseDownEventUseCase";
import { execute as arrowToolStageRectMouseDownEventUseCase } from "./ArrowToolStageRectMouseDownEventUseCase";
import { execute as arrowToolActiveService } from "../service/ArrowToolActiveService";
import { execute as arrowToolStartEventUseCase } from "./ArrowToolStartEventUseCase";

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
    // 起動イベントを登録
    tool.addEventListener(EventType.START,
        arrowToolStartEventUseCase
    );

    // DisplayObject選択時のイベントを登録
    tool.addEventListener(EventType.DISPLAY_OBJRCY,
        screenDisplayObjectMouseDownEventUseCase
    );

    // Screen選択時のイベントを登録
    tool.addEventListener(EventType.SCREEN,
        screenAreaArrowToolMouseDownEventUseCase
    );

    // 範囲選択のイベントを登録
    tool.addEventListener(EventType.STAGE_RECT,
        arrowToolStageRectMouseDownEventUseCase
    );

    // 初期選択ツールとしてセット
    arrowToolActiveService();
};