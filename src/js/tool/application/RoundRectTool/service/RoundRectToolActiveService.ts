import { $TOOL_ROUND_RECT_NAME } from "@/config/ToolConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import type { RoundRectTool } from "@/tool/domain/model/RoundRectTool";
import type { ToolImpl } from "@/interface/ToolImpl";

/**
 * @description 角丸矩形ツールをアクティブにする
 *              Make the rounded rectangle tool active
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const tool: ToolImpl<RoundRectTool> = $getDefaultTool($TOOL_ROUND_RECT_NAME);
    if (!tool) {
        return ;
    }

    $setActiveTool(tool);
};