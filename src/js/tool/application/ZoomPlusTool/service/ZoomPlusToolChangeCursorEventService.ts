import type { ITool } from "@/interface/ITool";
import type { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_ZOOM_PLUS_NAME } from "@/config/ToolConfig";

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
    const tool: ITool<ZoomPlusTool> = $getDefaultTool($TOOL_ZOOM_PLUS_NAME);
    if (!tool) {
        return ;
    }

    $setCursor(tool.cursor);
};