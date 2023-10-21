import { $TOOL_PREFIX } from "../../../../config/ToolConfig";
import { $getToolAreaState } from "../ToolAreaUtil";

/**
 * @description ツールエリアを移動可能な状態にする
 *              Make the tool area movable
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    if ($getToolAreaState() === "fixed") {
        event.stopPropagation();
    }

    const element: HTMLElement | null = document
        .getElementById($TOOL_PREFIX);

    // ツールエリアを移動
    if (element) {
        element.style.left = `${element.offsetLeft + event.movementX}px`;
        element.style.top  = `${element.offsetTop + event.movementY}px`;
    }
};