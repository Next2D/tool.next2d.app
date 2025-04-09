import { execute } from "./TimelineLayerInactiveElementService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerInactiveElementServiceTest", () =>
{
    it("execute test", (): void =>
    {
        const div = document.createElement("div");
        div.classList.add("active");

        expect(div.classList.contains("active")).toBe(true);
        execute(div);
        expect(div.classList.contains("active")).toBe(false);
    });
});