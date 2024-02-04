import { execute } from "./LibraryAreaReOrderingService";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Folder } from "../../../../core/domain/model/Folder";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("LibraryAreaReOrderingServiceTest", () =>
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

        const movieClip = new MovieClip({
            "id": 2,
            "type": "container",
            "name": "MovieClip_2",
            "folderId": 1
        });

        workSpace.libraries.set(movieClip.id, movieClip);
        workSpace.libraries.set(folder.id, folder);

        let libraryKeys = workSpace.libraries.keys();
        expect(libraryKeys.next().value).toBe(0);
        expect(libraryKeys.next().value).toBe(movieClip.id);
        expect(libraryKeys.next().value).toBe(folder.id);

        workSpace.pathMap.set(workSpace.root.getPath(workSpace), workSpace.root.id);
        workSpace.pathMap.set(movieClip.getPath(workSpace), movieClip.id);
        workSpace.pathMap.set(folder.getPath(workSpace), folder.id);

        let pathMapKeys = workSpace.pathMap.keys();
        expect(pathMapKeys.next().value).toBe(workSpace.root.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(movieClip.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(folder.getPath(workSpace));

        execute(workSpace);

        libraryKeys = workSpace.libraries.keys();
        expect(libraryKeys.next().value).toBe(folder.id);
        expect(libraryKeys.next().value).toBe(movieClip.id);
        expect(libraryKeys.next().value).toBe(0);

        pathMapKeys = workSpace.pathMap.keys();
        expect(pathMapKeys.next().value).toBe(folder.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(movieClip.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(workSpace.root.getPath(workSpace));
    });
});