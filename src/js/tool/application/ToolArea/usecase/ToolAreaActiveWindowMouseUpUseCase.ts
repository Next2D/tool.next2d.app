import { $setCursor } from "../../../../global/GlobalUtil";
import { EventType } from "../../../domain/event/EventType";
import { execute as toolAreaActiveWindowMoveService } from "../service/ToolAreaActiveWindowMoveService";
import { execute as userToolAreaStateUpdateService } from "../../../../user/application/ToolArea/service/UserToolAreaStateUpdateService";
import { $TOOL_PREFIX } from "../../../../config/ToolConfig";

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

    // 登録されたイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, toolAreaActiveWindowMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);

    $setCursor("auto");

    const element: HTMLElement | null = document
        .getElementById($TOOL_PREFIX);

    if (!element) {
        return ;
    }

    // ツールエリアを移動
    element.style.left = `${element.offsetLeft + event.movementX}px`;
    element.style.top  = `${element.offsetTop  + event.movementY}px`;

    // 移動状態をLocalStorageに保存
    userToolAreaStateUpdateService({
        "state": "move",
        "offsetLeft": element.offsetLeft,
        "offsetTop": element.offsetTop
    });
};