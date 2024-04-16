import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/PropertyConfig";
import { execute as soundAreaSettingComponent } from "../component/SoundAreaSettingComponent";
import type { Sound } from "@/core/domain/model/Sound";

/**
 * @description サウンド設定のelementを追加
 *              Add sound setting element
 *
 * @param  {obbjec} sound
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    index: number,
    sound: Sound,
    sound_object: SoundObjectImpl
): void => {

    const element: HTMLElement | null = document
        .getElementById($SOUND_AREA_SOUND_LIST_AREA_ID);

    if (!element) {
        return ;
    }

    element.insertAdjacentHTML("beforeend",
        soundAreaSettingComponent(index, sound, sound_object)
    );
};