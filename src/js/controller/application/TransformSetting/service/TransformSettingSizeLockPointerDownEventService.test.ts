import { execute } from "./TransformSettingSizeLockPointerDownEventService";
import { describe, expect, it, vi } from "vitest";
import { transformSetting } from "../../../domain/model/TransformSetting";

describe("TransformSettingSizeLockPointerDownEventService Test", () =>
{
    it("execute test", async () =>
    {
        const parent = document.createElement("div");
        const div = document.createElement("div");
        div.classList.add("disable");
        parent.appendChild(div);

        let stopPropagation = false;
        const mockEvent = {
            "button": 0,
            "currentTarget": parent,
            "stopPropagation": vi.fn(() => stopPropagation = true),
        } as unknown as PointerEvent;

        transformSetting.sizeLocked = false;
        expect(div.classList.contains("disable")).toBe(true);
        expect(transformSetting.sizeLocked).toBe(false);
        expect(stopPropagation).toBe(false);

        execute(mockEvent);

        expect(div.classList.contains("active")).toBe(true);
        expect(transformSetting.sizeLocked).toBe(true);
        expect(stopPropagation).toBe(true);

        execute(mockEvent);
        expect(div.classList.contains("disable")).toBe(true);
    });
});