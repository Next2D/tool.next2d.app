import { execute } from "./ShortcutSettingMenuListComponent";
import { describe, expect, it } from "vitest";
import { $SHORTCUT_SETTING_LIST_CLASS_NAME } from "../../../../config/ShortcutConfig";

describe("ShortcutSettingMenuListComponent Test", () =>
{
    it("test case", () =>
    {
        const shortcutObject = {
            "css": "class_name",
            "description": "description",
            "key": "key",
            "text": "cText"
        };

        const value = execute(shortcutObject, "test_text");
        
        expect(value).toBe(`
<div class="${$SHORTCUT_SETTING_LIST_CLASS_NAME}">
    <i class="class_name"></i>
    <div class="description">
        <span class="language" data-text="description">description</span>
    </div>
    <div class="command" data-default-key="key" data-default-text="cText">test_text</div>
</div>
`);
    });
});