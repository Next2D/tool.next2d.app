import { execute } from "./TimelineHeaderUpdateFrameElementService";
import { $TIMELINE_HEADER_FRAME_INDEX } from "../../../../config/TimelineConfig";

describe("TimelineHeaderUpdateFrameElementServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");

        for (let idx = 0; idx < 5; ++idx) {
            const node = document.createElement("div");
            div.appendChild(node);
        }

        const node = div.children[$TIMELINE_HEADER_FRAME_INDEX];

        expect(node.textContent).toBe("");
        execute(div, 5);
        expect(node.textContent).toBe("5");
        execute(div, 1);
        expect(node.textContent).toBe("");
    });
});