import { execute } from "./StageSettingWidthFocusOutEventService";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("StageSettingWidthFocusOutEventService Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const stage = workSpace.stage;
        stage.width = 60;

        const input = document.createElement("input");
        input.value = "10";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true),
            "target": input
        } as unknown as FocusEvent;

        expect(stage.width).toBe(60);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        await execute(mockEvent);

        expect(stage.width).toBe(10);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});