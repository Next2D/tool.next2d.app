import { $TOOL_TEXT_NAME } from "@/config/ToolConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import type { TextTool } from "@/tool/domain/model/TextTool";
import type { ToolImpl } from "@/interface/ToolImpl";

/**
 * @description テキストツールをアクティブにする
 *              Make the text tool active
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

    $setActiveTool(tool);
};