import type { ISoundObject } from "@/interface/ISoundObject";
import type { Sound } from "@/core/domain/model/Sound";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/SoundSettingConfig";
import { execute as soundAreaSettingComponent } from "../component/SoundAreaSettingComponent";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaTrashMouseDownUseCase } from "./SoundAreaTrashMouseDownUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as soundAreaVolumeRegisterPointerEventUseCase } from "./SoundAreaVolumeRegisterPointerEventUseCase";
import { execute as soundAreaLoopCountRegisterPointerEventUseCase } from "./SoundAreaLoopCountRegisterPointerEventUseCase";
import { execute as soundAreaVolumeFocusInEventService } from "../service/SoundAreaVolumeFocusInEventService";
import { execute as soundAreaVolumeKeyPressEventService } from "../service/SoundAreaVolumeKeyPressEventService";
import { execute as soundAreaLoopCountKeyPressEventService } from "../service/SoundAreaLoopCountKeyPressEventService";
import { execute as soundAreaVolumeFocusOutEventUseCase } from "./SoundAreaVolumeFocusOutEventUseCase";
import { execute as soundAreaLoopCountFocusOutEventUseCase } from "./SoundAreaLoopCountFocusOutEventUseCase";
import { execute as soundAreaVolumeMouseOverEventService } from "../service/SoundAreaVolumeMouseOverEventService";
import { execute as soundAreaLoopCountMouseOverEventService } from "../service/SoundAreaLoopCountMouseOverEventService";
import { execute as soundAreaVolumeMouseOutEventService } from "../service/SoundAreaVolumeMouseOutEventService";
import { execute as soundAreaLoopCountMouseOutEventService } from "../service/SoundAreaLoopCountMouseOutEventService";
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

    // 波形用のcanvas Elementを生成
    const canvas = sound ? await sound.createCanvasElement(280, 60) : null;

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
        if (canvas) {
            canvasContainer.appendChild(canvas);
        }
    }

    // 削除アイコンにイベントを登録
    const trashIconElement = soundSettingElement.querySelector<HTMLInputElement>(".trash");
    if (trashIconElement) {
        trashIconElement.addEventListener(EventType.POINTER_DOWN,
            soundAreaTrashMouseDownUseCase
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
            soundAreaVolumeMouseOverEventService
        );
        volumeElement.addEventListener(EventType.POINTER_OUT,
            soundAreaVolumeMouseOutEventService
        );
        volumeElement.addEventListener(EventType.POINTER_DOWN,
            soundAreaVolumeRegisterPointerEventUseCase
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
            soundAreaLoopCountMouseOverEventService
        );
        loopElement.addEventListener(EventType.POINTER_OUT,
            soundAreaLoopCountMouseOutEventService
        );
        loopElement.addEventListener(EventType.POINTER_DOWN,
            soundAreaLoopCountRegisterPointerEventUseCase
        );
    }
};