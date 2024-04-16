import { $SOUND_TYPE } from "@/config/InstanceConfig";
import { $PROPERTY_AREA_SOUND_SELECT_ID } from "@/config/PropertyConfig";
import { execute as soundAreaSelectOptionComponent } from "../component/SoundAreaSelectOptionComponent";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description サウンドリストのSelect要素を再構築
 *              Rebuild the Select element of the sound list
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const element: HTMLElement | null = document
        .getElementById($PROPERTY_AREA_SOUND_SELECT_ID);

    if (!element) {
        return ;
    }

    // 全ての要素を削除
    while (element.firstElementChild) {
        element.firstElementChild.remove();
    }

    const workSpace = $getCurrentWorkSpace();
    for (const instance of workSpace.libraries.values()) {

        if (instance.type !== $SOUND_TYPE) {
            continue;
        }

        element.insertAdjacentHTML("beforeend",
            soundAreaSelectOptionComponent(instance.id, instance.getPath(workSpace))
        );
    }
};