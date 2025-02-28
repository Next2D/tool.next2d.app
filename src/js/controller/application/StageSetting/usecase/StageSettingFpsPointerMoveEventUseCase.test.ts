import { execute } from "./StageSettingFpsPointerMoveEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $setCursor } from "../../../../global/GlobalUtil";

describe("StageSettingFpsPointerMoveEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const stage = workSpace.stage;
        stage.fps = 10;

        const input = document.createElement("input");
        input.value = "10";

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

        expect(input.value).toBe("10");
        expect(stage.fps).toBe(10);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(mockEvent);

        await new Promise((resolve) => setTimeout(resolve, 30));

        expect(style.getPropertyValue("--tool-cursor")).toBe("ew-resize");
        expect(input.value).toBe("60");
        expect(stage.fps).toBe(60);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);

        execute({
            "movementX": -100,
            "target": input,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent);

        await new Promise((resolve) => setTimeout(resolve, 30));

        expect(input.value).toBe("1");
        expect(stage.fps).toBe(1);
    });
});