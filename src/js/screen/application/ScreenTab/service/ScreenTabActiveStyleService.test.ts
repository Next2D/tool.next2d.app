import { execute } from "./ScreenTabActiveStyleService";

describe("ScreenTabActiveStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.contentEditable = "false";

        expect(div.contentEditable).toBe("false");
        expect(div.style.borderBottom).toBe("");
        expect(div.style.height).toBe("");

        execute(div);

        expect(div.contentEditable).toBe("true");
        expect(div.style.borderBottom).toBe("1px solid #f5f5f5");
        expect(div.style.height).toBe("20px");
    });
});