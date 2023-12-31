import { execute } from "./TimelineLayerControllerUpdateNameElementService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerControllerUpdateNameElementServiceTest", () =>
{
    test("execute test", () =>
    {
        $createWorkSpace();

        const layerElement = document.createElement("div");

        // 初期化して登録
        timelineLayer.elements.length = 0;
        timelineLayer.elements.push(layerElement);

        const nameElement = document.createElement("div");
        layerElement.appendChild(nameElement);
        nameElement.setAttribute("class", "view-text");
        nameElement.textContent = "Layer_Test";

        expect(nameElement.textContent).toBe("Layer_Test");
        execute(0, "test");
        expect(nameElement.textContent).toBe("test");
    });
});