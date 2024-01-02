import { $TIMELINE_CONTROLLER_LAYER_COLOR_ID } from "../../../../config/TimelineLayerControllerMenuConfig";
import { execute } from "./TimelineLayerControllerMenuSetColorService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import type { MovieClip } from "../../../../core/domain/model/MovieClip";
import type { Layer } from "../../../../core/domain/model/Layer";

describe("TimelineLayerControllerMenuSetColorServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const scene: MovieClip = workSpace.scene;
        const layer = scene.getLayer(0) as NonNullable<Layer>;

        const layerElement = document.createElement("div");
        layerElement.dataset.layerIndex = "0";

        const input = document.createElement("input");
        input.value = "#000000";
        document.body.appendChild(input);
        input.id = $TIMELINE_CONTROLLER_LAYER_COLOR_ID;

        expect(input.value).toBe("#000000");
        execute(layerElement);
        expect(input.value).toBe(layer.color);

        input.remove();
    });
});