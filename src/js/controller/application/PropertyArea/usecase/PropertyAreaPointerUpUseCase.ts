import { EventType } from "@/tool/domain/event/EventType";
import { execute as propertyAreaPointerMoveService } from "../service/PropertyAreaPointerMoveService";
import { $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description プロパティエリアの移動終了関数
 *              Property area move end function
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

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 登録されたイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE, propertyAreaPointerMoveService);
    element.removeEventListener(EventType.MOUSE_UP, execute);

    // 移動状態をセット
    const workSpace = $getCurrentWorkSpace();
    workSpace.updatePropertyArea({
        "state": "move",
        "offsetLeft": element.offsetLeft,
        "offsetTop": element.offsetTop
    });
};