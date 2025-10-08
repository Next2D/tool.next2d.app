import { execute } from "./ScreenTabActiveStyleService";
import { describe, expect, it, vi } from "vitest";

describe("ScreenTabActiveStyleServiceTest", () =>
{
    it("execute test", () =>
    {
        const textElement = document.createElement("div");
        textElement.contentEditable = "false";
        
        // focus()をspyする
        const focusSpy = vi.spyOn(textElement, 'focus');

        const tabElement = document.createElement("div");

        expect(textElement.contentEditable).toBe("false");
        execute(textElement, tabElement);
        expect(textElement.contentEditable).toBe("true");
        
        // focus()が呼ばれたことを確認
        expect(focusSpy).toHaveBeenCalled();
    });
});