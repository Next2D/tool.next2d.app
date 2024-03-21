import { execute } from "./TimelineLayerElementResettingService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerElementResettingServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        const layerElement = document.createElement("div");
        const iconElement = document.createElement("i");
        layerElement.appendChild(iconElement);
        iconElement.classList.add("timeline-insert-icon");
        iconElement.style.display = "";

        timelineLayer.elements.length = 0;
        timelineLayer.elements.push(layerElement);

        layerElement.classList.add("move-target");

        expect(iconElement.style.display).toBe("");
        expect(layerElement.classList.contains("move-target")).toBe(true);
        execute(layer);
        expect(iconElement.style.display).toBe("none");
        expect(layerElement.classList.contains("move-target")).toBe(false);
    });
});