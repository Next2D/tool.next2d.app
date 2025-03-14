import { execute } from "./StageSettingHeightPointerMoveEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $setCursor } from "../../../../global/GlobalUtil";

describe("StageSettingHeightPointerMoveEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const stage = workSpace.stage;
        stage.height = 400;

        const input = document.createElement("input");
        input.value = "400";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "movementX": 100,
            "target": input,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        const style = document
            .documentElement
            .style;
        $setCursor("auto");
        expect(style.getPropertyValue("--tool-cursor")).toBe("");

        expect(input.value).toBe("400");
        expect(stage.height).toBe(400);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(mockEvent);

        await new Promise((resolve) => setTimeout(resolve, 30));

        expect(style.getPropertyValue("--tool-cursor")).toBe("ew-resize");
        expect(input.value).toBe("500");
        expect(stage.height).toBe(500);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});