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
        iconElement.classList.add("identification-class");
        iconElement.classList.add("timeline-layer-icon");
        iconElement.dataset.layerIndex = "0";

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(iconElement.classList.contains("timeline-layer-icon")).toBe(true);
        
        layer.mode = 1;
        execute(layer);
        expect(iconElement.classList.contains("timeline-layer-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-mask-icon")).toBe(true);
        
        layer.mode = 2;
        execute(layer);
        expect(iconElement.classList.contains("timeline-mask-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-mask-in-icon")).toBe(true);

        layer.mode = 3;
        execute(layer);
        expect(iconElement.classList.contains("timeline-mask-in-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-guide-icon")).toBe(true);
        
        layer.mode = 4;
        execute(layer);
        expect(iconElement.classList.contains("timeline-guide-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-guide-in-icon")).toBe(true);
        
        layer.mode = 5;
        execute(layer);
        expect(iconElement.classList.contains("timeline-guide-in-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-folder-icon")).toBe(true);
        
        layer.mode = 0;
        execute(layer);
        expect(iconElement.classList.contains("timeline-folder-icon")).toBe(false);
        expect(iconElement.classList.contains("timeline-layer-icon")).toBe(true);
    });
});