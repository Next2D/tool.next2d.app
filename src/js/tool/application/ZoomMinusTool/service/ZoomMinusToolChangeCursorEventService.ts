import type { ToolImpl } from "@/interface/ToolImpl";
import type { ZoomMinusTool } from "@/tool/domain/model/ZoomMinusTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_ZOOM_MINUS_NAME } from "@/config/ToolConfig";

/**
 * @description カーソルを変更する
 *              Change the cursor
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const tool: ToolImpl<ZoomMinusTool> = $getDefaultTool($TOOL_ZOOM_MINUS_NAME);
    if (!tool) {
        return ;
    }

    $setCursor(tool.cursor);
};