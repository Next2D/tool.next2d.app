import { execute } from "./TimelineAdjustmentYPointerUpUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase", () => ({
    execute: vi.fn().mockResolvedValue(undefined)
}));

describe("TimelineAdjustmentYPointerUpUseCaseTest", () =>
{
    let element: HTMLElement;
    let mockEvent: PointerEvent;

    beforeEach(() =>
    {
        element = document.createElement("div");
        element.setPointerCapture = vi.fn();
        element.releasePointerCapture = vi.fn();
        document.body.appendChild(element);

        mockEvent = new PointerEvent("pointerup", {
            pointerId: 1,
            bubbles: true,
            cancelable: true
        });

        Object.defineProperty(mockEvent, "target", {
            value: element,
            writable: false
        });
    });

    it("should stop event propagation", async () =>
    {
        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");
        
        await execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it("should release pointer capture", async () =>
    {
        const releasePointerCaptureSpy = vi.spyOn(element, "releasePointerCapture");
        
        await execute(mockEvent);

        expect(releasePointerCaptureSpy).toHaveBeenCalledWith(1);
    });

    it("should remove pointer move event listener", async () =>
    {
        const removeEventListenerSpy = vi.spyOn(element, "removeEventListener");
        
        await execute(mockEvent);

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_MOVE,
            expect.any(Function)
        );
    });

    it("should remove pointer up, cancel, and leave event listeners", async () =>
    {
        const removeEventListenerSpy = vi.spyOn(element, "removeEventListener");
        
        await execute(mockEvent);

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_UP,
            execute
        );
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_CANCEL,
            execute
        );
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_LEAVE,
            execute
        );
    });

    it("should return early when target element is null", async () =>
    {
        const nullEvent = new PointerEvent("pointerup");
        Object.defineProperty(nullEvent, "target", {
            value: null,
            writable: false
        });

        const removeEventListenerSpy = vi.spyOn(element, "removeEventListener");
        
        await execute(nullEvent);

        expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });
});
