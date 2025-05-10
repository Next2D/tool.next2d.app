import { EventType } from "@/tool/domain/event/EventType";
import { execute as propertyAreaPointerMoveService } from "../service/PropertyAreaPointerMoveService";
import { $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description プロパティエリアの移動終了関数
 *              Property area move end function
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

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 登録されたイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, propertyAreaPointerMoveService);
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 移動状態をセット
    const workSpace = $getCurrentWorkSpace();
    workSpace.updatePropertyArea({
        "state": "move",
        "offsetLeft": element.offsetLeft,
        "offsetTop": element.offsetTop
    });

    // 自動保存
    await userDatabaseAutoSaveReservationUseCase();
};