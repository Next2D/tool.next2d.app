import { execute } from "./ConvertMovieClipModalCancelPointerDownEventUseCase";
import { execute as convertMovieClipModalHideUseCase } from "./ConvertMovieClipModalHideUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("./ConvertMovieClipModalHideUseCase");

describe("ConvertMovieClipModalCancelPointerDownEventUseCase", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("should stop event propagation", () =>
    {
        const mockEvent = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it("should call hide usecase", () =>
    {
        const mockEvent = new PointerEvent("pointerdown");

        execute(mockEvent);

        expect(convertMovieClipModalHideUseCase).toHaveBeenCalled();
    });

    it("should handle event correctly", () =>
    {
        const mockEvent = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
        expect(convertMovieClipModalHideUseCase).toHaveBeenCalledTimes(1);
    });
});
