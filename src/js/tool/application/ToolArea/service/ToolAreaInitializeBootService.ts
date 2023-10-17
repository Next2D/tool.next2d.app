import { ToolImpl } from "../../../../interface/ToolImpl";
import { ArrowTool } from "../../../domain/model/ArrowTool";
import { FreeTransformTool } from "../../../domain/model/FreeTransformTool";
import { BucketTool } from "../../../domain/model/BucketTool";
import { CircleTool } from "../../../domain/model/CircleTool";
import { HandTool } from "../../../domain/model/HandTool";
import { PenTool } from "../../../domain/model/PenTool";
import { RectangleTool } from "../../../domain/model/RectangleTool";
import { RoundRectTool } from "../../../domain/model/RoundRectTool";
import { TextTool } from "../../../domain/model/TextTool";
import { ShapeTransformTool } from "../../../domain/model/ShapeTransformTool";
import { ZoomPlusTool } from "../../../domain/model/ZoomPlusTool";
import { ZoomMinusTool } from "../../../domain/model/ZoomMinusTool";
import { SaveTool } from "../../../domain/model/SaveTool";
import { LoadTool } from "../../../domain/model/LoadTool";
import { ExportTool } from "../../../domain/model/ExportTool";
import { UserSettingTool } from "../../../domain/model/UserSettingTool";

/**
 * @description 各種ツールを起動
 *              Launch various tools
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void[]> =>
{
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
        ZoomPlusTool,
        ZoomMinusTool,
        SaveTool,
        LoadTool,
        ExportTool,
        UserSettingTool
    ];

    // 各ツールを起動
    const promises: Promise<void>[] = [];
    for (let idx: number = 0; idx < tools.length; ++idx) {
        const Tool: ToolImpl<any> = tools[idx];
        const tool = new Tool();
        if (!tool.initialize) {
            continue;
        }
        tool.initialize();
    }

    return Promise.all(promises);
};