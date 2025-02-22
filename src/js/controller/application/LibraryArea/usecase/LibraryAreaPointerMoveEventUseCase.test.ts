import { execute } from "./LibraryAreaPointerMoveEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $getMoveState } from "../LibraryAreaUtil";

describe("LibraryAreaPointerMoveEventUseCase Test", () =>
{
    it("execute test case1", async () =>
    {
        const div = document.createElement("div");

        let preventDefault = false;
        let stopPropagation = false;
        const mockEvent = {
            "currentTarget": div,
            "preventDefault": vi.fn(() => { preventDefault = true; }),
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "clientX": 10,
            "clientY": 20
        } as unknown as PointerEvent;

        expect($getMoveState()).toBe(false);
        expect(div.style.pointerEvents).toBe("");
        expect(div.style.position).toBe("");
        expect(div.style.left).toBe("");
        expect(div.style.top).toBe("");
        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);

        execute(mockEvent);

        expect($getMoveState()).toBe(true);
        expect(div.style.pointerEvents).toBe("none");
        expect(div.style.position).toBe("fixed");
        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);

        await new Promise<void>((resolve) =>
        {
            setTimeout(() =>
            {
                expect(div.style.left).toBe("10px");
                expect(div.style.top).toBe("20px");
                resolve();
            }, 30);
        });
    });
});