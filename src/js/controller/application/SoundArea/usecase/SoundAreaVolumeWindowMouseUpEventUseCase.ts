import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaVolumeWindowMouseMoveEventUseCase } from "./SoundAreaVolumeWindowMouseMoveEventUseCase";
import { $getTargetElement, $getTargetIndex, $setTargetElement, $setTargetIndex } from "../SoundAreaUtil";
import { ExternalSoundObject } from "@/external/core/domain/model/ExternalSoundObject";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    // イベントの伝播を止める
    event.stopPropagation();

    // windowイベントを解除
    window.removeEventListener(EventType.MOUSE_MOVE, soundAreaVolumeWindowMouseMoveEventUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);

    const element = $getTargetElement();
    if (!element) {
        return ;
    }

    const index = $getTargetIndex();
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
    $setTargetIndex(-1);
    $setTargetElement(null);

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