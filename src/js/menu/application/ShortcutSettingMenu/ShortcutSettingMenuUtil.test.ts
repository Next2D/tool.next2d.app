import {
    $getSelectElement,
    $setSelectElement,
    $getSelectTabName,
    $setSelectTabName,
    $generateShortcutKey
} from "./ShortcutSettingMenuUtil";

describe("ShortcutSettingMenuUtilTest", () =>
{
    test("$getSelectElement and $setSelectElement test", () =>
    {
        expect($getSelectElement()).toBe(null);
        const div = document.createElement("div");
        $setSelectElement(div);
        expect($getSelectElement()).toBe(div);
        $setSelectElement(null);
        expect($getSelectElement()).toBe(null);
    });

    test("$getSelectTabName and $setSelectTabName test", () =>
    {
        expect($getSelectTabName()).toBe("screen");
        $setSelectTabName("timeline");
        expect($getSelectTabName()).toBe("timeline");
        $setSelectTabName("library");
        expect($getSelectTabName()).toBe("library");
    });

    test("$generateShortcutKey test", () =>
    {
        expect($generateShortcutKey("a")).toBe("a");
        expect($generateShortcutKey("b", {
            "shift": true
        })).toBe("bShift");
        expect($generateShortcutKey("c", {
            "shift": true,
            "alt": true
        })).toBe("cShiftAlt");
        expect($generateShortcutKey("d", {
            "shift": true,
            "ctrl": true,
            "alt": true
        })).toBe("dShiftAltCtrl");
    });
});