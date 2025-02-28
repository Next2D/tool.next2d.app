import { execute } from "./StageSettingColorChangeEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("StageSettingColorChangeEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const stage = workSpace.stage;
        stage.bgColor = "#000000";

        const input = document.createElement("input");
        input.value = "#ff00ff";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true),
            "target": input
        } as unknown as Event;

        expect(stage.bgColor).toBe("#000000");
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        await execute(mockEvent);

        expect(stage.bgColor).toBe("#ff00ff");
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});