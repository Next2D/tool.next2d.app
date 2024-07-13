import type { ToolImpl } from "@/interface/ToolImpl";
import type { RectangleTool } from "@/tool/domain/model/RectangleTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_RECTANGLE_NAME } from "@/config/ToolConfig";

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
    const tool: ToolImpl<RectangleTool> = $getDefaultTool($TOOL_RECTANGLE_NAME);
    if (!tool) {
        return ;
    }

    $setCursor(tool.cursor);
};