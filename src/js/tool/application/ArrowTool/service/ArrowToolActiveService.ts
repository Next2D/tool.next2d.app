import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import type { ITool } from "@/interface/ITool";

/**
 * @description 矢印ツールをアクティブにする
 *              Make the arrow tool active
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const tool: ITool<ArrowTool> = $getDefaultTool($TOOL_ARROW_NAME);
    if (!tool) {
        return ;
    }

    $setActiveTool(tool);
};