import { execute } from "./ShortcutSettingMenuShowTimelineListService";
import {
    $SHORTCUT_SCREEN_LIST_ID,
    $SHORTCUT_TIMELINE_LIST_ID,
    $SHORTCUT_LIBRARY_LIST_ID,
    $SHORTCUT_SETTING_SCREEN_ID,
    $SHORTCUT_SETTING_TIMELINE_ID,
    $SHORTCUT_SETTING_LIBRARY_ID
} from "../../../../config/ShortcutConfig";

describe("ShortcutSettingMenuShowTimelineListServiceTest", () =>
{
    test("execute test", () =>
    {
        const screenList = document.createElement("div");
        screenList.id = $SHORTCUT_SCREEN_LIST_ID;
        document.body.appendChild(screenList);

        const screenSetting = document.createElement("div");
        screenSetting.id = $SHORTCUT_SETTING_SCREEN_ID;
        document.body.appendChild(screenSetting);

        const timelineList = document.createElement("div");
        timelineList.id = $SHORTCUT_TIMELINE_LIST_ID;
        document.body.appendChild(timelineList);

        const timelineSetting = document.createElement("div");
        timelineSetting.id = $SHORTCUT_SETTING_TIMELINE_ID;
        document.body.appendChild(timelineSetting);

        const libraryList = document.createElement("div");
        libraryList.id = $SHORTCUT_LIBRARY_LIST_ID;
        document.body.appendChild(libraryList);

        const librarySetting = document.createElement("div");
        librarySetting.id = $SHORTCUT_SETTING_LIBRARY_ID;
        document.body.appendChild(librarySetting);

        expect(screenList.classList.contains("shortcut-inactive")).toBe(false);
        expect(timelineList.classList.contains("shortcut-inactive")).toBe(false);
        expect(libraryList.classList.contains("shortcut-inactive")).toBe(false);
        expect(screenSetting.classList.contains("shortcut-active")).toBe(false);
        expect(timelineSetting.classList.contains("shortcut-active")).toBe(false);
        expect(librarySetting.classList.contains("shortcut-active")).toBe(false);
        execute();
        expect(screenList.classList.contains("shortcut-inactive")).toBe(true);
        expect(timelineList.classList.contains("shortcut-inactive")).toBe(false);
        expect(libraryList.classList.contains("shortcut-inactive")).toBe(true);
        expect(screenSetting.classList.contains("shortcut-active")).toBe(false);
        expect(timelineSetting.classList.contains("shortcut-active")).toBe(true);
        expect(librarySetting.classList.contains("shortcut-active")).toBe(false);

        screenList.remove();
        screenSetting.remove();
        timelineList.remove();
        timelineSetting.remove();
        libraryList.remove();
        librarySetting.remove();
    });
});