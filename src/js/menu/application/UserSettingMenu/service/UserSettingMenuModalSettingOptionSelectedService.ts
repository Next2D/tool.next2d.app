import { execute as userSettingObjectGetService } from "../../../../user/application/Setting/service/UserSettingObjectGetService";
import type { UserSettingObjectImpl } from "../../../../interface/UserSettingObjectImpl";

/**
 * @description モーダル表示の選択状態を保存情報に合わせて表示を切り替える
 *              Modal display selection status is switched to display according to stored information
 *
 * @param  {HTMLSelectElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLSelectElement): void =>
{
    const userSettingObject: UserSettingObjectImpl = userSettingObjectGetService();

    const optionElement = element
        .children[userSettingObject.modal ? 0 : 1] as HTMLOptionElement;

    optionElement.selected = true;
};