import { execute } from "./TimelineLayerFrameClearSelectedElementService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerFrameClearSelectedElementServiceTest", () =>
{
    test("execute test", () =>
    {
        $createWorkSpace();

        const parent1 = document.createElement("div");
        document.body.appendChild(parent1);
        parent1.id = "timeline-frame-controller-0";

        const div1 = document.createElement("div");
        parent1.appendChild(div1);
        div1.setAttribute("class", "frame-active");

        const div2 = document.createElement("div");
        parent1.appendChild(div2);
        div2.setAttribute("class", "frame-active");

        const parent2 = document.createElement("div");
        document.body.appendChild(parent2);
        parent2.id = "timeline-frame-controller-1";

        const div3 = document.createElement("div");
        parent2.appendChild(div3);
        div3.setAttribute("class", "frame-active");

        const targetLayers = timelineLayer.targetLayers;
        expect(targetLayers.size).toBe(0);

        targetLayers.set(0, [1, 2]);
        targetLayers.set(1, [1]);
        expect(targetLayers.size).toBe(2);

        expect(div1.classList.contains("frame-active")).toBe(true);
        expect(div2.classList.contains("frame-active")).toBe(true);
        expect(div3.classList.contains("frame-active")).toBe(true);

        execute();

        expect(targetLayers.size).toBe(2);
        expect(div1.classList.contains("frame-active")).toBe(false);
        expect(div2.classList.contains("frame-active")).toBe(false);
        expect(div3.classList.contains("frame-active")).toBe(false);

        parent1.remove();
        parent2.remove();
    });
});