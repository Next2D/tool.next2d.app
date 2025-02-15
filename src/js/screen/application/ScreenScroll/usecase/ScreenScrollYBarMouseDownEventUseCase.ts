import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenScrollYBarPoiterMoveEventService } from "../service/ScreenScrollYBarPoiterMoveEventService";
import { execute as screenScrollYBarPoiterUpEventUseCase } from "./ScreenScrollYBarPoiterUpEventUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

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

    // 全てのメニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        screenScrollYBarPoiterMoveEventService,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        screenScrollYBarPoiterUpEventUseCase,
        { "passive": false }
    );
};