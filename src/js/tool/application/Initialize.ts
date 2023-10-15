
import type { ToolImpl } from "../../interface/ToolImpl";
import { EventType } from "../../tool/domain/event/EventType";
import { ArrowTool } from "../domain/model/ArrowTool";
import { FreeTransformTool } from "../domain/model/FreeTransformTool";
import { BucketTool } from "../domain/model/BucketTool";
import { CircleTool } from "../domain/model/CircleTool";
import { HandTool } from "../domain/model/HandTool";
import { PenTool } from "../domain/model/PenTool";
import { RectangleTool } from "../domain/model/RectangleTool";
import { RoundRectTool } from "../domain/model/RoundRectTool";
import { TextTool } from "../domain/model/TextTool";
import { ShapeTransformTool } from "../domain/model/ShapeTransformTool";
import { ZoomTool } from "../domain/model/ZoomTool";
import { ZoomMinusTool } from "../domain/model/ZoomMinusTool";
import { SaveTool } from "../domain/model/SaveTool";
import { LoadTool } from "../domain/model/LoadTool";
import { ExportTool } from "../domain/model/ExportTool";
import { UserSettingTool } from "../domain/model/UserSettingTool";
import { execute as toolAreaMouseMoveEventService } from "./service/ToolAreaMouseMoveEventService";
import { execute as toolAreaMouseOutEventService } from "../application/service/ToolAreaMouseOutEventService";
import { execute as toolAreaMouseDownEventService } from "../application/service/ToolAreaMouseDownEventService";

/**
 * @description 起動対象のToolクラスの配列
 *              Array of Tool classes to be invoked
 *
 * @private
 */
const tools: ToolImpl<any>[] = [
    ArrowTool,
    FreeTransformTool,
    BucketTool,
    CircleTool,
    HandTool,
    PenTool,
    RectangleTool,
    RoundRectTool,
    TextTool,
    ShapeTransformTool,
    ZoomTool,
    ZoomMinusTool,
    SaveTool,
    LoadTool,
    ExportTool,
    UserSettingTool
];

/**
 * @description ツールエリアの初期起動関数
 *              Initial startup function of the tool area
 *
 * @return {void}
 * @method
 * @private
 */
const _$registerEvent = (): void =>
{
    const element: HTMLElement | null = document.getElementById("tools");
    if (!element) {
        return ;
    }

    // ツールエリア内でのマウス移動の処理
    element.addEventListener(EventType.MOUSE_DOWN, (): void =>
    {
        toolAreaMouseDownEventService();
    });

    // ツールエリア内でのマウス移動の処理
    element.addEventListener(EventType.MOUSE_MOVE, (event: PointerEvent): void =>
    {
        toolAreaMouseMoveEventService(event);
    });

    // ツールエリアからマウスが外れた場合の処理
    element.addEventListener(EventType.MOUSE_OUT, (event: PointerEvent): void =>
    {
        toolAreaMouseOutEventService(event);
    });
};

/**
 * @description ツールエリアの初期起動関数
 *              Initial startup function of the tool area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // ツールエリアの移動イベントを登録
    _$registerEvent();

    // 各ツールを起動
    const promises: Promise<void>[] = [];
    for (let idx: number = 0; idx < tools.length; ++idx) {
        const Tool: ToolImpl<any> = tools[idx];
        const tool = new Tool();
        if (!tool.initialize) {
            continue;
        }
        promises.push(tool.initialize());
    }

    await Promise.all(promises);
};