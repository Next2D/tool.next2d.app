import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/PropertyConfig";
import { execute as soundAreaSettingComponent } from "../component/SoundAreaSettingComponent";

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
};