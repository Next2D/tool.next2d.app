import { execute as userSettingObjectGetService } from "../../../../user/application/Setting/service/UserSettingObjectGetService";
import type { UserSettingObjectImpl } from "../../../../interface/UserSettingObjectImpl";

/**
 * @description 非表示レイヤーの選択状態を保存情報に合わせて表示を切り替える
 *              Switching the display of the selection state of hidden layers to match the saved information
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
        .children[userSettingObject.layer ? 1 : 0] as HTMLOptionElement;

    optionElement.selected = true;
};