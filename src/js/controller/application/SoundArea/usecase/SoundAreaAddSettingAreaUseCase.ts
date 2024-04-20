import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Sound } from "@/core/domain/model/Sound";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/PropertyConfig";
import { execute as soundAreaSettingComponent } from "../component/SoundAreaSettingComponent";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as soundAreaTrashMouseDownUseCase } from "./SoundAreaTrashMouseDownUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as soundAreaVolumeRegisterWindowEventUseCase } from "./SoundAreaVolumeRegisterWindowEventUseCase";
import { execute as soundAreaVolumeFocusInEventUseCase } from "../service/SoundAreaVolumeFocusInEventUseCase";
import { execute as soundAreaVolumeKeyPressEventService } from "../service/SoundAreaVolumeKeyPressEventService";
import { execute as soundAreaVolumeFocusOutEventUseCase } from "./SoundAreaVolumeFocusOutEventUseCase";
import { execute as soundAreaVolumeMouseOverEventService } from "../service/SoundAreaVolumeMouseOverEventService";
import { execute as soundAreaVolumeMouseOutEventService } from "../service/SoundAreaVolumeMouseOutEventService";

/**
 * @description サウンド設定のelementを追加
 *              Add sound setting element
 *
 * @param  {number} index
 * @param  {string} sound_name
 * @param  {object} sound_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    index: number,
    sound_name: string,
    sound_object: SoundObjectImpl
): void => {

    const element: HTMLElement | null = document
        .getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);

    if (!element) {
        return ;
    }

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

        // canvas Element
        const canvasContainer = document.createElement("div");
        containerElement.appendChild(canvasContainer);

        // classを追加
        audioContainer.classList.add("sound-setting-preview-container");
        canvasContainer.classList.add("sound-setting-preview-container");

        const workSpace = $getCurrentWorkSpace();
        const sound: InstanceImpl<Sound> = workSpace.getLibrary(sound_object.libraryId);
        if (sound) {

            // audio Elementを生成
            const audioHtmlElement = sound.createAudioElement();
            if (audioHtmlElement) {
                audioHtmlElement.dataset.index = `${index}`;
                audioHtmlElement.volume = sound_object.volume / 100;
                audioContainer.appendChild(audioHtmlElement);
            }

            // 波形用のcanvas Elementを生成
            sound
                .createCanvasElement(280, 60)
                .then((canvas_html_element): void =>
                {
                    if (!canvas_html_element) {
                        return ;
                    }
                    canvasContainer.appendChild(canvas_html_element);
                });
        }
    }

    // 削除アイコンにイベントを登録
    const trashIconElement: HTMLElement | null = soundSettingElement.querySelector(".trash");
    if (trashIconElement) {
        trashIconElement.addEventListener(EventType.MOUSE_DOWN,
            soundAreaTrashMouseDownUseCase
        );
    }

    // 音量操作のイベントを登録
    const volumeElement: HTMLElement | null = soundSettingElement.querySelector(".volume");
    if (volumeElement) {
        volumeElement.addEventListener("focusin",
            soundAreaVolumeFocusInEventUseCase
        );
        volumeElement.addEventListener("focusout",
            soundAreaVolumeFocusOutEventUseCase
        );
        volumeElement.addEventListener("keypress",
            soundAreaVolumeKeyPressEventService
        );
        volumeElement.addEventListener(EventType.MOUSE_OVER,
            soundAreaVolumeMouseOverEventService
        );
        volumeElement.addEventListener(EventType.MOUSE_OUT,
            soundAreaVolumeMouseOutEventService
        );
        volumeElement.addEventListener(EventType.MOUSE_DOWN,
            soundAreaVolumeRegisterWindowEventUseCase
        );
    }
};