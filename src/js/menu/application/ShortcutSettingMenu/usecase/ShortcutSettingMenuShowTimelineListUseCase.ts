import { execute as shortcutSettingMenuResetListStyleUseCase } from "./ShortcutSettingMenuResetListStyleUseCase";
import { execute as shortcutSettingMenuShowTimelineListService } from "../service/ShortcutSettingMenuShowTimelineListService";

/**
 * @description ショートカットリストのタイムライン表示処理
 *              Shortcut list timeline display process
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

    // タイムラインリストを表示
    shortcutSettingMenuShowTimelineListService();
};