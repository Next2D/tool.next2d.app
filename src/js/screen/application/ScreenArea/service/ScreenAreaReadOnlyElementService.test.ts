import { execute } from "./ScreenAreaReadOnlyElementService";

describe("ScreenAreaReadOnlyElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");

        expect(div.class.contains("disabled")).toBe(false);
        expect(div.class.contains("translucent")).toBe(false);

        execute(div);

        expect(div.class.contains("disabled")).toBe(true);
        expect(div.class.contains("translucent")).toBe(true);
    });
});