import { execute } from "./ScreenTabActiveElementService";

describe("ScreenTabActiveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.classList.add("disable");

        expect(div.classList.contains("disable")).toBe(true);
        expect(div.classList.contains("active")).toBe(false);
        execute(div);
        expect(div.classList.contains("disable")).toBe(false);
        expect(div.classList.contains("active")).toBe(true);
    });
});