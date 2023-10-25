import { execute as userSettingObjectGetService } from "../../../../user/application/Setting/service/UserSettingObjectGetService";
import type { UserSettingObjectImpl } from "../../../../interface/UserSettingObjectImpl";

/**
 * @description 書き出しフォーマットの選択状態を保存情報に合わせて表示を切り替える
 *              Switching the display of the export format selection status to match the saved information
 *
 * @param  {HTMLSelectElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLSelectElement): void =>
{
    const userSettingObject: UserSettingObjectImpl = userSettingObjectGetService();

    const children: HTMLCollection = element.children;
    const length: number = children.length;
    for (let idx: number = 0; idx < length; ++idx) {

        const node: HTMLOptionElement = children[idx] as HTMLOptionElement;
        if (userSettingObject.type !== node.value) {
            continue;
        }

        node.selected = true;
        break;
    }
};