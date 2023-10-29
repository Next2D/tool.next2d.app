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

    // 遅延実行
    requestAnimationFrame(() =>
    {
        const element: HTMLElement | null = document
            .getElementById($TOOL_PREFIX);

        if (!element) {
            return ;
        }

        // ツールエリアを移動
        element.style.left = `${element.offsetLeft + event.movementX}px`;
        element.style.top  = `${element.offsetTop  + event.movementY}px`;
    });
};