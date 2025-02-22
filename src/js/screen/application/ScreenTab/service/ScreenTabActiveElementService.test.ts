import { execute } from "./ScreenTabActiveElementService";
import { describe, expect, it } from "vitest";

describe("ScreenTabActiveElementServiceTest", () =>
{
    it("execute test", () =>
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