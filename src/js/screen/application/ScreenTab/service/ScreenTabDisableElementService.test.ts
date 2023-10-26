import { execute } from "./ScreenTabDisableElementService";

describe("ScreenTabDisableElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.classList.add("active");

        expect(div.classList.contains("disable")).toBe(false);
        expect(div.classList.contains("active")).toBe(true);
        execute(div);
        expect(div.classList.contains("disable")).toBe(true);
        expect(div.classList.contains("active")).toBe(false);
    });
});