import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptAreaScrollPointerMoveUseCase } from "./ScriptAreaScrollPointerMoveUseCase";
import { execute as scriptAreaScrollPointerUpUseCase } from "./ScriptAreaScrollPointerUpUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

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

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();

    // ポインターイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        scriptAreaScrollPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        scriptAreaScrollPointerUpUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        scriptAreaScrollPointerUpUseCase,
        { "passive": false }
    );
};