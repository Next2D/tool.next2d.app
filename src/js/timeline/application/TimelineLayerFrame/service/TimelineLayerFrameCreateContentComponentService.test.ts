import { execute } from "./TimelineLayerFrameCreateContentComponentService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerFrameCreateContentComponentServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        expect(div.children.length).toBe(0);
        execute(div, 0, 1, 0, 1);
        expect(div.children.length).toBe(1);
    });
});