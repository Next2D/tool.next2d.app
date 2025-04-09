import { execute } from "./TimelineSceneListClearAllService";
import { $TIMELINE_SCENE_NAME_LIST_ID } from "../../../../config/TimelineConfig";
import { timelineSceneList } from "../../../domain/model/TimelineSceneList";
import { describe, expect, it } from "vitest";

describe("TimelineSceneListClearAllServiceTest", () =>
{
    it("execute test", () =>
    {
        timelineSceneList.parents.push({
            "libraryId": 0,
            "matrix": [1,0,0,1,0,0]
        });
        expect(timelineSceneList.parents.length).toBe(1);

        const parent = document.createElement("div");
        parent.id = $TIMELINE_SCENE_NAME_LIST_ID;
        document.body.appendChild(parent);

        const div = document.createElement("div");
        parent.appendChild(div);
        expect(parent.children.length).toBe(1);

        execute();
        expect(timelineSceneList.parents.length).toBe(0);
        expect(parent.children.length).toBe(0);

        parent.remove();
    });
});