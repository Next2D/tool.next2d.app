import { execute } from "./HistoryRemoveElementService";
import { $HISTORY_LIST_ID } from "../../../../config/HistoryConfig";;
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("HistoryRemoveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        workSpace.histories.length = 0;
        workSpace.histories.push({});

        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $HISTORY_LIST_ID;

        const node = document.createElement("div");
        div.appendChild(node);

        expect(div.children.length).toBe(1);
        execute(workSpace);
        expect(div.children.length).toBe(0);

        div.remove();
    });
});