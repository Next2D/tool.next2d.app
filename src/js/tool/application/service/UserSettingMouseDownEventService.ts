import { MenuImpl } from "../../../interface/MenuImpl";
import { $getMenu } from "../../../menu/application/Menu";
import { UserSettingMenu } from "../../../menu/domain/model/UserSettingMenu";

/**
 * @description ユーザー設定ツールの選択時の関数
 *              Function when selecting the User Preferences tool
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const menu: MenuImpl<UserSettingMenu> | null = $getMenu("user-setting");
    if (!menu) {
        return ;
    }

    menu.show();
};