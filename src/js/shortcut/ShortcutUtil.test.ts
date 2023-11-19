import {
    $generateShortcutKey
} from "./ShortcutUtil";

describe("ShortcutUtilTest", () =>
{
    test("$generateShortcutKey test", () =>
    {
        expect($generateShortcutKey("a")).toBe("a");
        expect($generateShortcutKey("A")).toBe("a");

        expect($generateShortcutKey("A", {
            "alt": true
        })).toBe("aAlt");
        expect($generateShortcutKey("A", {
            "ctrl": true
        })).toBe("aCtrl");
        expect($generateShortcutKey("A", {
            "shift": true
        })).toBe("aShift");

        expect($generateShortcutKey("A", {
            "alt": true,
            "ctrl": true
        })).toBe("aAltCtrl");
        expect($generateShortcutKey("A", {
            "alt": true,
            "shift": true
        })).toBe("aShiftAlt");
        expect($generateShortcutKey("A", {
            "ctrl": true,
            "shift": true
        })).toBe("aShiftCtrl");
        
        expect($generateShortcutKey("A", {
            "alt": true,
            "ctrl": true,
            "shift": true
        })).toBe("aShiftAltCtrl");
    });
});