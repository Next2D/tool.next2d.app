import { execute } from "./ExternalWorkSpaceRegisterInstanceService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../../core/application/CoreUtil";
import { Folder } from "../../../../../core/domain/model/Folder";

describe("ExternalWorkSpaceRegisterInstanceServiceTest", () =>
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

        expect(workSpace.libraries.size).toBe(1);
        expect(workSpace.pathMap.size).toBe(1);

        execute(workSpace, folder);

        expect(workSpace.libraries.size).toBe(2);
        expect(workSpace.pathMap.size).toBe(2);

        expect(workSpace.libraries.get(1)).toBe(folder);
    });
});