import {
    $getSelectElement,
    $setSelectElement,
    $getSelectTabName,
    $setSelectTabName
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
});