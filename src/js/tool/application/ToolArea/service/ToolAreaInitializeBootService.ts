import { ToolImpl } from "@/interface/ToolImpl";
import { ArrowTool } from "@/tool/domain/model/ArrowTool";
import { FreeTransformTool } from "@/tool/domain/model/FreeTransformTool";
import { BucketTool } from "@/tool/domain/model/BucketTool";
import { CircleTool } from "@/tool/domain/model/CircleTool";
import { HandTool } from "@/tool/domain/model/HandTool";
import { PenTool } from "@/tool/domain/model/PenTool";
import { RectangleTool } from "@/tool/domain/model/RectangleTool";
import { RoundRectTool } from "@/tool/domain/model/RoundRectTool";
import { TextTool } from "@/tool/domain/model/TextTool";
import { ShapeTransformTool } from "@/tool/domain/model/ShapeTransformTool";
import { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import { ZoomMinusTool } from "@/tool/domain/model/ZoomMinusTool";
import { SaveTool } from "@/tool/domain/model/SaveTool";
import { LoadTool } from "@/tool/domain/model/LoadTool";
import { ExportTool } from "@/tool/domain/model/ExportTool";
import { UserSettingTool } from "@/tool/domain/model/UserSettingTool";

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