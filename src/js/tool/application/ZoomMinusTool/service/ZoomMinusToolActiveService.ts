import { $TOOL_ZOOM_MINUS_NAME } from "@/config/ToolConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import type { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import type { ITool } from "@/interface/ITool";

/**
 * @description ズームアウトツールをアクティブにする
 *              Make the zoom out tool active
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const tool: ITool<ZoomPlusTool> = $getDefaultTool($TOOL_ZOOM_MINUS_NAME);
    if (!tool) {
        return ;
    }

    $setActiveTool(tool);
};