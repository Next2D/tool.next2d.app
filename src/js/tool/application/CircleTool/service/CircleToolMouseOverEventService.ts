import type { ITool } from "@/interface/ITool";
import type { CircleTool } from "@/tool/domain/model/CircleTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_CIRCLE_NAME } from "@/config/ToolConfig";

/**
 * @description シェイプの円ツールのマウスムーブイベントサービス
 *              Shape Circle Tool Mouse Move Event Service
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

    const tool: ITool<CircleTool> = $getDefaultTool($TOOL_CIRCLE_NAME);
    if (!tool) {
        return ;
    }

    // カーソルを変更
    $setCursor(tool.cursor);
};