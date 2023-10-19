import { $setCursor } from "../../../../util/Global";
import { EventType } from "../../../domain/event/EventType";
import { execute as toolAreaActiveMoveService } from "./ToolAreaActiveMoveService";
import { execute as userToolAreaStateUpdateService } from "../../../../user/application/service/UserToolAreaStateUpdateService";

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
    window.removeEventListener(EventType.MOUSE_MOVE, toolAreaActiveMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);

    $setCursor("auto");

    // 移動状態をLocalStorageに保存
    userToolAreaStateUpdateService({
        "state": "move",
        "offsetLeft": event.pageX - event.offsetX,
        "offsetTop": event.pageY - event.offsetY
    });
};