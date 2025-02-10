import { execute } from "./ControllerTabInitializeRegisterEventUseCase";
import { $CONTROLLER_TAB_AREA_ID } from "../../../../config/ControllerConfig";
import { EventType } from "../../../../tool/domain/event/EventType";
import { describe, expect, it, vi } from "vitest";

describe("ControllerTabInitializeRegisterEventUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("div");
        div.id = $CONTROLLER_TAB_AREA_ID;

        const node = document.createElement("div");

        let state = "none";
        node.addEventListener = vi.fn((name) =>
        {
            state = name;
        });
        div.appendChild(node);

        document.body.appendChild(div);

        expect(state).toBe("none");
        execute();
        expect(state).toBe(EventType.POINTER_DOWN);

        document.body.removeChild(div);
    });
});