import type { ITool } from "@/interface/ITool";
import type { TextTool } from "@/tool/domain/model/TextTool";
import { $setCursor } from "@/global/GlobalUtil";
import { $getDefaultTool } from "../../ToolUtil";
import { $TOOL_TEXT_NAME } from "@/config/ToolConfig";

/**
 * @description テキストツールのマウスムーブイベントサービス
 *              Text Tool Mouse Move Event Service
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

    const tool: ITool<TextTool> = $getDefaultTool($TOOL_TEXT_NAME);
    if (!tool) {
        return ;
    }

    // カーソルを変更
    $setCursor(tool.cursor);
};