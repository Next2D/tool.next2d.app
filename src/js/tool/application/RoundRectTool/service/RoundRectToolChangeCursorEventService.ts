import type { ToolImpl } from "@/interface/ToolImpl";
import type { RoundRectTool } from "@/tool/domain/model/RoundRectTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_ROUND_RECT_NAME } from "@/config/ToolConfig";

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
    const tool: ToolImpl<RoundRectTool> = $getDefaultTool($TOOL_ROUND_RECT_NAME);
    if (!tool) {
        return ;
    }

    $setCursor(tool.cursor);
};