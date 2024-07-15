import { execute } from "./ScreenAreaReadOnlyElementService";

describe("ScreenAreaReadOnlyElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");

        expect(div.classList.contains("disabled")).toBe(false);
        expect(div.classList.contains("translucent")).toBe(false);

        execute(div);

        expect(div.classList.contains("disabled")).toBe(true);
        expect(div.classList.contains("translucent")).toBe(true);
    });
});