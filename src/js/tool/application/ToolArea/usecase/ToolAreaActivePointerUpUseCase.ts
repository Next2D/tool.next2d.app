import { $setCursor } from "@/global/GlobalUtil";
import { $TOOL_PREFIX } from "@/config/ToolConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as toolAreaPointerMoveService } from "../service/ToolAreaPointerMoveService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description 選択中のツールの移動イベント関数
 *              Move event function for the currently selected tool
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // 親のイベントを中止する
    event.stopPropagation();

    $setCursor("auto");

    const element: HTMLElement | null = document
        .getElementById($TOOL_PREFIX);

    if (!element) {
        return ;
    }

    // 移動イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, toolAreaPointerMoveService);
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 移動状態をセット
    const workSpace = $getCurrentWorkSpace();
    workSpace.updateToolArea({
        "state": "move",
        "offsetLeft": element.offsetLeft,
        "offsetTop": element.offsetTop
    });

    // 自動保存予約
    await userDatabaseAutoSaveReservationUseCase();
};