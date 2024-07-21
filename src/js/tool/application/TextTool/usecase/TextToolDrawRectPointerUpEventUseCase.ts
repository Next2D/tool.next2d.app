import type { ToolImpl } from "@/interface/ToolImpl";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as textRectHideService } from "@/screen/application/TextRect/service/TextRectHideService";
import { execute as textToolDrawRectPointerMoveEventUseCase } from "./TextToolDrawRectPointerMoveEventUseCase";
import { $SCREEN_DRAW_TEXT_ID } from "@/config/ScreenConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { $getScrollLimitY } from "@/timeline/application/TimelineUtil";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";

/**
 * @description 描画の範囲選択のマウスアップイベント
 *              Mouse-up event of drawing range selection
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // イベントの伝播を停止
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントを解除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE,
        textToolDrawRectPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.MOUSE_UP, execute);

    const tool: ToolImpl<ArrowTool> = $getDefaultTool($TOOL_ARROW_NAME);
    if (tool) {
        $setActiveTool(tool);
    }

    // 範囲選択のElementを表示
    const rectElement: HTMLElement | null = document
        .getElementById($SCREEN_DRAW_TEXT_ID);

    if (!rectElement) {
        textRectHideService();
        return ;
    }

    const width  = rectElement.clientWidth;
    const height = rectElement.clientHeight;
    if (!width || !height) {
        textRectHideService();
        return ;
    }

    // 非表示になる前の位置を取得
    // fixed logic
    const left = rectElement.offsetLeft;
    const top = rectElement.offsetTop;

    // 範囲選択を非表示に
    textRectHideService();

    // 配置先を計算
    const x = left - $getScreenOffsetLeft();
    const y = top - $getScreenOffsetTop();

    console.log(x, y);
};