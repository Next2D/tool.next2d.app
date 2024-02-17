import { execute } from "./ExternalFolderCheckDuplicateService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../../core/application/CoreUtil";
import { MovieClip } from "../../../../../core/domain/model/MovieClip";
import { Folder } from "../../../../../core/domain/model/Folder";
import { WorkSpace } from "../../../../../core/domain/model/WorkSpace";

describe("ExternalFolderCheckDuplicateServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const folder1 = new Folder({
            "id": 1,
            "type": "folder",
            "name": "Folder_1",
            "mode": "close"
        });
        workSpace.libraries.set(folder1.id, folder1);

        const folder2 = new Folder({
            "id": 2,
            "type": "folder",
            "name": "Folder_1",
            "mode": "close",
            "folderId": 1
        });
        workSpace.libraries.set(folder2.id, folder2);

        const movieClip = new MovieClip({
            "id": 3,
            "type": "container",
            "name": "MovieClip_2",
            "folderId": 0
        });
        workSpace.libraries.set(movieClip.id, movieClip);

        expect(execute(workSpace, folder2, 1)).toBe(true);
        expect(execute(workSpace, folder2, 3)).toBe(false);
    });

});