import { execute } from "./TimelineHeaderFrameRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("TimelineHeaderFrameRegisterEventUseCase Test", () =>
{
    it("execute test script", (): void =>
    {
        const div = document.createElement("div");
        div.appendChild(document.createElement("div"));

        const labelElement = document.createElement("div");
        div.appendChild(labelElement);

        let labelElementCheck = false;
        labelElement.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                labelElementCheck = true;
            }
        });

        const scriptElement = document.createElement("div");
        div.appendChild(scriptElement);

        let scriptElementCheck = false;
        scriptElement.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                scriptElementCheck = true;
            }
        });

        const soundElement = document.createElement("div");
        div.appendChild(soundElement);

        let soundElementCheck = false;
        soundElement.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                soundElementCheck = true;
            }
        });

        let pointerdown = false;
        let pointerup = false;
        let pointercancel = false;
        div.addEventListener = vi.fn((type) =>
        {
            switch (type) {
                case EventType.POINTER_DOWN:
                    pointerdown = true;
                    break;

                case EventType.POINTER_UP:
                    pointerup = true;
                    break;

                case EventType.POINTER_CANCEL:
                    pointercancel = true;
                    break;

                default:
                    throw new Error("Unknown event type");
            }
        });

        expect(pointerdown).toBe(false);
        expect(pointerup).toBe(false);
        expect(pointercancel).toBe(false);
        expect(labelElementCheck).toBe(false);
        expect(scriptElementCheck).toBe(false);
        expect(soundElementCheck).toBe(false);

        execute(div);

        expect(pointerdown).toBe(true);
        expect(pointerup).toBe(true);
        expect(pointercancel).toBe(true);
        expect(labelElementCheck).toBe(true);
        expect(scriptElementCheck).toBe(true);
        expect(soundElementCheck).toBe(true);
    });
});