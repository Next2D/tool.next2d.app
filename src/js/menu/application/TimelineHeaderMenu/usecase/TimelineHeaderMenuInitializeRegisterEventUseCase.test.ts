import { execute } from "./TimelineHeaderMenuInitializeRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $TIMELINE_CONTROLLER_BASE_ID,
    $TIMELINE_HEADER_MENU_SCRIPT_ADD_ONE_ID
} from "../../../../config/TimelineConfig";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("TimelineHeaderMenuInitializeRegisterEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const div = document.createElement("div");
        div.id = $TIMELINE_CONTROLLER_BASE_ID;
        document.body.appendChild(div);

        let contextmenu = false;
        div.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case "contextmenu":
                    contextmenu = true;
                    return ;

                default:
                    throw new Error("Invalid event type");
            }
        });

        expect(contextmenu).toBe(false);
        execute();
        expect(contextmenu).toBe(true);

        div.remove();
    });

    it("execute test case2", () =>
    {
        const div = document.createElement("div");
        div.id = $TIMELINE_HEADER_MENU_SCRIPT_ADD_ONE_ID;
        document.body.appendChild(div);

        let pointerdown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                pointerdown = true;
            } else {
                throw new Error("Invalid event type");
            }
        });
    
        expect(pointerdown).toBe(false);
        execute();        
        expect(pointerdown).toBe(true);

        div.remove();
    });
});