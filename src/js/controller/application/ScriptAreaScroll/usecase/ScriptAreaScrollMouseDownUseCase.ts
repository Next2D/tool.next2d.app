import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptAreaScrollPointerMoveUseCase } from "./ScriptAreaScrollPointerMoveUseCase";
import { execute as scriptAreaScrollPointerUpUseCase } from "./ScriptAreaScrollPointerUpUseCase";

/**
 * @description JSエリアのスクロールバーのマウスダウンイベント
 *              Mouse down event of the JS area scroll bar
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

    // イベントの伝播を止める
    event.stopPropagation();

    // メニューを非表示にする
    $allHideMenu();

    // ポインターイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.MOUSE_MOVE,
        scriptAreaScrollPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.MOUSE_UP,
        scriptAreaScrollPointerUpUseCase,
        { "passive": false }
    );
};