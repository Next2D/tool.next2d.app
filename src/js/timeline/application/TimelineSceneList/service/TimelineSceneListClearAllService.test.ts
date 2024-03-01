import { execute } from "./TimelineSceneListClearAllService";
import { $TIMELINE_SCENE_NAME_LIST_ID } from "../../../../config/TimelineConfig";
import { timelineSceneList } from "../../../domain/model/TimelineSceneList";

describe("TimelineSceneListClearAllServiceTest", () =>
{
    test("execute test", () =>
    {
        timelineSceneList.scenes.push(0);
        expect(timelineSceneList.scenes.length).toBe(1);

        const parent = document.createElement("div");
        parent.id = $TIMELINE_SCENE_NAME_LIST_ID;
        document.body.appendChild(parent);

        const div = document.createElement("div");
        parent.appendChild(div);
        expect(parent.children.length).toBe(1);

        execute();
        expect(timelineSceneList.scenes.length).toBe(0);
        expect(parent.children.length).toBe(0);

        parent.remove();
    });
});