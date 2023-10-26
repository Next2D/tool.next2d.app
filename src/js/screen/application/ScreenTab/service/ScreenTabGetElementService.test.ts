import { execute } from "./ScreenTabGetElementService";

describe("ScreenTabGetElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = "tab-id-1";
        document.body.appendChild(div);

        expect(execute(0)).toBe(null);
        expect(execute(1)).toBe(div);

        div.remove();
    });
});