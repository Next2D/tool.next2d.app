import { execute } from "./TimelineToolDeleteKeyframeInitializeRegisterEventUseCase";
import { $TIMELINE_DELETE_KEYFRAME_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("TimelineToolDeleteKeyframeInitializeRegisterEventUseCase", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = "";
    });

    it("should register pointer down event listener when element exists", () =>
    {
        const button = document.createElement("button");
        button.id = $TIMELINE_DELETE_KEYFRAME_ID;
        document.body.appendChild(button);

        const addEventListenerSpy = vi.spyOn(button, "addEventListener");

        execute();

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            EventType.POINTER_DOWN,
            expect.any(Function)
        );
    });

    it("should not throw error when element does not exist", () =>
    {
        expect(() => execute()).not.toThrow();
    });

    it("should do nothing when element is null", () =>
    {
        const getElementById = vi.spyOn(document, "getElementById");
        getElementById.mockReturnValue(null);

        execute();

        expect(getElementById).toHaveBeenCalledWith($TIMELINE_DELETE_KEYFRAME_ID);
    });
});
