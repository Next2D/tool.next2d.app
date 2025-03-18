import { execute } from "./ScriptEditorModalPointerMoveService";
import { describe, expect, it, vi } from "vitest";

describe("ScriptEditorModalPointerMoveService Test", () =>
{
    it("execute test", async () =>
    {
        const parent = document.createElement("div");
        parent.style.left = "0px";
        parent.style.top  = "0px";

        const element = document.createElement("div");
        parent.appendChild(element);

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true),
            "target": element,
            "movementX": 10,
            "movementY": 20
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(parent.style.left).toBe("0px");
        expect(parent.style.top).toBe("0px");

        execute(mockEvent);
        
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);

        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(parent.style.left).toBe("10px");
        expect(parent.style.top).toBe("20px");
    });
});