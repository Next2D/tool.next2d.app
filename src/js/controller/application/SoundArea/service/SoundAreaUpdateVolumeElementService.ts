import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/PropertyConfig";
import { SoundObjectImpl } from "@/interface/SoundObjectImpl";

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
export const execute = (sound_object: SoundObjectImpl, index: number): void =>
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

    // 音量の表示を更新
    volumeElement.value = `${sound_object.volume}`;
};