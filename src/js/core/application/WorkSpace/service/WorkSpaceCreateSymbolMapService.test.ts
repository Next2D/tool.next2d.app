import { execute } from "./WorkSpaceCreateSymbolMapService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { Folder } from "../../../../core/domain/model/Folder";
import { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("WorkSpaceCreateSymbolMapServiceTest", () =>
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
            "symbol": "app.next2d.MovieClip",
            "folderId": 1
        });
        workSpace.libraries.set(movieClip.id, movieClip);

        expect(workSpace.symbolMap.size).toBe(0);
        expect(workSpace.libraries.size).toBe(3);
        execute(workSpace);
        expect(workSpace.symbolMap.size).toBe(1);
        expect(workSpace.symbolMap.keys().next().value).toBe("app.next2d.MovieClip");
    });
});