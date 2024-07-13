import { execute } from "./TimelineSceneListExcludeElememtService";
import { $TIMELINE_SCENE_NAME_LIST_ID } from "../../../../config/TimelineConfig";
import { timelineSceneList } from "../../../domain/model/TimelineSceneList";

describe("TimelineSceneListExcludeElememtServiceTest", () =>
{
    test("execute test", () =>
    {
        timelineSceneList.parents.push(
            {
                "parentLibraryId": 0,
                "selectCharacter": null
            },
            {
                "parentLibraryId": 10,
                "selectCharacter": null
            },
            {
                "parentLibraryId": 5,
                "selectCharacter": null
            },
        );
        expect(timelineSceneList.parents.length).toBe(3);

        const parent = document.createElement("div");
        parent.id = $TIMELINE_SCENE_NAME_LIST_ID;
        document.body.appendChild(parent);

        parent.appendChild(document.createElement("div"));
        parent.appendChild(document.createElement("div"));
        parent.appendChild(document.createElement("div"));
        expect(parent.children.length).toBe(3);

        execute(10);
        expect(timelineSceneList.parents.length).toBe(1);
        expect(parent.children.length).toBe(1);

        parent.remove();
    });
});