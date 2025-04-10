import { execute } from "./ObjectSettingNameFocusOutEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("ObjectSettingNameFocusOutEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        
        let stopPropagation = false;
        const mockEvent = {
            "target": document.createElement("input"),
            "stopPropagation": vi.fn(() => { stopPropagation = true })
        } as unknown as FocusEvent;

        expect(stopPropagation).toBe(false);
        execute(mockEvent);
        expect(stopPropagation).toBe(true);
    });
});