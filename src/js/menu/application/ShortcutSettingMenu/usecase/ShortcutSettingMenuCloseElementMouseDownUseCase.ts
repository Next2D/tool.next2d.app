import { execute as shortcutSettingMenuHideService } from "../service/ShortcutSettingMenuHideService";
import { execute as userSettingMenuShowService } from "../../UserSettingMenu/service/UserSettingMenuShowService";
import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuRemoveKeyboardEventService } from "./ShortcutSettingMenuRemoveKeyboardEventUseCase";
import { execute as languageTranslationService } from "@/language/application/service/LanguageTranslationService";

/**
 * @description ショートカットメニューを非表示にして、ユーザー設定メニューを表示
 *              Show shortcut menu
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    event.stopPropagation();
    event.preventDefault();

    // ショートカットメニューを非表示にする
    shortcutSettingMenuHideService();

    // ユーザー設定メニューを表示する
    userSettingMenuShowService();

    // 選択状態を初期化
    shortcutSettingMenuResetListStyleUseCase();

    // キーボードイベントを削除
    shortcutSettingMenuRemoveKeyboardEventService();

    // 言語を変換
    languageTranslationService(document);
};