import { execute } from "./ScreenTabInactiveStyleService";

describe("ScreenTabInactiveStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const textElement = document.createElement("div");
        textElement.contentEditable = "true";

        const tabElement = document.createElement("div");
        tabElement.style.borderBottom = "1px solid #f5f5f5";

        expect(textElement.contentEditable).toBe("true");
        expect(tabElement.style.borderBottom).toBe("1px solid #f5f5f5");
        execute(textElement, tabElement);
        expect(textElement.contentEditable).toBe("false");
        expect(tabElement.style.borderBottom).toBe("");
    });
});