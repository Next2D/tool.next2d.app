import { execute } from "./TimelineSceneListExcludeElememtService";
import { $TIMELINE_SCENE_NAME_LIST_ID } from "../../../../config/TimelineConfig";
import { timelineSceneList } from "../../../domain/model/TimelineSceneList";

describe("TimelineSceneListExcludeElememtServiceTest", () =>
{
    test("execute test", () =>
    {
        timelineSceneList.scenes.push(0,10,5);
        expect(timelineSceneList.scenes.length).toBe(3);

        const parent = document.createElement("div");
        parent.id = $TIMELINE_SCENE_NAME_LIST_ID;
        document.body.appendChild(parent);

        parent.appendChild(document.createElement("div"));
        parent.appendChild(document.createElement("div"));
        parent.appendChild(document.createElement("div"));
        expect(parent.children.length).toBe(3);

        execute(10);
        expect(timelineSceneList.scenes.length).toBe(1);
        expect(parent.children.length).toBe(1);

        parent.remove();
    });
});