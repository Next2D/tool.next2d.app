import { execute } from "./StageSettingFpsFocusOutEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("StageSettingFpsFocusOutEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const stage = workSpace.stage;
        stage.fps = 60;

        const input = document.createElement("input");
        input.value = "10";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true),
            "target": input
        } as unknown as FocusEvent;

        expect(stage.fps).toBe(60);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        await execute(mockEvent);

        expect(stage.fps).toBe(10);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});