import { execute } from "./StageSettingKeyPressEventService";
import { describe, expect, it, vi } from "vitest";

describe("StageSettingKeyPressEventServiceTest", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "key": "Enter",
            "currentTarget": document.createElement("div")
        } as unknown as KeyboardEvent;

        expect(stopPropagation).toBe(false);
        execute(eventMock);
        expect(stopPropagation).toBe(true);
    });
});