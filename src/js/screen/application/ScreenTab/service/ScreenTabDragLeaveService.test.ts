import { execute } from "./ScreenTabDragLeaveService";
import { describe, expect, it, vi } from "vitest";

describe("ScreenTabDragLeaveServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.classList.add("drop-target");

        let preventDefault = false
        let stopPropagation = false
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true }),
            "preventDefault": vi.fn(() => { preventDefault = true }),
            "currentTarget": div
        } as unknown as DragEvent;

        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);
        expect(div.classList.contains("drop-target")).toBe(true);

        execute(mockEvent);

        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);
        expect(div.classList.contains("drop-target")).toBe(false);
    });
});