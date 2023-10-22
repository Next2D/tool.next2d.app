import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuShowScreenListService } from "../service/ShortcutSettingMenuShowScreenListService";
import { $setSelectTabName } from "../ShortcutSettingMenuUtil";

/**
 * @description ショートカットリストのスクリーン表示処理
 *              Shortcut list screen display process
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

    // タブの選択状態をセット
    $setSelectTabName("screen");

    // 選択状態を初期化
    shortcutSettingMenuResetListStyleUseCase();

    // スクリーンリストを表示
    shortcutSettingMenuShowScreenListService();
};