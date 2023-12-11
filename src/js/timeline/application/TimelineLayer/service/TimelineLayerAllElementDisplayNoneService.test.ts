import { $TIMELINE_CONTENT_ID } from "../../../../config/TimelineConfig";
import { execute } from "./TimelineLayerAllElementDisplayNoneService";

describe("TimelineLayerAllElementDisplayNoneServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $TIMELINE_CONTENT_ID;

        const node1 = document.createElement("div");
        div.appendChild(node1);
        node1.style.display = "";

        const node2 = document.createElement("div");
        div.appendChild(node2);
        node2.style.display = "";

        expect(node1.style.display).toBe("");
        expect(node2.style.display).toBe("");

        execute();

        expect(node1.style.display).toBe("none");
        expect(node2.style.display).toBe("none");

        div.remove();
    });
});