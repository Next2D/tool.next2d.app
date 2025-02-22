import { execute } from "./ScreenTabKeyPressEventService";
import { $setEditingElement, $getEditingElement } from "../../../../global/GlobalUtil";
import { describe, expect, it, vi } from "vitest";

describe("ScreenTabKeyPressEventServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.blur = vi.fn(() => { blur = "on" });
        $setEditingElement(div);

        let prevent = true;
        let state = "on";
        let blur = "off";
        const eventMock = {
            "key": "Enter",
            "currentTarget": div,
            "stopPropagation": vi.fn(() =>
            {
                state = "off";
            }),
            "preventDefault": vi.fn(() =>
            {
                prevent = false;
            })
        } as unknown as KeyboardEvent;

        expect(prevent).toBe(true);
        expect(state).toBe("on");
        expect(blur).toBe("off");
        
        execute(eventMock);

        expect(prevent).toBe(false);
        expect(state).toBe("off");
        expect(blur).toBe("on");
        expect($getEditingElement()).toBeNull();
    });
});