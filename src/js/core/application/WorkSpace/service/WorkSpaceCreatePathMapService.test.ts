import { execute } from "./WorkSpaceCreatePathMapService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { Folder } from "../../../../core/domain/model/Folder";
import { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("WorkSpaceCreatePathMapServiceTest", () =>
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

        expect(workSpace.libraries.size).toBe(3);
        execute(workSpace);

        const names = [
            "main",
            "Folder_1",
            "Folder_1/MovieClip_2"
        ];

        let idx = 0;
        for (const [name, id] of workSpace.pathMap) {
            const instance = workSpace.getLibrary(id);
            expect(instance.id).toBe(id);
            expect(names[idx++]).toBe(name);
        }
    });
});