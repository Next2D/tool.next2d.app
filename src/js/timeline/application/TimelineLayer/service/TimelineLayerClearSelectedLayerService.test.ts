import { execute } from "./TimelineLayerClearSelectedLayerService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerClearSelectedLayerServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const div = document.createElement("div");
        div.setAttribute("class", "active");
        timelineLayer.elements.length = 0;
        timelineLayer.elements.push(div);

        expect(timelineLayer.targetLayers.size).toBe(0);
        expect(div.classList.contains("active")).toBe(true);

        timelineLayer.targetLayers.set(0, [1,2,3]);
        expect(timelineLayer.targetLayers.size).toBe(1);

        execute();

        expect(timelineLayer.targetLayers.size).toBe(0);
        expect(div.classList.contains("active")).toBe(false);

        div.remove();
    });
});