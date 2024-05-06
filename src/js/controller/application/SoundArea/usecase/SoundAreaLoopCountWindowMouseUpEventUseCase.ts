import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaLoopCountWindowMouseMoveEventUseCase } from "./SoundAreaLoopCountWindowMouseMoveEventUseCase";
import { ExternalSoundObject } from "@/external/core/domain/model/ExternalSoundObject";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/SoundSettingConfig";
import { $setCursor } from "@/global/GlobalUtil";
import { soundArea } from "@/controller/domain/model/SoundArea";

/**
 * @description ループ回数操作を終了
 *              End loop count operation
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

    // windowイベントを解除
    window.removeEventListener(EventType.MOUSE_MOVE,
        soundAreaLoopCountWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);

    const element: HTMLElement | null = document
        .getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);

    if (!element) {
        return ;
    }

    const index = soundArea.targetIndex;
    if (index === -1) {
        return ;
    }

    const node = element.children[index];
    if (!node) {
        return ;
    }

    const loopElement = node.querySelector(".loop-count") as HTMLInputElement;
    if (!loopElement) {
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
    loopElement.focus();

    // 内部データを更新
    const externalSoundObject = new ExternalSoundObject(
        workSpace,
        movieClip,
        soundObject,
        frame,
        index
    );
    externalSoundObject.loopCount = parseInt(loopElement.value);
};