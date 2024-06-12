import { execute } from "./TimelineHeaderIconMouseOverService";
import {
    $setMoveIconType,
    $setMoveIconFrame
} from "../../TimelineUtil";

describe("TimelineHeaderIconMouseOverServiceTest", () =>
{
    test("execute test script", (): void =>
    {
        $setMoveIconType("script");
        $setMoveIconFrame(10);

        const div = document.createElement("div");
        div.dataset.frame = "20";

        expect(div.style.backgroundColor).toBe("");
        execute(div);
        expect(div.style.backgroundColor).toBe("rgb(54, 146, 240)");
    });
});