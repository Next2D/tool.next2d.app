import { execute } from "./LibraryAreaArrowIconPointerDownEventService";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Folder } from "../../../../core/domain/model/Folder";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaArrowIconPointerDownEventService Test", () =>
{
    it("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const folder = new Folder({
            "id": 1,
            "type": "folder",
            "name": "Folder_1",
            "mode": "open"
        });
        workSpace.libraries.set(folder.id, folder);
        workSpace.pathMap.set(folder.getPath(workSpace), folder.id);

        const div = document.createElement("div");
        div.dataset.libraryId = "1";

        let stopPropagation = false;
        const mockEvent = {
            "button": 0,
            "currentTarget": div,
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            })
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(folder.mode).toBe("open");

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(folder.mode).toBe("close");
    });
});