import { execute } from "./ScriptAreaScrollInitializeRegisterEventUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import {
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID,
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID
} from "../../../../config/ControllerScriptAreaConfig";
import { describe, expect, it, vi } from "vitest";

describe("ScriptAreaScrollInitializeRegisterEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const scrollBarElement = document.createElement("div");
        scrollBarElement.id = $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID;
        document.body.appendChild(scrollBarElement);

        scrollBarElement.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    expect(type).toBe(EventType.POINTER_DOWN);
                    return;

                default:
                    throw new Error("Invalid event type");
            }
        });

        const listElement = document.createElement("div");
        listElement.id = $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID;
        document.body.appendChild(listElement);

        listElement.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case "wheel":
                    expect(type).toBe("wheel");
                    return;
                    
                default:
                    throw new Error("Invalid event type");
            }
        });
        
        execute();

        scrollBarElement.remove();
        listElement.remove();
    });
});