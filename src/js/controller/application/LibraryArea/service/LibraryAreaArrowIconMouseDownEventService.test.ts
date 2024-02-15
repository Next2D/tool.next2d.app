import { execute } from "./LibraryAreaCanDisplayInstanceService";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Folder } from "../../../../core/domain/model/Folder";
import { Bitmap } from "../../../../core/domain/model/Bitmap";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("LibraryAreaCanDisplayInstanceServiceTest", () =>
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
            "name": "Bitmap_2",
            "folderId": 1
        });
        workSpace.libraries.set(bitmap1.id, bitmap1);
        workSpace.pathMap.set(bitmap1.getPath(workSpace), bitmap1.id);

        const bitmap2 = new Bitmap({
            "id": 3,
            "type": "bitmap",
            "name": "Bitmap_3",
            "folderId": 0
        });
        workSpace.libraries.set(bitmap2.id, bitmap2);
        workSpace.pathMap.set(bitmap2.getPath(workSpace), bitmap2.id);

        expect(execute(bitmap1)).toBe(false);
        expect(execute(bitmap2)).toBe(true);
    });
});