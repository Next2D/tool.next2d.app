import { execute } from "./ControllerAdjustmentInitializeRegisterEventUseCase";
import { $CONTROLLER_ADJUSTMENT_ID } from "../../../../config/ControllerConfig";
import { EventType } from "../../../../tool/domain/event/EventType";
import { describe, expect, it, vi } from "vitest";

describe("ControllerAdjustmentInitializeRegisterEventUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("input");
        div.id = $CONTROLLER_ADJUSTMENT_ID;
        document.body.appendChild(div);

        let state = "none";
        div.addEventListener = vi.fn((name) => 
        {
            state = name;
        });

        expect(state).toBe("none");
        execute();
        expect(state).toBe(EventType.POINTER_DOWN);

        document.body.removeChild(div);
    });
});