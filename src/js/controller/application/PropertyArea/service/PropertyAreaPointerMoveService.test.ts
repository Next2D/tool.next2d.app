import { execute } from "./PropertyAreaPointerMoveService";
import { describe, expect, it } from "vitest";

describe("PropertyAreaPointerMoveService Test", () =>
{
    it("execute test", async () =>
    {
        let stopPropagation = false;
        let preventDefault = false;

        const div = document.createElement("div");
        div.style.left = "0px";
        div.style.top = "0px";

        const mockEvent = {
            "target": div,
            "stopPropagation": () => { stopPropagation = true },
            "preventDefault": () => { preventDefault = true },
            "movementX": 10,
            "movementY": 20
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(div.style.left).toBe("0px");
        expect(div.style.top).toBe("0px");
        execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);

        await new Promise<void>((resolve) => setTimeout(() =>
        {
            expect(div.style.left).toBe("10px");
            expect(div.style.top).toBe("20px");
            resolve();
        }, 30));
    });
});