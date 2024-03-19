import { execute } from "./TimelineLayerControllerUpdateIconElementService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerControllerUpdateIconElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const layerElement = document.createElement("div");
        timelineLayer.elements.length = 0;
        timelineLayer.elements.push(layerElement);

        const iconElement = document.createElement("i");
        layerElement.appendChild(iconElement);
        iconElement.classList.add("timeline-layer-icon");
        iconElement.dataset.layerIndex = "0";

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(iconElement.classList.contains("timeline-layer-icon")).toBe(true);
        execute(layer, 0, 1);
        expect(iconElement.classList.contains("timeline-layer-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-mask-icon")).toBe(true);
        execute(layer, 1, 2);
        expect(iconElement.classList.contains("timeline-mask-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-mask-in-icon")).toBe(true);
        execute(layer, 2, 3);
        expect(iconElement.classList.contains("timeline-mask-in-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-guide-icon")).toBe(true);
        execute(layer, 3, 4);
        expect(iconElement.classList.contains("timeline-guide-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-guide-in-icon")).toBe(true);
        execute(layer, 4, 5);
        expect(iconElement.classList.contains("timeline-guide-in-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-folder-icon")).toBe(true);
        execute(layer, 5, 0);
        expect(iconElement.classList.contains("timeline-folder-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-layer-icon")).toBe(true);
    });
});