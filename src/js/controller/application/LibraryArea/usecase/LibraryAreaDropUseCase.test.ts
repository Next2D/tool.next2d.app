import { execute } from "./LibraryAreaDropUseCase";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaDropUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        let preventDefault = false;
        let stopPropagation = false;
        const mockEvent = {
            "preventDefault": vi.fn(() => preventDefault = true),
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "dataTransfer": null
        } as unknown as DragEvent;

        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);
        execute(mockEvent);
        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);
    });
});