import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenDisplayObjectWindowMouseMoveEventUseCase } from "./ScreenDisplayObjectPointerMoveEventUseCase";
import { execute as screenDisplayObjectUpdateSelectedValueService } from "../service/ScreenDisplayObjectUpdateSelectedValueService";
import { $setPointerId } from "../DisplayObjectUtil";

/**
 * @description DisplayObjectのwindowイベントを解除
 *              Remove window events for DisplayObjects
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();

    // 移動状態を解除
    $setPointerId(-1);

    // windowイベントを解除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        screenDisplayObjectWindowMouseMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 移動した座標に更新
    await screenDisplayObjectUpdateSelectedValueService();
};