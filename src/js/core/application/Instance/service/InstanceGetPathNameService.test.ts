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
});