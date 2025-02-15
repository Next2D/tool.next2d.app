import { EventType } from "@/tool/domain/event/EventType";
import { execute as controllerAdjustmentMouseMoveUseCase } from "./ControllerAdjustmentPointerMoveUseCase";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description タイムラインの幅の調整イベントをwindowから削除
 *              Remove timeline width adjustment event from window
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 移動イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, controllerAdjustmentMouseMoveUseCase);
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 自動保存予約
    await userDatabaseAutoSaveReservationUseCase();
};