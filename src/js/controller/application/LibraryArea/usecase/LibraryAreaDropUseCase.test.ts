import { execute } from "./LibraryAreaDropUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("LibraryAreaDropUseCase Test", () =>
{
    it("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        let preventDefault = false;
        let stopPropagation = false;
        const mockEvent = {
            "preventDefault": vi.fn(() => preventDefault = true),
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "dataTransfer": {
                "items": [{
                    "webkitGetAsEntry": vi.fn(() => null)
                }]
            }
        } as unknown as DragEvent;

        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);
        execute(mockEvent);
        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);
    });
});