import { execute } from "./TimelineSceneListExcludeElememtService";
import { $TIMELINE_SCENE_NAME_LIST_ID } from "../../../../config/TimelineConfig";
import { timelineSceneList } from "../../../domain/model/TimelineSceneList";

describe("TimelineSceneListExcludeElememtServiceTest", () =>
{
    test("execute test", () =>
    {
        timelineSceneList.parents.push(
            {
                "libraryId": 0,
                "matrix": [1,0,0,1,0,0]
            },
            {
                "libraryId": 10,
                "matrix": [1,0,0,1,0,0]
            },
            {
                "libraryId": 5,
                "matrix": [1,0,0,1,0,0]
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