import { execute } from "./ScreenTabGetTextElementService";

describe("ScreenTabGetTextElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = "tab-text-id-1";
        document.body.appendChild(div);

        expect(execute(0)).toBe(null);
        expect(execute(1)).toBe(div);

        div.remove();
    });
});