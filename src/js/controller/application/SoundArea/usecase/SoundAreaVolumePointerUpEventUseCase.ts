import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaVolumePointerMoveEventUseCase } from "./SoundAreaVolumePointerMoveEventUseCase";
import { ExternalSoundObject } from "@/external/core/domain/model/ExternalSoundObject";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setCursor } from "@/global/GlobalUtil";
import { soundArea } from "@/controller/domain/model/SoundArea";

/**
 * @description 音量操作を終了
 *              End volume operation
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // カーソルを元に戻す
    $setCursor("auto");

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // windowイベントを解除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        soundAreaVolumePointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);

    const index = soundArea.targetIndex;
    if (index === -1) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const frame = movieClip.currentFrame;
    const sounds = movieClip.getSound(frame);
    if (!sounds) {
        return ;
    }

    const soundObject = sounds[index];
    if (!soundObject) {
        return ;
    }

    // 操作対象の変数を初期化
    soundArea.targetIndex = -1;

    // input要素にフォーカスを当てる
    element.focus();

    // 内部データを更新
    const externalSoundObject = new ExternalSoundObject(
        workSpace,
        movieClip,
        soundObject,
        frame,
        index
    );
    externalSoundObject.volume = parseInt(element.value);
};