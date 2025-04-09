import { execute } from "./TimelineLayerFrameActiveElementService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerFrameActiveElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");

        expect(div.classList.contains("frame-active")).toBe(false);
        execute(div);
        expect(div.classList.contains("frame-active")).toBe(true);
    });
});