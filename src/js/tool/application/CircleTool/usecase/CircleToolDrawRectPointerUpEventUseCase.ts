import { EventType } from "@/tool/domain/event/EventType";
import { execute as circleToolDrawRectPointerMoveEventUseCase } from "./CircleToolDrawRectPointerMoveEventUseCase";
import { execute as drawRectHideService } from "@/screen/application/DrawRect/service/DrawRectHideService";
import { $SCREEN_DRAW_RECT_ID } from "@/config/ScreenConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import type { ToolImpl } from "@/interface/ToolImpl";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";

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
        circleToolDrawRectPointerMoveEventUseCase
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

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 新規Shapeをライブラリに追加
    const shapeId = workSpace.nextLibraryId;
    const externalLibrary = new ExternalLibrary(workSpace);
    externalLibrary.addNewShape(`Shape_${shapeId}`);

    // 親のMovieClipと拡大・縮小を考慮した補正座標を計算
    const x = (left - $getScreenOffsetLeft()) * workSpace.scale;
    const y = (top - $getScreenOffsetTop()) * workSpace.scale;

    // 先祖のmatrixを加算
    const concatenatedMatrix = $getConcatenatedMatrix();

    // 配置座標したGlobal座標をLocal座標に変換
    const matrix = new next2d.geom.Matrix(
        concatenatedMatrix[0], concatenatedMatrix[1], concatenatedMatrix[2],
        concatenatedMatrix[3], concatenatedMatrix[4], concatenatedMatrix[5]
    );
    matrix.invert();

    const localX = x * matrix.a + y * matrix.c + matrix.tx;
    const localY = x * matrix.b + y * matrix.d + matrix.ty;
    console.log(localX, localY);

    // const externalTimeline = new ExternalTimeline(workSpace, movieClip);
};