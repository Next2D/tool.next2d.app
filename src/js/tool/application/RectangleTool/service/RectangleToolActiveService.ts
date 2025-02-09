import { $TOOL_RECTANGLE_NAME } from "@/config/ToolConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import type { RectangleTool } from "@/tool/domain/model/RectangleTool";
import type { ITool } from "@/interface/ITool";

/**
 * @description 矩形ツールをアクティブにする
 *              Make the rectangle tool active
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const tool: ITool<RectangleTool> = $getDefaultTool($TOOL_RECTANGLE_NAME);
    if (!tool) {
        return ;
    }

    $setActiveTool(tool);
};