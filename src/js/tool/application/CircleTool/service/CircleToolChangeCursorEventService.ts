import type { ToolImpl } from "@/interface/ToolImpl";
import type { CircleTool } from "@/tool/domain/model/CircleTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_CIRCLE_NAME } from "@/config/ToolConfig";

/**
 * @description カーソルを変更する
 *              Change the cursor
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

    $setCursor(tool.cursor);
};