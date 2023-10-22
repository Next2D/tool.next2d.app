import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as shortcutSettingMenuShowScreenListUseCase } from "../usecase/ShortcutSettingMenuShowScreenListUseCase";
import { execute as shortcutSettingMenuShowTimelineListUseCase } from "../usecase/ShortcutSettingMenuShowTimelineListUseCase";
import { execute as shortcutSettingMenuShowLibraryListUseCase } from "../usecase/ShortcutSettingMenuShowLibraryListUseCase";
import { execute as shortcutSettingMenuCloseElementMouseDownUseCase } from "./ShortcutSettingMenuCloseElementMouseDownUseCase";
import { execute as shortcutSettingMenuSaveUseCase } from "./ShortcutSettingMenuSaveUseCase";
import { execute as shortcutSettingMenuResetUseCase } from "./ShortcutSettingMenuResetUseCase";
import {
    $SHORTCUT_SETTING_CLOSE_ID,
    $SHORTCUT_SETTING_LIBRARY_ID,
    $SHORTCUT_SETTING_SCREEN_ID,
    $SHORTCUT_SETTING_TIMELINE_ID,
    $SHORTCUT_SETTING_SAVE_ID,
    $SHORTCUT_SETTING_RESET_ID
} from "../../../../config/ShortcutConfig";

/**
 * @description 初回起動時のイベント登録関数
 *              Event registration function at initial startup
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 保存ボタン処理
    const shortcutSettingSave: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_SAVE_ID);

    if (shortcutSettingSave) {
        shortcutSettingSave.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 親のイベントを中止
            event.stopPropagation();

            shortcutSettingMenuSaveUseCase();
        });
    }

    // リセットボタン処理
    const shortcutSettingReset: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_RESET_ID);

    if (shortcutSettingReset) {
        shortcutSettingReset.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 親のイベントを中止
            event.stopPropagation();

            shortcutSettingMenuResetUseCase();
        });
    }

    // 閉じるボタン処理
    const shortcutSettingClose: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_CLOSE_ID);

    if (shortcutSettingClose) {
        shortcutSettingClose.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 親のイベントを中止
            event.stopPropagation();

            shortcutSettingMenuCloseElementMouseDownUseCase();
        });
    }

    // スクリーンタブのボタン
    const shortcutScreenList: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_SCREEN_ID);

    if (shortcutScreenList) {
        shortcutScreenList.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 親のイベントを中止
            event.stopPropagation();

            shortcutSettingMenuShowScreenListUseCase();
        });
    }

    // タイムラインタブのボタン
    const shortcutTimelineList: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_TIMELINE_ID);

    if (shortcutTimelineList) {
        shortcutTimelineList.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 親のイベントを中止
            event.stopPropagation();

            shortcutSettingMenuShowTimelineListUseCase();
        });
    }

    // ライブラリタブのボタン
    const shortcutLibraryList: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_LIBRARY_ID);

    if (shortcutLibraryList) {
        shortcutLibraryList.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 親のイベントを中止
            event.stopPropagation();

            shortcutSettingMenuShowLibraryListUseCase();
        });
    }
};

