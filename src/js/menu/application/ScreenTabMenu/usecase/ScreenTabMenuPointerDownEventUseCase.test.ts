import { execute } from "./ScreenTabMenuPointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import type { ScreenTabMenu } from "../../../../menu/domain/model/ScreenTabMenu";
import { $SCREEN_TAB_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";

describe("ScreenTabMenuPointerDownEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const mockMenu = {
            "name": $SCREEN_TAB_MENU_NAME,
            "state": "hide",
            "show": vi.fn(() => mockMenu.state = "show"),
            "hide": vi.fn(() => mockMenu.state = "hide")
        } as unknown as ScreenTabMenu;
        $registerMenu(mockMenu);

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(mockMenu.state).toBe("hide");

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(mockMenu.state).toBe("show");

        execute(mockEvent);
        expect(mockMenu.state).toBe("hide");
    });
});