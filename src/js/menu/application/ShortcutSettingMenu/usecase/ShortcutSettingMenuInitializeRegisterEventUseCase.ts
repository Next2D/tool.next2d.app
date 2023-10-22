import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as shortcutSettingMenuShowScreenListUseCase } from "../usecase/ShortcutSettingMenuShowScreenListUseCase";
import { execute as shortcutSettingMenuShowTimelineListUseCase } from "../usecase/ShortcutSettingMenuShowTimelineListUseCase";
import { execute as shortcutSettingMenuShowLibraryListUseCase } from "../usecase/ShortcutSettingMenuShowLibraryListUseCase";
import { execute as shortcutSettingMenuCloseElementMouseDownUseCase } from "./ShortcutSettingMenuCloseElementMouseDownUseCase";
import { execute as shortcutSettingMenuChangeListStyleUseCase } from "./ShortcutSettingMenuChangeListStyleUseCase";
import {
    $SHORTCUT_SETTING_CLOSE_ID,
    $SHORTCUT_SETTING_LIBRARY_ID,
    $SHORTCUT_SETTING_LIST_CLASS_NAME,
    $SHORTCUT_SETTING_LIST_ID,
    $SHORTCUT_SETTING_SCREEN_ID,
    $SHORTCUT_SETTING_TIMELINE_ID
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
    const shortcutSettingClose: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_CLOSE_ID);

    if (shortcutSettingClose) {
        shortcutSettingClose.addEventListener(EventType.MOUSE_DOWN, (): void =>
        {
            shortcutSettingMenuCloseElementMouseDownUseCase();
        });
    }

    // スクリーンのショートカットリストの選択ボタン
    const shortcutScreenList: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_SCREEN_ID);

    if (shortcutScreenList) {
        shortcutScreenList.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            shortcutSettingMenuShowScreenListUseCase(event);
        });
    }

    // タイムラインのショートカットリストの選択ボタン
    const shortcutTimelineList: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_TIMELINE_ID);

    if (shortcutTimelineList) {
        shortcutTimelineList.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            shortcutSettingMenuShowTimelineListUseCase(event);
        });
    }

    // ライブラリのショートカットリストの選択ボタン
    const shortcutLibraryList: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_LIBRARY_ID);

    if (shortcutLibraryList) {
        shortcutLibraryList.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            shortcutSettingMenuShowLibraryListUseCase(event);
        });
    }

    // ショートカットリストの親Element
    const parent: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_LIST_ID);

    if (parent) {

        const elements: HTMLCollection = parent
            .getElementsByClassName($SHORTCUT_SETTING_LIST_CLASS_NAME);

        const length: number = elements.length;
        for (let idx: number = 0; idx < length; ++idx) {
            const element: HTMLElement = elements[idx] as HTMLElement;
            element.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
            {
                shortcutSettingMenuChangeListStyleUseCase(event);
            });
        }
    }
};

