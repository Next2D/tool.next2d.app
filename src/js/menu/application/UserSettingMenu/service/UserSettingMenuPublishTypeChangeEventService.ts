import type { UserSettingObjectImpl } from "@/interface/UserSettingObjectImpl";
import { execute as userSettingObjectGetService } from "@/user/application/Setting/service/UserSettingObjectGetService";
import { execute as userSettingObjectUpdateService } from "@/user/application/Setting/service/UserSettingObjectUpdateService";

/**
 * @description 書き出しフォーマットの設定情報更新
 *              Update export format setting information
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

    const element = event.target as HTMLSelectElement;
    if (!element) {
        return ;
    }

    const userSettingObject: UserSettingObjectImpl = userSettingObjectGetService();
    userSettingObject.type = element.value;

    userSettingObjectUpdateService(userSettingObject);
};