import { execute } from "./HistoryRemoveElementService";
import { $HISTORY_LIST_ID } from "../../../../config/HistoryConfig";;
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("HistoryRemoveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const scene = $createWorkSpace().scene;
        scene.histories.push({});

        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $HISTORY_LIST_ID;

        const node = document.createElement("div");
        div.appendChild(node);

        expect(div.children.length).toBe(1);
        execute(scene);
        expect(div.children.length).toBe(0);

        div.remove();
    });
});