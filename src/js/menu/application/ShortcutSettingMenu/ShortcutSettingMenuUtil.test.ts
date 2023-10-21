import {
    $getSelectElement,
    $setSelectElement
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
});