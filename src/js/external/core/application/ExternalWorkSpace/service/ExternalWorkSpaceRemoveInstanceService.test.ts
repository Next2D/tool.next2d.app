import { execute } from "./ExternalWorkSpaceRemoveInstanceService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../../core/application/CoreUtil";
import { Folder } from "../../../../../core/domain/model/Folder";

describe("ExternalWorkSpaceRemoveInstanceServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const folder = new Folder({
            "id": 1,
            "type": "folder",
            "name": "Folder_1",
            "mode": "close"
        });
        workSpace.libraries.set(1, folder);
        workSpace.pathMap.set("Folder_1", 1);

        expect(workSpace.libraries.size).toBe(2);
        expect(workSpace.pathMap.size).toBe(2);

        execute(workSpace, folder);

        expect(workSpace.libraries.size).toBe(1);
        expect(workSpace.pathMap.size).toBe(1);
    });
});