import { execute } from "./ScriptEditorModalInitializeRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $SCRIPT_EDITOR_HIDE_ICON_ID,
    $SCRIPT_EDITOR_BAR_ID
} from "../../../../config/ScriptEditorModalConfig";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ScriptEditorModalInitializeRegisterEventUseCase Test", () =>
{
    it("execute test case1", async () =>
    {
        const div = document.createElement("div");
        div.id = $SCRIPT_EDITOR_HIDE_ICON_ID;

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (EventType.POINTER_DOWN === type) {
                pointerDown = true;
            } else {
                throw new Error("Invalid Event Type");
            }
        });
        document.body.appendChild(div);

        expect(pointerDown).toBe(false);
        execute();
    
        expect(pointerDown).toBe(true);

        div.remove();
    });

    it("execute test case2", async () =>
    {
        const div = document.createElement("div");
        div.id = $SCRIPT_EDITOR_BAR_ID;
    
        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (EventType.POINTER_DOWN === type) {
                pointerDown = true;
            } else {
                throw new Error("Invalid Event Type");
            }
        });
        document.body.appendChild(div);

        expect(pointerDown).toBe(false);
        execute();
    
        expect(pointerDown).toBe(true);

        div.remove();
    });
});