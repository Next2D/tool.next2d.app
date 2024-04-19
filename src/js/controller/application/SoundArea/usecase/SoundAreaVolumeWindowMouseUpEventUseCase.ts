import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaVolumeWindowMouseMoveEventUseCase } from "./SoundAreaVolumeWindowMouseMoveEventUseCase";
import { $getTargetIndex, $setTargetIndex } from "../SoundAreaUtil";
import { ExternalSoundObject } from "@/external/core/domain/model/ExternalSoundObject";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/PropertyConfig";

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
    window.removeEventListener(EventType.MOUSE_MOVE,
        soundAreaVolumeWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);

    const element: HTMLElement | null = document
        .getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);

    if (!element) {
        return ;
    }

    const index = $getTargetIndex();
    if (index === -1) {
        return ;
    }

    const node = element.children[index];
    if (!node) {
        return ;
    }

    const volumeElement = node.querySelector(".volume") as HTMLInputElement;
    if (!volumeElement) {
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

    const volume = parseInt(volumeElement.value);
    if (volume === soundObject.volume) {
        return ;
    }

    // 内部データを更新
    const externalSoundObject = new ExternalSoundObject(
        workSpace,
        movieClip,
        soundObject,
        frame,
        index
    );
    externalSoundObject.volume = volume;
};