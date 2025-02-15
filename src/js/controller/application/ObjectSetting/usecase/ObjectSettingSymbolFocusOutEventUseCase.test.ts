import { execute } from "./ObjectSettingSymbolFocusOutEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("ObjectSettingSymbolFocusOutEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            stopPropagation: vi.fn(() =>
            {
                stopPropagation = true;
            }),
            preventDefault: vi.fn(() =>
            {
                preventDefault = true;
            })
        } as unknown as FocusEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});