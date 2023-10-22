import { execute } from "./ShortcutSettingMenuChangeListStyleService";

describe("ShortcutSettingMenuChangeListStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div1 = document.createElement("div");
        expect(div1.classList.contains("shortcut-active")).toBe(false);
        execute(div1);
        expect(div1.classList.contains("shortcut-active")).toBe(true);

        const div2 = document.createElement("div");
        expect(div2.classList.contains("shortcut-active")).toBe(false);
        execute(div2);
        expect(div1.classList.contains("shortcut-active")).toBe(false);
        expect(div2.classList.contains("shortcut-active")).toBe(true);
    });
});