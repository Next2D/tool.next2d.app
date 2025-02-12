import { execute } from "./GlobalRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("GlobalRegisterEventUseCase Test", () =>
{
    it("test case", () =>
    {
        vi
            .spyOn(window, "addEventListener")
            .mockImplementation((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) =>
            {
                expect(type).toBe("resize");
            });

        vi
            .spyOn(document, "addEventListener")
            .mockImplementation((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) =>
            {
                expect(type).toBe("touchend");
            });

        execute();
    });
});