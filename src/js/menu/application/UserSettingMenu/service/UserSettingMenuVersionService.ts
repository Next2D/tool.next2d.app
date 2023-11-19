import { $USER_CURRENT_VERSION_ID } from "@/config/UserSettingConfig";
import { version } from "../../../../../../package.json";

/**
 * @description ユーザー設定メニューの表示位置のoffsetを更新
 *              Updated display position offset in the User Preferences menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLDivElement | null = document
        .getElementById($USER_CURRENT_VERSION_ID) as HTMLDivElement;

    if (!element) {
        return ;
    }

    element.textContent = `β version: ${version}`;
};