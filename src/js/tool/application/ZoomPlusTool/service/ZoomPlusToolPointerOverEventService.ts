import type { ITool } from "@/interface/ITool";
import type { ZoomPlusTool } from "@/tool/domain/model/ZoomPlusTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_ZOOM_PLUS_NAME } from "@/config/ToolConfig";

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
    const tool: ITool<ZoomPlusTool> = $getDefaultTool($TOOL_ZOOM_PLUS_NAME);
    if (!tool) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // カーソルを変更
    $setCursor(tool.cursor);
};