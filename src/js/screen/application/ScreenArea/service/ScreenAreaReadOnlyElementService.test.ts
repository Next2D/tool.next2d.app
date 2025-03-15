import { execute } from "./ScreenAreaReadOnlyElementService";
import { describe, expect, it } from "vitest";

describe("ScreenAreaReadOnlyElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");

        expect(div.classList.contains("disabled")).toBe(false);
        expect(div.classList.contains("translucent")).toBe(false);

        execute(div);

        expect(div.classList.contains("disabled")).toBe(true);
        expect(div.classList.contains("translucent")).toBe(true);
    });
});