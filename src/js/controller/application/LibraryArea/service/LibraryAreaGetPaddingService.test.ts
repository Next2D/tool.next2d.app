import { execute } from "./LibraryAreaGetPaddingService";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Folder } from "../../../../core/domain/model/Folder";
import { Bitmap } from "../../../../core/domain/model/Bitmap";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("LibraryAreaGetPaddingServiceTest", () =>
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

        const bitmap1 = new Bitmap({
            "id": 2,
            "type": "bitmap",
            "name": "Bitmap_1",
            "folderId": 1
        });
        workSpace.libraries.set(bitmap1.id, bitmap1);
        workSpace.pathMap.set(bitmap1.getPath(workSpace), bitmap1.id);

        const bitmap2 = new Bitmap({
            "id": 2,
            "type": "bitmap",
            "name": "Bitmap_2",
            "folderId": 0
        });
        workSpace.libraries.set(bitmap2.id, bitmap2);
        workSpace.pathMap.set(bitmap2.getPath(workSpace), bitmap2.id);

        expect(execute(bitmap2)).toBe(0);
        expect(execute(bitmap1)).toBe(20);
    });
});