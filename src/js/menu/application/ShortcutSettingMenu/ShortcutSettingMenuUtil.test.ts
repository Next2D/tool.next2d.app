import {
    $getSelectElement,
    $setSelectElement
} from "./ShortcutSettingMenuUtil";
import { describe, expect, it } from "vitest";

describe("ShortcutSettingMenuUtilTest", () =>
{
    it("$getSelectElement and $setSelectElement test", () =>
    {
        expect($getSelectElement()).toBe(null);
        const div = document.createElement("div");
        $setSelectElement(div);
        expect($getSelectElement()).toBe(div);
        $setSelectElement(null);
        expect($getSelectElement()).toBe(null);
    });
});