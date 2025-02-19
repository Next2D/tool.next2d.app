import { execute } from "./LibraryAreaScrollInitializeRegisterEventUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import {
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_LIST_BOX_SCROLL_BAR_ID
} from "../../../../config/LibraryConfig";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaScrollInitializeRegisterEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const scrollBarElement = document.createElement("div");
        scrollBarElement.id = $LIBRARY_LIST_BOX_SCROLL_BAR_ID;
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
        listElement.id = $LIBRARY_LIST_BOX_ID;
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