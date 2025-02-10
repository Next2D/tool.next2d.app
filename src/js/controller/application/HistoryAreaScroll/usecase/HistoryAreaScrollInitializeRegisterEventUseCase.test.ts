import { execute } from "./HistoryAreaScrollInitializeRegisterEventUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import {
    $HISTORY_LIST_PARENT_ID,
    $HISTORY_LIST_SCROLL_BAR_ID
} from "../../../../config/HistoryConfig";
import { describe, expect, it, vi } from "vitest";

describe("HistoryAreaScrollInitializeRegisterEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const scrollBarElement = document.createElement("div");
        
        scrollBarElement.id = $HISTORY_LIST_SCROLL_BAR_ID;

        let scrollBarElementState = "none";
        scrollBarElement.addEventListener = vi.fn((name) =>
        {
            scrollBarElementState = name;
        });

        const parentElement = document.createElement("div");

        let parentElementState = "none";
        parentElement.addEventListener = vi.fn((name) =>
        {
            parentElementState = name;
        });
        parentElement.id = $HISTORY_LIST_PARENT_ID;

        document.body.appendChild(scrollBarElement);
        document.body.appendChild(parentElement);

        expect(scrollBarElementState).toBe("none");
        expect(parentElementState).toBe("none");

        execute();

        expect(scrollBarElementState).toBe(EventType.POINTER_DOWN);
        expect(parentElementState).toBe("wheel");

        scrollBarElement.remove();
        parentElement.remove();
    });
});