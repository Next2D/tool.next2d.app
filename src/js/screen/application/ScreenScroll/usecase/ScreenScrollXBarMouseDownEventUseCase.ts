import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenScrollXBarPoiterMoveEventService } from "../service/ScreenScrollXBarPoiterMoveEventService";
import { execute as screenScrollXBarPoiterUpEventUseCase } from "./ScreenScrollXBarPoiterUpEventUseCase";

/**
 * @description スクリーンエリアのxスクロールバーのマウスダウンイベント
 *              Mouse down event of x scroll bar in screen area
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
        EventType.POINTER_MOVE,
        screenScrollXBarPoiterMoveEventService,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        screenScrollXBarPoiterUpEventUseCase,
        { "passive": false }
    );
};