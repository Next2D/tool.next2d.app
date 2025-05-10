import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaVolumePointerMoveEventUseCase } from "./SoundAreaVolumePointerMoveEventUseCase";
import { execute as soundAreaVolumePointerUpEventUseCase } from "./SoundAreaVolumePointerUpEventUseCase";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { soundArea } from "@/controller/domain/model/SoundArea";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description 音声操作のwindowイベントを登録
 *              Register window events for sound operation
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

    // fixed logic
    event.preventDefault();

    // 対象のインデックスを設定
    soundArea.targetIndex = parseInt(element.dataset.index as string);

    // windowイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        soundAreaVolumePointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        soundAreaVolumePointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        soundAreaVolumePointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        soundAreaVolumePointerUpEventUseCase
    );
};