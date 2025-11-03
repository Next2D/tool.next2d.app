import { execute } from "./TimelineAdjustmentXPointerDownEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/menu/application/MenuUtil", () => ({
    $allHideMenu: vi.fn()
}));

vi.mock("@/global/GlobalUtil", () => ({
    $setEditingElement: vi.fn()
}));

describe("TimelineAdjustmentXPointerDownEventUseCaseTest", () =>
{
    let element: HTMLElement;
    let mockEvent: PointerEvent;

    beforeEach(() =>
    {
        element = document.createElement("div");
        element.setPointerCapture = vi.fn();
        element.releasePointerCapture = vi.fn();
        document.body.appendChild(element);

        mockEvent = new PointerEvent("pointerdown", {
            pointerId: 1,
            bubbles: true,
            cancelable: true
        });

        Object.defineProperty(mockEvent, "target", {
            value: element,
            writable: false
        });
    });

    it("should stop event propagation", () =>
    {
        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");
        
        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it("should set pointer capture", () =>
    {
        const setPointerCaptureSpy = vi.spyOn(element, "setPointerCapture");
        
        execute(mockEvent);

        expect(setPointerCaptureSpy).toHaveBeenCalledWith(1);
    });

    it("should register pointer move event listener", () =>
    {
        const addEventListenerSpy = vi.spyOn(element, "addEventListener");
        
        execute(mockEvent);

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_MOVE,
            expect.any(Function),
            { "passive": false }
        );
    });

    it("should register pointer up, cancel, and leave event listeners", () =>
    {
        const addEventListenerSpy = vi.spyOn(element, "addEventListener");
        
        execute(mockEvent);

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_UP,
            expect.any(Function)
        );
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_CANCEL,
            expect.any(Function)
        );
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_LEAVE,
            expect.any(Function)
        );
    });

    it("should return early when target element is null", () =>
    {
        const nullEvent = new PointerEvent("pointerdown");
        Object.defineProperty(nullEvent, "target", {
            value: null,
            writable: false
        });

        const addEventListenerSpy = vi.spyOn(element, "addEventListener");
        
        execute(nullEvent);

        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });
});
