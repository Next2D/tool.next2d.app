import { $SOUND_TYPE } from "@/config/InstanceConfig";
import { $PROPERTY_AREA_SOUND_SELECT_ID } from "@/config/PropertyConfig";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description サウンドリストのSelect要素を再構築
 *              Rebuild the Select element of the sound list
 *
 * @param  {WorkSpace} work_space
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (work_space: WorkSpace): Promise<void> =>
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

    for (const instance of work_space.libraries.values()) {
        if (!instance.type !== $SOUND_TYPE) {
            continue;
        }

        const option = document.createElement("option");
        option.value = `${instance.id}`;
        option.textContent = instance.getPath(work_space);
        element.appendChild(option);
    }
};