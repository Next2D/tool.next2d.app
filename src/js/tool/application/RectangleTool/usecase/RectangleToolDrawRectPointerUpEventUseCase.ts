import { EventType } from "@/tool/domain/event/EventType";
import { execute as rectangleToolDrawRectPointerMoveEventUseCase } from "./RectangleToolDrawRectPointerMoveEventUseCase";
import { execute as drawRectHideService } from "@/screen/application/DrawRect/service/DrawRectHideService";
import { $SCREEN_DRAW_RECT_ID } from "@/config/ScreenConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import type { ToolImpl } from "@/interface/ToolImpl";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";

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
        rectangleToolDrawRectPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.MOUSE_UP, execute);

    const tool: ToolImpl<ArrowTool> = $getDefaultTool($TOOL_ARROW_NAME);
    if (tool) {
        $setActiveTool(tool);
    }

    // 範囲選択のElementを表示
    const rectElement: HTMLElement | null = document
        .getElementById($SCREEN_DRAW_RECT_ID);

    if (!rectElement) {
        drawRectHideService();
        return ;
    }

    const width  = rectElement.clientWidth;
    const height = rectElement.clientHeight;
    if (!width || !height) {
        drawRectHideService();
        return ;
    }

    // 非表示になる前の位置を取得
    const left = rectElement.offsetLeft;
    const top = rectElement.offsetTop;

    // 範囲選択を非表示に
    drawRectHideService();
};