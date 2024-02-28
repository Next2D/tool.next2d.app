import { $getMenu } from "@/menu/application/MenuUtil";
import { execute as languageLoadRepository } from "../../domain/repository/LanguageLoadRepository";
import { $setMapping } from "../LanguageUtil";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import type { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import type { MenuImpl } from "@/interface/MenuImpl";

/**
 * @description 指定した言語JSONを読み込んで、マッピング情報を更新
 *              Reads specified language JSON and updates mapping information
 *
 * @param  {string} language
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (language: string): Promise<void> =>
{
    // JSONを取得してマッピングに登録
    const values = await languageLoadRepository(language)
        .catch((): void =>
        {
            // エラー表示
            const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
            if (!menu) {
                return ;
            }

            console.log(menu);
            menu.message = "[Error] check network settings";

            throw new Error("Communication error, check network settings");
        });

    // 言語マッピングに登録
    $setMapping(values);
};