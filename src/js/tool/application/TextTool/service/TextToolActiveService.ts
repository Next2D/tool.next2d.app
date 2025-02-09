import { $TOOL_TEXT_NAME } from "@/config/ToolConfig";
import { $getDefaultTool, $setActiveTool } from "../../ToolUtil";
import type { TextTool } from "@/tool/domain/model/TextTool";
import type { ITool } from "@/interface/ITool";

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
    const tool: ITool<TextTool> = $getDefaultTool($TOOL_TEXT_NAME);
    if (!tool) {
        return ;
    }

    $setActiveTool(tool);
};