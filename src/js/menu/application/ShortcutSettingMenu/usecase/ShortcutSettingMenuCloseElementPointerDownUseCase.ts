import { execute as shortcutSettingMenuHideService } from "../service/ShortcutSettingMenuHideService";
import { execute as userSettingMenuShowService } from "../../UserSettingMenu/service/UserSettingMenuShowService";
import { execute as shortcutSettingMenuChangeListStyleService } from "../service/ShortcutSettingMenuChangeListStyleService";
import { execute as shortcutSettingMenuRemoveKeyboardEventService } from "./ShortcutSettingMenuRemoveKeyboardEventUseCase";
import { execute as languageTranslationService } from "@/language/application/service/LanguageTranslationService";
import { $activeTouchPointers } from "@/global/GlobalUtil";

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
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    event.stopPropagation();
    event.preventDefault();

    // ショートカットメニューを非表示にする
    shortcutSettingMenuHideService();

    // ユーザー設定メニューを表示する
    userSettingMenuShowService();

    // 選択状態を初期化
    shortcutSettingMenuChangeListStyleService(null);

    // キーボードイベントを削除
    shortcutSettingMenuRemoveKeyboardEventService();

    // 言語を変換
    languageTranslationService(document);
};