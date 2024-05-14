import { $setCursor } from "@/global/GlobalUtil";
import { $TOOL_PREFIX } from "@/config/ToolConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    event.preventDefault();

    $setCursor("auto");

    const element: HTMLElement | null = document
        .getElementById($TOOL_PREFIX);

    if (!element) {
        return ;
    }

    // 移動イベントを削除
    element.onpointermove = null;
    element.onpointerup   = null;
    element.releasePointerCapture(event.pointerId);

    // ツールエリアを移動
    element.style.left = `${element.offsetLeft + event.movementX}px`;
    element.style.top  = `${element.offsetTop  + event.movementY}px`;

    // 移動状態をセット
    const workSpace = $getCurrentWorkSpace();
    workSpace.updateToolArea({
        "state": "move",
        "offsetLeft": element.offsetLeft,
        "offsetTop": element.offsetTop
    });
};