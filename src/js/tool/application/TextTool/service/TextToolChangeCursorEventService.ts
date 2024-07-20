import type { ToolImpl } from "@/interface/ToolImpl";
import type { TextTool } from "@/tool/domain/model/TextTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_TEXT_NAME } from "@/config/ToolConfig";

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
    const tool: ToolImpl<TextTool> = $getDefaultTool($TOOL_TEXT_NAME);
    if (!tool) {
        return ;
    }

    $setCursor(tool.cursor);
};