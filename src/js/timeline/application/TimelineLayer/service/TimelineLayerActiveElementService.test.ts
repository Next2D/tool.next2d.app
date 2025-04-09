import { execute } from "./TimelineLayerActiveElementService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerActiveElementServiceTest", () =>
{
    it("execute test", (): void =>
    {
        const div = document.createElement("div");
        expect(div.classList.contains("active")).toBe(false);
        execute(div);
        expect(div.classList.contains("active")).toBe(true);
    });
});