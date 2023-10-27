import { execute } from "./ScreenTabInactiveStyleService";

describe("ScreenTabInactiveStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.contentEditable = "true";
        div.style.borderBottom = "1px solid #f5f5f5";
        div.style.height = "20px";

        expect(div.contentEditable).toBe("true");
        expect(div.style.borderBottom).toBe("1px solid #f5f5f5");
        expect(div.style.height).toBe("20px");

        execute(div);

        expect(div.contentEditable).toBe("false");
        expect(div.style.borderBottom).toBe("");
        expect(div.style.height).toBe("");
    });
});