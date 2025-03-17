import { execute } from "./ScreenMenuHideSubMenuService";
import { $registerMenu } from "../../MenuUtil";
import { $SCREEN_MENU_NAME } from "../../../../config/MenuConfig";
import { describe, expect, it, vi } from "vitest";

describe("ScreenMenuHideSubMenuServiceTest", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true),
        } as unknown as PointerEvent;

        let screenState = "show";
        const screenMenuMock = {
            "name": $SCREEN_MENU_NAME,
            "hide": () =>
            {
                screenState = "hide";
            }
        };
        $registerMenu(screenMenuMock);

        let testState = "show";
        const testMockMenu = {
            "name": "test",
            "hide": vi.fn(() => testState = "hide")
        };
        $registerMenu(testMockMenu);
        
        expect(testState).toBe("show");
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        expect(screenState).toBe("show");
        execute(mockEvent);
        expect(screenState).toBe("show");

        expect(testState).toBe("hide");
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});