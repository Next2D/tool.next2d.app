import type { UserSettingObjectImpl } from "../../../interface/UserSettingObjectImpl";
import { execute as userSettingObjectGetService } from "../../../user/service/UserSettingObjectGetService";
import { execute as userSettingObjectUpdateService } from "../../../user/service/UserSettingObjectUpdateService";

/**
 * @description ユーザー設定メニューの非表示レイヤーの設定情報更新
 *              Updated setting information for hidden layers in the user settings menu
 *
 * @param  {Event} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    if (event.target) {
        const userSettingObject: UserSettingObjectImpl = userSettingObjectGetService();

        const element = event.target as HTMLSelectElement;
        userSettingObject.layer = element.value === "1";

        userSettingObjectUpdateService(userSettingObject);
    }
};