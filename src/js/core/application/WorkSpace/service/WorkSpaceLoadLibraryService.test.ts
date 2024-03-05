import { execute } from "./WorkSpaceLoadLibraryService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { Folder } from "../../../../core/domain/model/Folder";
import { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("WorkSpaceLoadLibraryServiceTest", () =>
{
    test("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const folder = new Folder({
            "id": 1,
            "type": "folder",
            "name": "Folder_1",
            "mode": "close"
        });

        const movieClip = new MovieClip({
            "id": 2,
            "type": "container",
            "name": "MovieClip_2",
            "folderId": 1
        });

        const libraries = [];
        libraries.push(folder.toObject());
        libraries.push(movieClip.toObject());

        expect(workSpace.libraries.size).toBe(1);
        await execute(workSpace, libraries);

        expect(workSpace.libraries.size).toBe(3);

        const instance1 = workSpace.getLibrary(1);
        expect(instance1.name).toBe("Folder_1");

        const instance2 = workSpace.getLibrary(2);
        expect(instance2.name).toBe("MovieClip_2");
    });
});