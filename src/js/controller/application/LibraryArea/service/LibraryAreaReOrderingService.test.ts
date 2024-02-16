import { execute } from "./LibraryAreaReOrderingService";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Folder } from "../../../../core/domain/model/Folder";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("LibraryAreaReOrderingServiceTest", () =>
{
    test("execute test case1", () =>
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

        workSpace.libraries.clear();
        workSpace.libraries.set(workSpace.root.id, workSpace.root);
        workSpace.libraries.set(movieClip.id, movieClip);
        workSpace.libraries.set(folder.id, folder);

        let libraryKeys = workSpace.libraries.keys();
        expect(libraryKeys.next().value).toBe(0);
        expect(libraryKeys.next().value).toBe(movieClip.id);
        expect(libraryKeys.next().value).toBe(folder.id);

        workSpace.pathMap.clear();
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

    test("execute test case2", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const folder1 = new Folder({
            "id": 1,
            "type": "folder",
            "name": "Folder_1",
            "mode": "close"
        });

        const folder2 = new Folder({
            "id": 2,
            "type": "folder",
            "name": "Folder_1",
            "mode": "close",
            "folderId": 1
        });

        const folder3 = new Folder({
            "id": 3,
            "type": "folder",
            "name": "Folder_1",
            "mode": "close",
            "folderId": 2
        });

        const movieClip = new MovieClip({
            "id": 4,
            "type": "container",
            "name": "MovieClip_2",
            "folderId": 3
        });

        workSpace.libraries.clear();
        workSpace.libraries.set(workSpace.root.id, workSpace.root);
        workSpace.libraries.set(movieClip.id, movieClip);
        workSpace.libraries.set(folder1.id, folder1);
        workSpace.libraries.set(folder2.id, folder2);
        workSpace.libraries.set(folder3.id, folder3);

        let libraryKeys = workSpace.libraries.keys();
        expect(libraryKeys.next().value).toBe(0);
        expect(libraryKeys.next().value).toBe(movieClip.id);
        expect(libraryKeys.next().value).toBe(folder1.id);
        expect(libraryKeys.next().value).toBe(folder2.id);
        expect(libraryKeys.next().value).toBe(folder3.id);

        workSpace.pathMap.clear();
        workSpace.pathMap.set(workSpace.root.getPath(workSpace), workSpace.root.id);
        workSpace.pathMap.set(movieClip.getPath(workSpace), movieClip.id);
        workSpace.pathMap.set(folder1.getPath(workSpace), folder1.id);
        workSpace.pathMap.set(folder2.getPath(workSpace), folder2.id);
        workSpace.pathMap.set(folder3.getPath(workSpace), folder3.id);

        let pathMapKeys = workSpace.pathMap.keys();
        expect(pathMapKeys.next().value).toBe(workSpace.root.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(movieClip.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(folder1.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(folder2.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(folder3.getPath(workSpace));

        execute(workSpace);

        libraryKeys = workSpace.libraries.keys();
        expect(libraryKeys.next().value).toBe(folder1.id);
        expect(libraryKeys.next().value).toBe(folder2.id);
        expect(libraryKeys.next().value).toBe(folder3.id);
        expect(libraryKeys.next().value).toBe(movieClip.id);
        expect(libraryKeys.next().value).toBe(0);

        pathMapKeys = workSpace.pathMap.keys();
        expect(pathMapKeys.next().value).toBe(folder1.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(folder2.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(folder3.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(movieClip.getPath(workSpace));
        expect(pathMapKeys.next().value).toBe(workSpace.root.getPath(workSpace));
    });
});