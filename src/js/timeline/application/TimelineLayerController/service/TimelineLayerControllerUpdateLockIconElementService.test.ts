import { execute } from "./TimelineLayerControllerUpdateLockIconElementService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerControllerUpdateLockIconElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const layerElement = document.createElement("div");
        timelineLayer.elements.length = 0;
        timelineLayer.elements.push(layerElement);

        const iconElement = document.createElement("div");
        layerElement.appendChild(iconElement);
        iconElement.setAttribute("class", "timeline-layer-lock-one icon-disable");

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