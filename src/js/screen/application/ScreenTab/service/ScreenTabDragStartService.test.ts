import { $registerMenu } from "../../../../menu/application/MenuUtil";
import { $getDragElement } from "../../ScreenUtil";
import { execute } from "./ScreenTabDragStartService";
import { describe, expect, it, vi } from "vitest";

describe("ScreenTabDragStartServiceTest", () =>
{
    it("execute test", () =>
    {
        let state = "show";
        const mockMenu = {
            "name": "test",
            "hide": vi.fn(() =>
            {
                state = "hide";
            })
        };
        $registerMenu(mockMenu);

        const div = document.createElement("div");
        const mockEvent = {
            "button": 0,
            "target": div
        } as unknown as DragEvent;

        expect($getDragElement()).toBe(null);
        expect(state).toBe("show");

        execute(mockEvent);

        expect($getDragElement()).toBe(div);
        expect(state).toBe("hide");
    });
});