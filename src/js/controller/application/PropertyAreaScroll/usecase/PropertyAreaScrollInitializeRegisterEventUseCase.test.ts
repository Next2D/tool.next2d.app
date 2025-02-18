import { execute } from "./PropertyAreaScrollInitializeRegisterEventUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import { $PROPERTY_SCROLL_BAR_ID } from "../../../../config/PropertyConfig";
import { describe, expect, it, vi } from "vitest";

describe("PropertyAreaScrollInitializeRegisterEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const element = document.createElement("div");
        element.id = $PROPERTY_SCROLL_BAR_ID;
        document.body.appendChild(element);

        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    expect(type).toBe(EventType.POINTER_DOWN);
                    return;

                default:
                    throw new Error("Invalid event type");
            }
        });

        execute();

        element.remove();
    });
});