import type { ITool } from "@/interface/ITool";
import type { RectangleTool } from "@/tool/domain/model/RectangleTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_RECTANGLE_NAME } from "@/config/ToolConfig";

/**
 * @description シェイプの矩形ツールのマウスムーブイベントサービス
 *              Mouse-move event service of shape rectangle tool
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

    const tool: ITool<RectangleTool> = $getDefaultTool($TOOL_RECTANGLE_NAME);
    if (!tool) {
        return ;
    }

    // カーソルを変更
    $setCursor(tool.cursor);
};