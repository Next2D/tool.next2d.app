import type { ITool } from "@/interface/ITool";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as textRectHideService } from "@/screen/application/TextRect/service/TextRectHideService";
import { execute as textToolDrawRectPointerMoveEventUseCase } from "./TextToolDrawRectPointerMoveEventUseCase";
import { $SCREEN_DRAW_TEXT_ID } from "@/config/ScreenConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as timelineAreaAddItemToMovieClipService } from "@/timeline/application/TimelineArea/service/TimelineAreaAddItemToMovieClipService";

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

    const tool: ITool<ArrowTool> = $getDefaultTool($TOOL_ARROW_NAME);
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
    const top  = rectElement.offsetTop;

    // 範囲選択を非表示に
    textRectHideService();

    const workSpace = $getCurrentWorkSpace();

    // 新規Textをライブラリに追加
    const path = `Text_${workSpace.nextLibraryId}`;
    const externalLibrary = new ExternalLibrary(workSpace);
    const text = externalLibrary.addNewText(path, width, height);
    if (!text) {
        return ;
    }

    // 親のMovieClipと拡大・縮小を考慮した補正座標を計算
    await timelineAreaAddItemToMovieClipService(
        left - $getScreenOffsetLeft(), // x座標
        top - $getScreenOffsetTop(), // y座標
        path
    );
};