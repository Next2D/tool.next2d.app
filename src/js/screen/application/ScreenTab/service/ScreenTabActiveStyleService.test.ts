import { execute } from "./ScreenTabActiveStyleService";
import { describe, expect, it } from "vitest";

describe("ScreenTabActiveStyleServiceTest", () =>
{
    it("execute test", () =>
    {
        const textElement = document.createElement("div");
        textElement.contentEditable = "false";

        const tabElement = document.createElement("div");

        expect(textElement.contentEditable).toBe("false");
        expect(tabElement.style.borderBottom).toBe("");
        execute(textElement, tabElement);
        expect(textElement.contentEditable).toBe("true");
        expect(tabElement.style.borderBottom).toBe("1px solid #f5f5f5");
    });
});