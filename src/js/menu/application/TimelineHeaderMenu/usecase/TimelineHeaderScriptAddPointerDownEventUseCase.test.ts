import { execute } from "./TimelineHeaderScriptAddPointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("TimelineHeaderScriptAddPointerDownEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        let preventDefault = false;
        let stopPropagation = false;
        const eventMock = {
            "button": 0,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);

        execute(eventMock);
        
        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);

    });
});