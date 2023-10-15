import type { ArrowTool } from "../../domain/model/ArrowTool";
import type { ToolImpl } from "../../../interface/ToolImpl";
import { EventType } from "../../domain/event/EventType";
import {
    $getActiveTool,
    $getDefaultTool,
    $setActiveTool
} from "../Tool";

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

    const arrowTool: ToolImpl<ArrowTool> = $getDefaultTool("arrow");
    arrowTool.dispatchEvent(EventType.START);

    $setActiveTool(arrowTool);
};