import { execute } from "./ScriptAreaScrollPointerMoveUseCase";
import { $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID } from "../../../../config/ControllerScriptAreaConfig";
import { describe, expect, it } from "vitest";

describe("ScriptAreaScrollPointerMoveUseCase Test", () =>
{
    it("test case", async () =>
    {
        const div = document.createElement("div");
        div.id = $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID;
        document.body.appendChild(div);

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "movementY": 10,
            "target": document.createElement("div") as unknown,
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            }
        } as PointerEvent;

        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);
        expect(div.scrollTop).toBe(0);

        execute(mockEvent);

        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);

        await new Promise<void>((resolve) =>
        {
            setTimeout(() =>
            {
                expect(div.scrollTop).toBe(10);
                resolve();
            }, 30);
        });
        
        div.remove();
    });
});