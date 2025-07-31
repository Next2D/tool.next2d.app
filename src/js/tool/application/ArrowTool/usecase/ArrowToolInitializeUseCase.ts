import type { ITool } from "@/interface/ITool";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenDisplayObjectPointerDownEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectPointerDownEventUseCase";
import { execute as screenAreaArrowToolPointerDownEventUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaArrowToolPointerDownEventUseCase";
import { execute as arrowToolStageRectPointerDownEventUseCase } from "./ArrowToolStageRectPointerDownEventUseCase";
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
export const execute = (tool: ITool<ArrowTool>): void =>
{
    // 起動イベントを登録
    tool.addEventListener(EventType.START,
        arrowToolStartEventUseCase
    );

    // DisplayObject選択時のイベントを登録
    tool.addEventListener(EventType.DISPLAY_OBJRCY,
        screenDisplayObjectPointerDownEventUseCase
    );

    // Screen選択時のイベントを登録
    tool.addEventListener(EventType.SCREEN,
        screenAreaArrowToolPointerDownEventUseCase
    );

    // 範囲選択のイベントを登録
    tool.addEventListener(EventType.STAGE_RECT,
        arrowToolStageRectPointerDownEventUseCase
    );

    // 初期選択ツールとしてセット
    arrowToolActiveService();
};