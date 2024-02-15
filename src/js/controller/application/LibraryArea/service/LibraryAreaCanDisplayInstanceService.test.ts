import { execute } from "./LibraryAreaArrowIconMouseDownEventService";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Folder } from "../../../../core/domain/model/Folder";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("LibraryAreaArrowIconMouseDownEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const folder = new Folder({
            "id": 1,
            "type": "folder",
            "name": "Folder_1",
            "mode": "close"
        });
        workSpace.libraries.set(folder.id, folder);
        workSpace.pathMap.set(folder.getPath(workSpace), folder.id);

        const div = document.createElement("div");
        div.dataset.libraryId = "1";

        const eventMock = {
            "button": 0,
            "currentTarget": div
        };

        expect(folder.mode).toBe("close");
        execute(eventMock);
        expect(folder.mode).toBe("open");
    });
});