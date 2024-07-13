import { $TOOL_CIRCLE_NAME } from "@/config/ToolConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import type { CircleTool } from "@/tool/domain/model/CircleTool";
import type { ToolImpl } from "@/interface/ToolImpl";

/**
 * @description 円ツールをアクティブにする
 *              Make the circle tool active
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const tool: ToolImpl<CircleTool> = $getDefaultTool($TOOL_CIRCLE_NAME);
    if (!tool) {
        return ;
    }

    $setActiveTool(tool);
};