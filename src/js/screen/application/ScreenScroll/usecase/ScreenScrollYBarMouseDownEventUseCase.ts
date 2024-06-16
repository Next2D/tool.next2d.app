import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenScrollYBarPoiterMoveEventService } from "../service/ScreenScrollYBarPoiterMoveEventService";
import { execute as screenScrollYBarPoiterUpEventUseCase } from "./ScreenScrollYBarPoiterUpEventUseCase";

/**
 * @description スクリーンエリアのyスクロールバーのマウスダウンイベント
 *              Mouse down event of y scroll bar in screen area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();

    $allHideMenu();

    // 移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.MOUSE_MOVE,
        screenScrollYBarPoiterMoveEventService,
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        screenScrollYBarPoiterUpEventUseCase,
        { "passive": false }
    );
};