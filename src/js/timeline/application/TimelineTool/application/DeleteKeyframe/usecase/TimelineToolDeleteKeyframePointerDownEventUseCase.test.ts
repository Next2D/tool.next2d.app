import { execute } from "./TimelineToolDeleteKeyframePointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";

vi.mock("./TimelineToolDeleteKeyframeUseCase", () => ({
    execute: vi.fn()
}));

import { execute as timelineToolDeleteKeyframeUseCase } from "./TimelineToolDeleteKeyframeUseCase";

describe("TimelineToolDeleteKeyframePointerDownEventUseCase", () =>
{
    it("should call deleteKeyframe usecase when left button is clicked", () =>
    {
        const event = new PointerEvent("pointerdown", { button: 0 });
        const stopPropagationSpy = vi.spyOn(event, "stopPropagation");

        execute(event);

        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(timelineToolDeleteKeyframeUseCase).toHaveBeenCalled();
    });

    it("should not call deleteKeyframe usecase when right button is clicked", () =>
    {
        vi.clearAllMocks();
        const event = new PointerEvent("pointerdown", { button: 2 });

        execute(event);

        expect(timelineToolDeleteKeyframeUseCase).not.toHaveBeenCalled();
    });

    it("should not call deleteKeyframe usecase when middle button is clicked", () =>
    {
        vi.clearAllMocks();
        const event = new PointerEvent("pointerdown", { button: 1 });

        execute(event);

        expect(timelineToolDeleteKeyframeUseCase).not.toHaveBeenCalled();
    });

    it("should stop event propagation when left button is clicked", () =>
    {
        const event = new PointerEvent("pointerdown", { button: 0 });
        const stopPropagationSpy = vi.spyOn(event, "stopPropagation");

        execute(event);

        expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });
});
