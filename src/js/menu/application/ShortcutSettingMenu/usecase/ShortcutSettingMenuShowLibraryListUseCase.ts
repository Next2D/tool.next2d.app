import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuShowLibraryListService } from "../service/ShortcutSettingMenuShowLibraryListService";
import { $setSelectTabName } from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットリストのライブラリ表示処理
 *              Shortcut list library display processing
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // タブの選択状態をセット
    $setSelectTabName("library");

    // 選択状態を初期化
    shortcutSettingMenuResetListStyleUseCase();

    // ライブラリリストを表示
    shortcutSettingMenuShowLibraryListService();
};