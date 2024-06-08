import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaVolumePointerMoveEventUseCase } from "./SoundAreaVolumePointerMoveEventUseCase";
import { execute as soundAreaVolumePointerUpEventUseCase } from "./SoundAreaVolumePointerUpEventUseCase";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { soundArea } from "@/controller/domain/model/SoundArea";

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
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを止める
    event.stopPropagation();

    if ($useKeyboard()) {
        return ;
    }

    // イベントの伝播を止める
    event.preventDefault();

    const element = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 対象のインデックスを設定
    soundArea.targetIndex = parseInt(element.dataset.index as string);

    // windowイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(EventType.MOUSE_MOVE, soundAreaVolumePointerMoveEventUseCase);
    element.addEventListener(EventType.MOUSE_UP, soundAreaVolumePointerUpEventUseCase);
};