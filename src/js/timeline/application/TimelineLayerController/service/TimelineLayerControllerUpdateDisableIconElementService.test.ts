import { execute } from "./TimelineLayerControllerUpdateDisableIconElementService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerControllerUpdateDisableIconElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const layerElement = document.createElement("div");
        timelineLayer.elements.length = 0;
        timelineLayer.elements.push(layerElement);

        const iconElement = document.createElement("div");
        layerElement.appendChild(iconElement);
        iconElement.setAttribute("class", "timeline-layer-disable-one icon-disable");

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(iconElement.classList.contains("icon-disable")).toBe(true);
        expect(iconElement.classList.contains("icon-active")).toBe(false);

        execute(layer, true);

        expect(iconElement.classList.contains("icon-disable")).toBe(false);
        expect(iconElement.classList.contains("icon-active")).toBe(true);

        execute(layer, false);

        expect(iconElement.classList.contains("icon-disable")).toBe(true);
        expect(iconElement.classList.contains("icon-active")).toBe(false);
    });
});