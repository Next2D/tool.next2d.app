import { execute } from "./TimelineLayerFrameInactiveElementService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerFrameInactiveElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.classList.add("frame-active");

        expect(div.classList.contains("frame-active")).toBe(true);
        execute(div);
        expect(div.classList.contains("frame-active")).toBe(false);
    });
});