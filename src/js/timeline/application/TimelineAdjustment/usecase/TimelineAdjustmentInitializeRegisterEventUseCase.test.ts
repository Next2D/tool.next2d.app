import { execute } from "./TimelineAdjustmentInitializeRegisterEventUseCase";
import { $TIMELINE_ADJUSTMENT_X_ID, $TIMELINE_ADJUSTMENT_Y_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("TimelineAdjustmentInitializeRegisterEventUseCaseTest", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = "";
    });

    it("should register pointer down event on X adjustment element", () =>
    {
        const xElement = document.createElement("div");
        xElement.id = $TIMELINE_ADJUSTMENT_X_ID;
        document.body.appendChild(xElement);

        const addEventListenerSpy = vi.spyOn(xElement, "addEventListener");

        execute();

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_DOWN,
            expect.any(Function)
        );
    });

    it("should register pointer down event on Y adjustment element", () =>
    {
        const yElement = document.createElement("div");
        yElement.id = $TIMELINE_ADJUSTMENT_Y_ID;
        document.body.appendChild(yElement);

        const addEventListenerSpy = vi.spyOn(yElement, "addEventListener");

        execute();

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_DOWN,
            expect.any(Function)
        );
    });

    it("should register events on both elements when both exist", () =>
    {
        const xElement = document.createElement("div");
        xElement.id = $TIMELINE_ADJUSTMENT_X_ID;
        document.body.appendChild(xElement);

        const yElement = document.createElement("div");
        yElement.id = $TIMELINE_ADJUSTMENT_Y_ID;
        document.body.appendChild(yElement);

        const xSpy = vi.spyOn(xElement, "addEventListener");
        const ySpy = vi.spyOn(yElement, "addEventListener");

        execute();

        expect(xSpy).toHaveBeenCalled();
        expect(ySpy).toHaveBeenCalled();
    });

    it("should not throw error when elements do not exist", () =>
    {
        expect(() => execute()).not.toThrow();
    });
});
