import type { ISoundObject } from "@/interface/ISoundObject";
import type { Sound } from "@/core/domain/model/Sound";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/SoundSettingConfig";
import { execute as soundAreaSettingComponent } from "../component/SoundAreaSettingComponent";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaTrashPointerDownUseCase } from "./SoundAreaTrashPointerDownUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as soundAreaVolumePointerDownEventUseCase } from "./SoundAreaVolumePointerDownEventUseCase";
import { execute as soundAreaLoopCountPointerDownEventUseCase } from "./SoundAreaLoopCountPointerDownEventUseCase";
import { execute as soundAreaVolumeFocusInEventService } from "../service/SoundAreaVolumeFocusInEventService";
import { execute as soundAreaVolumeKeyPressEventService } from "../service/SoundAreaVolumeKeyPressEventService";
import { execute as soundAreaLoopCountKeyPressEventService } from "../service/SoundAreaLoopCountKeyPressEventService";
import { execute as soundAreaVolumeFocusOutEventUseCase } from "./SoundAreaVolumeFocusOutEventUseCase";
import { execute as soundAreaLoopCountFocusOutEventUseCase } from "./SoundAreaLoopCountFocusOutEventUseCase";
import { execute as soundAreaVolumePointerOverEventService } from "../service/SoundAreaVolumePointerOverEventService";
import { execute as soundAreaLoopCountPointerOverEventService } from "../service/SoundAreaLoopCountPointerOverEventService";
import { execute as soundAreaVolumePointerOutEventService } from "../service/SoundAreaVolumePointerOutEventService";
import { execute as soundAreaLoopCountPointerOutEventService } from "../service/SoundAreaLoopCountPointerOutEventService";
import { execute as soundAreaLoopCountFocusInEventService } from "../service/SoundAreaLoopCountFocusInEventService";

/**
 * @description サウンド設定のelementを追加
 *              Add sound setting element
 *
 * @param  {number} index
 * @param  {string} sound_name
 * @param  {object} sound_object
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    index: number,
    sound_name: string,
    sound_object: ISoundObject
): Promise<void> => {

    const element: HTMLElement | null = document
        .getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const sound = workSpace.getLibrary(sound_object.libraryId) as Sound;

    element.insertAdjacentHTML("beforeend",
        soundAreaSettingComponent(index, sound_name, sound_object)
    );

    const soundSettingElement = element.lastElementChild as HTMLElement;
    if (!soundSettingElement) {
        return ;
    }

    const containerElement: HTMLElement | null = soundSettingElement
        .querySelector(".sound-container");

    if (containerElement) {

        // audio Element
        const audioContainer = document.createElement("div");
        containerElement.appendChild(audioContainer);
        audioContainer.classList.add("sound-setting-preview-container");
        if (sound) {
            // audio Elementを生成
            const audioHtmlElement = sound.createAudioElement();
            if (audioHtmlElement) {
                audioHtmlElement.dataset.index = `${index}`;
                audioHtmlElement.volume = sound_object.volume / 100;
                audioContainer.appendChild(audioHtmlElement);
            }
        }

        // canvas Element
        const canvasContainer = document.createElement("div");
        containerElement.appendChild(canvasContainer);
        canvasContainer.classList.add("sound-setting-preview-container");

        // 波形用のcanvas Elementを生成
        if (sound) {
            // 描画に時間がかかるので非同期で処理が完了したら描画
            sound
                .createCanvasElement(280, 60)
                .then((canvas: HTMLCanvasElement | null) => {
                    if (canvas) {
                        canvasContainer.appendChild(canvas);
                    }
                });
        }
    }

    // 削除アイコンにイベントを登録
    const trashIconElement = soundSettingElement.querySelector<HTMLInputElement>(".trash");
    if (trashIconElement) {
        trashIconElement.addEventListener(EventType.POINTER_DOWN,
            soundAreaTrashPointerDownUseCase
        );
    }

    // 音量操作のイベントを登録
    const volumeElement = soundSettingElement.querySelector<HTMLInputElement>(".volume");
    if (volumeElement) {
        volumeElement.addEventListener("focusin",
            soundAreaVolumeFocusInEventService
        );
        volumeElement.addEventListener("focusout",
            soundAreaVolumeFocusOutEventUseCase
        );
        volumeElement.addEventListener("keypress",
            soundAreaVolumeKeyPressEventService
        );
        volumeElement.addEventListener(EventType.POINTER_OVER,
            soundAreaVolumePointerOverEventService
        );
        volumeElement.addEventListener(EventType.POINTER_OUT,
            soundAreaVolumePointerOutEventService
        );
        volumeElement.addEventListener(EventType.POINTER_DOWN,
            soundAreaVolumePointerDownEventUseCase
        );
    }

    // ループ回数操作のイベントを登録
    const loopElement = soundSettingElement.querySelector<HTMLInputElement>(".loop-count");
    if (loopElement) {
        loopElement.addEventListener("focusin",
            soundAreaLoopCountFocusInEventService
        );
        loopElement.addEventListener("focusout",
            soundAreaLoopCountFocusOutEventUseCase
        );
        loopElement.addEventListener("keypress",
            soundAreaLoopCountKeyPressEventService
        );
        loopElement.addEventListener(EventType.POINTER_OVER,
            soundAreaLoopCountPointerOverEventService
        );
        loopElement.addEventListener(EventType.POINTER_OUT,
            soundAreaLoopCountPointerOutEventService
        );
        loopElement.addEventListener(EventType.POINTER_DOWN,
            soundAreaLoopCountPointerDownEventUseCase
        );
    }
};