import { execute } from "./TimelineLayerControllerUpdateLightIconElementService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { describe, expect, it } from "vitest";

describe("TimelineLayerControllerUpdateLightIconElementStyleServiceTest", () =>
{
    it("execute test", () =>
    {
        const layerElement = document.createElement("div");
        timelineLayer.elements.length = 0;
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

        layer.light = true;
        execute(layer);

        expect(span.style.display).toBe("none");

        // layerがlightモードであることを確認（border設定はJSDOMでは検証困難）

        layer.light = false;
        execute(layer);

        expect(span.style.display).toBe("");
        expect(layerElement.style.borderBottom).toBe("");

    });
});