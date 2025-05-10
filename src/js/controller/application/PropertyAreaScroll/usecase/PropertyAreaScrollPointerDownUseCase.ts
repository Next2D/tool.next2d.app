import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as propertyAreaScrollPointerMoveUseCase } from "./PropertyAreaScrollPointerMoveUseCase";
import { execute as propertyAreaScrollPointerUpUseCase } from "./PropertyAreaScrollPointerUpUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description プロパティーエリアのスクロールバーのマウスダウンイベント
 *              Property area scroll bar mouse down event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // ポインターイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        propertyAreaScrollPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        propertyAreaScrollPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        propertyAreaScrollPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        propertyAreaScrollPointerUpUseCase
    );
};