import { execute } from "./TimelineLayerControllerUpdateLightIconElementService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerControllerUpdateLightIconElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const layerElement = document.createElement("div");
        timelineLayer.elements.push(layerElement);

        const lightElement = document.createElement("div");
        layerElement.appendChild(lightElement);
        lightElement.setAttribute("class", "timeline-layer-light-one");
        lightElement.dataset.layerIndex = "0";

        const span = document.createElement("span");
        lightElement.appendChild(span);

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(span.style.display).toBe("");
        expect(layerElement.style.borderBottom).toBe("");

        execute(0, true);

        expect(span.style.display).toBe("none");
        expect(layerElement.style.borderBottom).toBe(`1px solid ${layer.color}`);

        execute(0, false);

        expect(span.style.display).toBe("");
        expect(layerElement.style.borderBottom).toBe("");

    });
});