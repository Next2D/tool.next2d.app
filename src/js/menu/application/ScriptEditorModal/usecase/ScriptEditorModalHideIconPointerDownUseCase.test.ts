import { execute } from "./ScriptEditorModalHideIconPointerDownUseCase";
import { describe, expect, it, vi } from "vitest";

describe("ScriptEditorModalHideIconPointerDownUseCase Test", () =>
{
    it("execute test", async () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const eventMock = {
            "button": 0,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        await execute(eventMock);
        
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});