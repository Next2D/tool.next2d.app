import { execute } from "./BillingModelInitializeRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $LIBRARY_BILLING_HIDE_ICON_ID } from "../../../../config/BillingConfig";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("BillingModelInitializeRegisterEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const div = document.createElement("div");

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN){
                pointerDown = true;
            } else {
                throw new Error("Unexpected event type");
            }
        });
        div.id = $LIBRARY_BILLING_HIDE_ICON_ID;
        document.body.appendChild(div);

        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        div.remove();
    });
});