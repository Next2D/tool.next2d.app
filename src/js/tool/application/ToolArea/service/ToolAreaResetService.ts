import type { ArrowTool } from "@/tool/domain/model/ArrowTool";
import type { ToolImpl } from "@/interface/ToolImpl";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $getActiveTool,
    $getDefaultTool,
    $setActiveTool
} from "../../ToolUtil";
import { $TOOL_ARROW_NAME } from "@/config/ToolConfig";

/**
 * @description ツールエリアを初回起動時の状態に戻す
 *              Restore the tool area to its initial startup state
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const activeTool: ToolImpl<any> = $getActiveTool();
    if (activeTool) {
        activeTool.dispatchEvent(EventType.END);
    }

    const arrowTool: ToolImpl<ArrowTool> = $getDefaultTool($TOOL_ARROW_NAME);
    arrowTool.dispatchEvent(EventType.START);

    $setActiveTool(arrowTool);
};