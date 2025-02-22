import { execute } from "./ScreenTabDisableElementService";
import { describe, expect, it } from "vitest";

describe("ScreenTabDisableElementServiceTest", () =>
{
    it("execute test", () =>
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