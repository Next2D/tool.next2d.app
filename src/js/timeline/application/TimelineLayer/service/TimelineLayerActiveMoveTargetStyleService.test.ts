import { execute } from "./TimelineLayerActiveMoveTargetStyleService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerActiveMoveTargetStyleServiceTest", () =>
{
    it("execute test", (): void =>
    {
        const div = document.createElement("div");

        expect(div.classList.contains("move-target")).toBe(false);
        execute(div);
        expect(div.classList.contains("move-target")).toBe(true);
    });
});