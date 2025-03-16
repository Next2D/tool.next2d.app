import { execute } from "./LibraryMenuPhotopeaPointerDownService";
import { describe, expect, it, vi } from "vitest";
import { libraryArea } from "../../../../controller/domain/model/LibraryArea";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("LibraryMenuPhotopeaPointerDownService Test", () =>
{
    it("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        libraryArea.selectedIds.length = 1;
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        
        execute(mockEvent);

        libraryArea.selectedIds.length = 0;
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});