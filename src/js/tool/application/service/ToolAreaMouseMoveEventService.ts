import { EventType } from "../../domain/event/EventType";
import { $getActiveTool } from "../Tool";
import type { ToolImpl } from "../../../interface/ToolImpl";

/**
 * @description 選択中のツールの移動イベント関数
 *              Move event function for the currently selected tool
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();

    const activeTool: ToolImpl<any> | null = $getActiveTool();
    if (!activeTool) {
        return ;
    }

    activeTool.dispatchEvent(
        EventType.MOUSE_MOVE,
        event
    );
};