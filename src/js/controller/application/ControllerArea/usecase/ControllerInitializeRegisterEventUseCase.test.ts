import { execute } from "./ControllerInitializeRegisterEventUseCase";
import { $CONTROLLER_ID } from "../../../../config/ControllerConfig";
import { EventType } from "../../../../tool/domain/event/EventType";
import { describe, expect, it, vi } from "vitest";

describe("ControllerInitializeRegisterEventUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("input");
        div.id = $CONTROLLER_ID;
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