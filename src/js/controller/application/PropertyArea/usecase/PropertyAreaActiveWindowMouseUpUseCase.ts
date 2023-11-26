import { EventType } from "@/tool/domain/event/EventType";
import { execute as propertyAreaActiveWindowMoveService } from "../service/PropertyAreaActiveWindowMoveService"
import { $setCursor } from "@/global/GlobalUtil";
import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
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

    // 登録されたイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, propertyAreaActiveWindowMoveService);
    window.removeEventListener(EventType.MOUSE_UP, execute);

    $setCursor("auto");

    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_AREA_PROPERTY_ID);

    if (!element) {
        return ;
    }

    // ツールエリアを移動
    element.style.left = `${element.offsetLeft + event.movementX}px`;
    element.style.top  = `${element.offsetTop  + event.movementY}px`;

    // 移動状態をセット
    const workSpace = $getCurrentWorkSpace();
    workSpace.updatePropertyArea({
        "state": "move",
        "offsetLeft": element.offsetLeft,
        "offsetTop": element.offsetTop
    });
};