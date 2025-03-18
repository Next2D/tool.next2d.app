import { execute } from "./ShortcutSettingMenuInitializeRegisterEventUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import { describe, expect, it, vi } from "vitest";
import {
    $SHORTCUT_SETTING_CLOSE_ID,
    $SHORTCUT_SETTING_LIBRARY_ID,
    $SHORTCUT_SETTING_SCREEN_ID,
    $SHORTCUT_SETTING_TIMELINE_ID,
    $SHORTCUT_SETTING_SAVE_ID,
    $SHORTCUT_SETTING_RESET_ID
} from "../../../../config/ShortcutConfig";

describe("ShortcutSettingMenuInitializeRegisterEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const div = document.createElement("div");
        div.id = $SHORTCUT_SETTING_SAVE_ID;

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (EventType.POINTER_DOWN === type) {
                pointerDown = true;
            } else {
                throw new Error("Not supported event type");
            }
        });
        document.body.appendChild(div);

        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        div.remove();
    });

    it("execute test case2", () =>
    {
        const div = document.createElement("div");
        div.id = $SHORTCUT_SETTING_RESET_ID;

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (EventType.POINTER_DOWN === type) {
                pointerDown = true;
            } else {
                throw new Error("Not supported event type");
            }
        });
        document.body.appendChild(div);

        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        div.remove();
    });

    it("execute test case3", () =>
    {
        const div = document.createElement("div");
        div.id = $SHORTCUT_SETTING_CLOSE_ID;

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (EventType.POINTER_DOWN === type) {
                pointerDown = true;
            } else {
                throw new Error("Not supported event type");
            }
        });
        document.body.appendChild(div);

        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        div.remove();
    });

    it("execute test case4", () =>
    {
        const div = document.createElement("div");
        div.id = $SHORTCUT_SETTING_SCREEN_ID;

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (EventType.POINTER_DOWN === type) {
                pointerDown = true;
            } else {
                throw new Error("Not supported event type");
            }
        });
        document.body.appendChild(div);

        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        div.remove();
    });

    it("execute test case5", () =>
    {
        const div = document.createElement("div");
        div.id = $SHORTCUT_SETTING_TIMELINE_ID;

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (EventType.POINTER_DOWN === type) {
                pointerDown = true;
            } else {
                throw new Error("Not supported event type");
            }
        });
        document.body.appendChild(div);

        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        div.remove();
    });

    it("execute test case6", () =>
    {
        const div = document.createElement("div");
        div.id = $SHORTCUT_SETTING_LIBRARY_ID;

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (EventType.POINTER_DOWN === type) {
                pointerDown = true;
            } else {
                throw new Error("Not supported event type");
            }
        });
        document.body.appendChild(div);

        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        div.remove();
    });
});