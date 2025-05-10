import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaLoopCountPointerMoveEventUseCase } from "./SoundAreaLoopCountPointerMoveEventUseCase";
import { execute as soundAreaLoopCountPointerUpEventUseCase } from "./SoundAreaLoopCountPointerUpEventUseCase";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { soundArea } from "@/controller/domain/model/SoundArea";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description ループ回数操作のwindowイベントを登録
 *              Register window events for loop count operation
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 親へのイベントの伝播を止める
    event.stopPropagation();
    if ($useKeyboard()) {
        return ;
    }

    const element = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中の要素を解除
    $setEditingElement(null);

    // 対象のインデックスを設定
    soundArea.targetIndex = parseInt(element.dataset.index as string);

    // windowイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        soundAreaLoopCountPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        soundAreaLoopCountPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        soundAreaLoopCountPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        soundAreaLoopCountPointerUpEventUseCase
    );
};