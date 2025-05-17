import type { ITool } from "@/interface/ITool";
import type { RoundRectTool } from "@/tool/domain/model/RoundRectTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_ROUND_RECT_NAME } from "@/config/ToolConfig";

/**
 * @description シェイプの角丸矩形ツールのマウスムーブイベントサービス
 *              Mouse move event service of shape rounded rectangle tool
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

    const tool: ITool<RoundRectTool> = $getDefaultTool($TOOL_ROUND_RECT_NAME);
    if (!tool) {
        return ;
    }

    // カーソルを変更
    $setCursor(tool.cursor);
};