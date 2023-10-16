import { UserSettingObjectImpl } from "../../../interface/UserSettingObjectImpl";
import { execute as userSettingObjectGetService } from "../../../user/service/UserSettingObjectGetService";
/**
 * @description ユーザー設定メニューに配置された各Elementにイベント登録を行う
 *              Register events in each Element placed in the User Settings menu.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const object: UserSettingObjectImpl = userSettingObjectGetService();

    // ユーザー設定された項目を表示

    // TODO
};