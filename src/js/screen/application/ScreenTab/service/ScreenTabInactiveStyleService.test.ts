import { execute } from "./ScreenTabInactiveStyleService";
import { describe, expect, it } from "vitest";

describe("ScreenTabInactiveStyleServiceTest", () =>
{
    it("execute test", () =>
    {
        const textElement = document.createElement("div");
        textElement.contentEditable = "true";

        const tabElement = document.createElement("div");
        tabElement.style.borderBottom = "1px solid #f5f5f5";
        tabElement.draggable = false;

        expect(tabElement.draggable).toBe(false);
        expect(textElement.contentEditable).toBe("true");
        expect(tabElement.style.borderBottom).toBe("1px solid rgb(245, 245, 245)");

        execute(textElement, tabElement);

        expect(tabElement.draggable).toBe(true);
        expect(textElement.contentEditable).toBe("false");
        expect(tabElement.style.borderBottom).toBe("");
    });
});