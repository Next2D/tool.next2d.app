import { execute } from "./TimelineToolUpdateSceneNameService";
import { $TIMELINE_SCENE_NAME_ID } from "../../../../../../config/TimelineConfig";

describe("TimelineToolUpdateSceneNameServiceTest", () =>
{
    test("execute test", async () =>
    {
        const div = document.createElement("div");
        div.id = $TIMELINE_SCENE_NAME_ID;
        document.body.appendChild(div);

        expect(div.textContent).toBe("");
        await execute("test");
        expect(div.textContent).toBe("test");

        div.remove();
    });
});