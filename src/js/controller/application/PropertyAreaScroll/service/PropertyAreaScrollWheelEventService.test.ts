import { execute } from "./PropertyAreaScrollWheelEventService";
import {
    $CONTROLLER_AREA_PROPERTY_BODY_ID,
    $PROPERTY_SCROLL_BAR_ID
} from "../../../../config/PropertyConfig";
import { describe, expect, it, vi } from "vitest";

describe("PropertyAreaScrollWheelEventService Test", () =>
{
    it("execute test", async () =>
    {
        const bodyElement = document.createElement("div");
        document.body.appendChild(bodyElement);
        bodyElement.id = $CONTROLLER_AREA_PROPERTY_BODY_ID;

        const scrollBarElement = document.createElement("div");
        document.body.appendChild(scrollBarElement);
        scrollBarElement.id = $PROPERTY_SCROLL_BAR_ID;

        let stopPropagation = false;
        let preventDefault  = false;

        const mockEvent = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() =>
            {
                preventDefault = true;
            }),
            "deltaY": 10,
        } as unknown as WheelEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(bodyElement.scrollTop).toBe(0);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);

        await new Promise<void>((resolve) =>
        {
            setTimeout(() =>
            {
                expect(bodyElement.scrollTop).toBe(10);
                resolve();
            }, 30);
        });

        bodyElement.remove();
        scrollBarElement.remove();
    });
});