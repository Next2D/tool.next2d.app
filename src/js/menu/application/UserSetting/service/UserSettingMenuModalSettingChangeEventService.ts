import type { UserSettingObjectImpl } from "../../../../interface/UserSettingObjectImpl";
import { execute as userSettingObjectGetService } from "../../../../user/application/service/UserSettingObjectGetService";
import { execute as userSettingObjectUpdateService } from "../../../../user/application/service/UserSettingObjectUpdateService";

/**
 * @description ユーザー設定メニューのモーダル設定の設定情報更新
 *              Update configuration information for modal settings in the User Preferences menu
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
        userSettingObject.modal = element.value === "1";

        userSettingObjectUpdateService(userSettingObject);
    }
};