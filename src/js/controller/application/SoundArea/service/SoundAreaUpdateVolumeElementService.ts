import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/SoundSettingConfig";
import { ISoundObject } from "@/interface/ISoundObject";

/**
 * @description 音量の表示を変更
 *              Change the volume display
 *
 * @param  {object} sound_object
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (sound_object: ISoundObject, index: number): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);

    if (!element) {
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

    const audio = node.querySelector("audio") as HTMLAudioElement;
    if (!audio) {
        return ;
    }

    // 音量の表示を更新
    volumeElement.value = `${sound_object.volume}`;
    audio.volume = sound_object.volume / 100;
};