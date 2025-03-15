import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import type { IInstanceSaveObject } from "../../../../interface/IInstanceSaveObject";
import { execute } from "./WorkSpaceLoadLibraryService";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { Folder } from "../../../../core/domain/model/Folder";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it } from "vitest";

describe("WorkSpaceLoadLibraryServiceTest", () =>
{
    it("execute test", async () =>
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

        const libraries: IInstanceSaveObject[] = [];
        libraries.push(folder.toObject());
        libraries.push(movieClip.toObject());

        expect(workSpace.libraries.size).toBe(1);
        await execute(workSpace, libraries);

        expect(workSpace.libraries.size).toBe(3);

        const instance1 = workSpace.getLibrary(1) as Folder;
        expect(instance1.name).toBe("Folder_1");

        const instance2 = workSpace.getLibrary(2) as MovieClip;
        expect(instance2.name).toBe("MovieClip_2");
    });
});