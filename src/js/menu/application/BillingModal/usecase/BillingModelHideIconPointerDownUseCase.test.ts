import { execute } from "./BillingModelHideIconPointerDownUseCase";
import { describe, expect, it, vi } from "vitest";

describe("BillingModelHideIconPointerDownUseCase Test", () =>
{
    it("execute test", async () =>
    {
        let preventDefault = false;
        let stopPropagation = false;
        const mockEvent = {
            "button": 0,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});