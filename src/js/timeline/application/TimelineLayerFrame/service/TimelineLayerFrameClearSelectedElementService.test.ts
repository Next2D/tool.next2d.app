import { execute } from "./TimelineLayerFrameClearSelectedElementService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { MovieClip } from "../../../../core/domain/model/MovieClip";

describe("TimelineLayerFrameClearSelectedElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace () || $createWorkSpace();
        const scene: MovieClip = workSpace.scene;
        for (let idx = 0; idx < scene.layers.length; ++idx) {
            const layer = scene.layers[idx];
            scene.removeLayer(layer);
        }
        scene.setLayer(scene.createLayer(), 0);
        scene.setLayer(scene.createLayer(), 1);

        // 初期化
        timelineLayer.elements.length = 0;

        const layerElement1 = document.createElement("div");
        timelineLayer.elements.push(layerElement1);

        const frameElement1 = document.createElement("div");
        layerElement1.appendChild(frameElement1);

        const div1 = document.createElement("div");
        frameElement1.appendChild(div1);
        div1.setAttribute("class", "frame-active");

        const div2 = document.createElement("div");
        frameElement1.appendChild(div2);
        div2.setAttribute("class", "frame-active");

        const layerElement2 = document.createElement("div");
        timelineLayer.elements.push(layerElement2);

        const frameElement2 = document.createElement("div");
        layerElement2.appendChild(frameElement2);

        const div3 = document.createElement("div");
        frameElement2.appendChild(div3);
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

        expect(div1.classList.contains("frame-active")).toBe(false);
        expect(div2.classList.contains("frame-active")).toBe(false);
        expect(div3.classList.contains("frame-active")).toBe(false);

    });
});