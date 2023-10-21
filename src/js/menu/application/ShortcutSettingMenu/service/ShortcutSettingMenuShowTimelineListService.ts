import {
    $SHORTCUT_SCREEN_LIST_ID,
    $SHORTCUT_TIMELINE_LIST_ID,
    $SHORTCUT_LIBRARY_LIST_ID,
    $SHORTCUT_SETTING_SCREEN_ID,
    $SHORTCUT_SETTING_TIMELINE_ID,
    $SHORTCUT_SETTING_LIBRARY_ID
} from "../../../../config/ShortcutConfig";

/**
 * @description タイムラインのショートカット一覧を表示
 *              Display a list of timeline shortcuts
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // スクリーンのショートカットリストの選択ボタン
    const shortcutScreenList: HTMLElement | null = document
        .getElementById($SHORTCUT_SCREEN_LIST_ID);

    // 非表示にする
    if (shortcutScreenList) {
        shortcutScreenList.setAttribute("class", "shortcut-inactive");
    }

    const shortcutSettingScreen: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_SCREEN_ID);

    // 非アクティブにする
    if (shortcutSettingScreen) {
        shortcutSettingScreen.setAttribute("class", "");
    }

    // タイムラインのショートカットリストの選択ボタン
    const shortcutTimelineList: HTMLElement | null = document
        .getElementById($SHORTCUT_TIMELINE_LIST_ID);

    // 表示にする
    if (shortcutTimelineList) {
        shortcutTimelineList.setAttribute("class", "");
    }

    const shortcutSettingTimeline: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_TIMELINE_ID);

    // アクティブにする
    if (shortcutSettingTimeline) {
        shortcutSettingTimeline.setAttribute("class", "shortcut-active");
    }

    // ライブラリのショートカットリストの選択ボタン
    const shortcutLibraryList: HTMLElement | null = document
        .getElementById($SHORTCUT_LIBRARY_LIST_ID);

    // 非表示にする
    if (shortcutLibraryList) {
        shortcutLibraryList.setAttribute("class", "shortcut-inactive");
    }

    const shortcutSettingLibrary: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_LIBRARY_ID);

    // 非アクティブにする
    if (shortcutSettingLibrary) {
        shortcutSettingLibrary.setAttribute("class", "");
    }
};