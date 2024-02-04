import { execute } from "./InstanceGetPathNameService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { Folder } from "../../../../core/domain/model/Folder";
import { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("InstanceGetPathNameServiceTest", () =>
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

        const movieClip = new MovieClip({
            "id": 2,
            "type": "container",
            "name": "MovieClip_2",
            "folderId": 1
        });
        workSpace.libraries.set(movieClip.id, movieClip);

        expect(execute(workSpace, movieClip)).toBe("Folder_1/MovieClip_2");
    });

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
            "name": "Folder_2",
            "mode": "close",
            "folderId": 1
        });
        workSpace.libraries.set(folder2.id, folder2);

        const movieClip = new MovieClip({
            "id": 3,
            "type": "container",
            "name": "MovieClip_3",
            "folderId": 2
        });
        workSpace.libraries.set(movieClip.id, movieClip);

        expect(execute(workSpace, movieClip)).toBe("Folder_1/Folder_2/MovieClip_3");
    });
});