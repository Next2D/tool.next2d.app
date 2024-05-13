import type { ToolImpl } from "@/interface/ToolImpl";
import type { ZoomMinusTool } from "@/tool/domain/model/ZoomMinusTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_ZOOM_MINUS_NAME } from "@/config/ToolConfig";

/**
 * @description ズームプラスツールのマウスムーブイベントサービス
 *              Zoom plus tool mouse move event service
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

    // カーソルを変更
    $setCursor(tool.cursor);
};