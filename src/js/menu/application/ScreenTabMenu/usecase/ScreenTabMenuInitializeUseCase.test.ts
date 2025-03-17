import { execute } from "./ScreenTabMenuInitializeUseCase";
import { describe, expect, it, vi } from "vitest";
import { $SCREEN_TAB_LIST_ID } from "../../../../config/ScreenConfig";
import { EventType } from "../../../../tool/domain/event/EventType";
import type { ScreenTabMenu } from "../../../../menu/domain/model/ScreenTabMenu";
import { $SCREEN_TAB_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";

describe("ScreenTabMenuInitializeUseCase Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $SCREEN_TAB_LIST_ID;

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                pointerDown = true;
            } else {
                throw new Error("Unexpected event type");
            }
        });

        const mockMenu = {
            "name": $SCREEN_TAB_MENU_NAME,
            "offsetLeft": 0,
            "offsetTop": 0
        } as unknown as ScreenTabMenu;
        $registerMenu(mockMenu);

        expect(mockMenu.offsetTop).toBe(0);
        expect(pointerDown).toBe(false);

        execute();

        expect(mockMenu.offsetTop).toBe(25);
        expect(pointerDown).toBe(true);

        div.remove();
    });
});