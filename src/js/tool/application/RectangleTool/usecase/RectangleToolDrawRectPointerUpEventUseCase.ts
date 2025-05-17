import type { ITool } from "@/interface/ITool";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as rectangleToolDrawRectPointerMoveEventUseCase } from "./RectangleToolDrawRectPointerMoveEventUseCase";
import { execute as drawRectHideService } from "@/screen/application/DrawRect/service/DrawRectHideService";
import { $SCREEN_DRAW_RECT_ID } from "@/config/ScreenConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { fillColor } from "@/tool/domain/model/FillColor";
import { strokeSize } from "@/tool/domain/model/StrokeSize";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { execute as timelineAreaAddItemToMovieClipService } from "@/timeline/application/TimelineArea/service/TimelineAreaAddItemToMovieClipService";
import { strokeColor } from "@/tool/domain/model/StrokeColor";

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

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントを解除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        rectangleToolDrawRectPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    const tool: ITool<ArrowTool> = $getDefaultTool($TOOL_ARROW_NAME);
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

    const workSpace = $getCurrentWorkSpace();

    // 新規Shapeをライブラリに追加
    const path = `Shape_${workSpace.nextLibraryId}`;
    const externalLibrary = new ExternalLibrary(workSpace);
    const shape = await externalLibrary.addNewShape(path);
    if (!shape) {
        drawRectHideService();
        return ;
    }

    // 描画範囲の計算（線の幅は拡大縮小に影響されない）
    const scale      = workSpace.scale;
    const position   = strokeSize.value / 2;
    const drawWidth  = width / scale + strokeSize.value;
    const drawHeight = height / scale + strokeSize.value;

    // 円の描画レコードを作成
    shape
        .graphics
        .beginFill(fillColor.value)
        .drawRect(position, position, drawWidth, drawHeight);

    // 生成した描画レコードの更新を適用
    await shape.applyGraphics();

    // 配置先を計算
    const x = left - $getScreenOffsetLeft();
    const y = top - $getScreenOffsetTop();

    // 親のMovieClipと拡大・縮小を考慮した補正座標を計算
    await timelineAreaAddItemToMovieClipService(x, y, path);

    // 線の描画レコードを作成
    if (strokeSize.value) {
        // 新規Shapeをライブラリに追加
        const path = `Shape_${workSpace.nextLibraryId}`;
        const externalLibrary = new ExternalLibrary(workSpace);
        const shape = await externalLibrary.addNewShape(path);
        if (!shape) {
            return ;
        }

        // 円の描画レコードを作成
        shape
            .graphics
            .lineStyle(strokeSize.value, strokeColor.value)
            .drawRect(position, position, drawWidth, drawHeight);

        // 生成した描画レコードの更新を適用
        await shape.applyGraphics();

        // 親のMovieClipと拡大・縮小を考慮した補正座標を計算
        await timelineAreaAddItemToMovieClipService(x, y, path);
    }

    // 範囲選択を非表示に
    drawRectHideService();
};