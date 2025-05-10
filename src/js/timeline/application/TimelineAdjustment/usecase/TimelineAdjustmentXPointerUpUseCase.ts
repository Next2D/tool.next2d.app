import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentXMouseMoveUseCase } from "./TimelineAdjustmentXPointerMoveUseCase";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description タイムラインの幅の調整イベントをwindowから削除
 *              Remove timeline width adjustment event from window
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 移動イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        timelineAdjustmentXMouseMoveUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 自動保存予約
    await userDatabaseAutoSaveReservationUseCase();
};