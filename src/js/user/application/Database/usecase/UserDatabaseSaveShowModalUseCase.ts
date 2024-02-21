import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { MenuImpl } from "@/interface/MenuImpl";
import { $replace } from "@/language/application/LanguageUtil";
import { $getMenu } from "@/menu/application/MenuUtil";
import { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { execute as userDatabaseSaveIndexedDBUseCase } from "./UserDatabaseSaveIndexedDBUseCase";

/**
 * @description 進行画面を起動したユーザーデータの保存処理
 *              Storage process for user data that launched the progress screen
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // 進行状況を表示
    const menu: MenuImpl<ProgressMenu> = $getMenu($PROGRESS_MENU_NAME);
    if (!menu) {
        return ;
    }

    // 進行状況のテキストを更新
    menu.show();
    menu.message = $replace("{{データを圧縮中}}");

    // IndexedDBに保存
    await userDatabaseSaveIndexedDBUseCase();
};