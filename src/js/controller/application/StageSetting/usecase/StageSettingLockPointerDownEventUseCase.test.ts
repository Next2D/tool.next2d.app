import { execute } from "./StageSettingLockPointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { stageSetting } from "../../../../controller/domain/model/StageSetting";

describe("StageSettingLockPointerDownEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const div = document.createElement("div");
        const span = document.createElement("span");
        span.classList.add("disable");
        div.appendChild(span);

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "currentTarget": div,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        expect(span.classList.contains("disable")).toBe(true);
        expect(stageSetting.lock).toBe(false);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(mockEvent);

        expect(span.classList.contains("active")).toBe(true);
        expect(stageSetting.lock).toBe(true);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);

        execute(mockEvent);
        expect(span.classList.contains("disable")).toBe(true);
    });
});