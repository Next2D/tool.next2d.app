import { execute } from "./LibraryAreaInitializeRegisterEventUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import {
    $LIBRARY_LIST_BOX_SCROLL_BAR_ID,
    $LIBRARY_LIST_BOX_ID
} from "../../../../config/LibraryConfig";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaInitializeRegisterEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const scrollBarElement = document.createElement("div");
        scrollBarElement.id = $LIBRARY_LIST_BOX_SCROLL_BAR_ID;
        scrollBarElement.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    expect(type).toBe(EventType.POINTER_DOWN);
                    break;

                default:
                    throw new Error("Not found event type");

            }
        });
        document.body.appendChild(scrollBarElement);

        const listBoxElement = document.createElement("div");
        listBoxElement.id = $LIBRARY_LIST_BOX_ID;
        listBoxElement.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case "wheel":
                    expect(type).toBe("wheel");
                    break;

                case EventType.POINTER_DOWN:
                    expect(type).toBe(EventType.POINTER_DOWN);
                    break;

                case "dragover":
                    expect(type).toBe("dragover");
                    break;

                case "drop":
                    expect(type).toBe("drop");
                    break;

                case EventType.POINTER_OVER:
                    expect(type).toBe(EventType.POINTER_OVER);
                    break;

                case EventType.POINTER_OUT:
                    expect(type).toBe(EventType.POINTER_OUT);
                    break;

                case EventType.POINTER_LEAVE:
                    expect(type).toBe(EventType.POINTER_LEAVE);
                    break;

                default:
                    throw new Error("Not found event type");

            }
        });
        document.body.appendChild(listBoxElement);

        execute();

        document.body.removeChild(scrollBarElement);
        document.body.removeChild(listBoxElement);
    });
});