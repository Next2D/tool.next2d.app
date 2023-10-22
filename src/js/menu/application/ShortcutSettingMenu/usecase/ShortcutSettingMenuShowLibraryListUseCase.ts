import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuShowLibraryListService } from "../service/ShortcutSettingMenuShowLibraryListService";

/**
 * @description ショートカットリストのライブラリ表示処理
 *              Shortcut list library display processing
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // 選択状態を初期化
    shortcutSettingMenuResetListStyleUseCase();

    // ライブラリリストを表示
    shortcutSettingMenuShowLibraryListService();
};