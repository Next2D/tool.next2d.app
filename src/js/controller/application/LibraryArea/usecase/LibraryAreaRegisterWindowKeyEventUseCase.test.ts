import { execute } from "./LibraryAreaRegisterWindowKeyEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaRegisterWindowKeyEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        let stopPropagation = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            })
        } as unknown as PointerEvent;

        let keydown = false;
        window.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case "keydown":
                    keydown = true;
                    break;

                default:
                    throw new Error("Invalid event type");

            }
        });

        expect(stopPropagation).toBe(false);
        expect(keydown).toBe(false);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(keydown).toBe(true);
    });
});