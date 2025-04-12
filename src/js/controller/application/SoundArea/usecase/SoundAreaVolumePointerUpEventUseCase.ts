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
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // カーソルを元に戻す
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // windowイベントを解除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        soundAreaVolumePointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);

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
    await externalSoundObject.setVolume(parseInt(element.value));
};