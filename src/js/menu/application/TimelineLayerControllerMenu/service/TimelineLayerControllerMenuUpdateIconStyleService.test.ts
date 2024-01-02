import {
    $TIMELINE_CONTROLLER_LAYER_NORMAL_ID,
    $TIMELINE_CONTROLLER_LAYER_MASK_ID,
    $TIMELINE_CONTROLLER_LAYER_GUIDE_ID
} from "../../../../config/TimelineLayerControllerMenuConfig";
import { execute } from "./TimelineLayerControllerMenuUpdateIconStyleService";
import { Layer } from "../../../../core/domain/model/Layer";

describe("TimelineLayerControllerMenuUpdateIconStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const normalElement = document.createElement("div");
        document.body.appendChild(normalElement);
        normalElement.id = $TIMELINE_CONTROLLER_LAYER_NORMAL_ID;

        const maskElement = document.createElement("div");
        document.body.appendChild(maskElement);
        maskElement.id = $TIMELINE_CONTROLLER_LAYER_MASK_ID;

        const guideElement = document.createElement("div");
        document.body.appendChild(guideElement);
        guideElement.id = $TIMELINE_CONTROLLER_LAYER_GUIDE_ID;

        // デフォルト
        expect(normalElement.style.opacity).toBe("");
        expect(normalElement.style.pointerEvents).toBe("");
        expect(maskElement.style.opacity).toBe("");
        expect(maskElement.style.pointerEvents).toBe("");
        expect(guideElement.style.opacity).toBe("");
        expect(guideElement.style.pointerEvents).toBe("");

        const layer = new Layer();

        // 通常レイヤー
        layer.mode = 0;
        execute(layer);
        expect(normalElement.style.opacity).toBe("0.5");
        expect(normalElement.style.pointerEvents).toBe("none");
        expect(maskElement.style.opacity).toBe("");
        expect(maskElement.style.pointerEvents).toBe("");
        expect(guideElement.style.opacity).toBe("");
        expect(guideElement.style.pointerEvents).toBe("");

        // マスクレイヤー
        layer.mode = 1;
        execute(layer);
        expect(normalElement.style.opacity).toBe("");
        expect(normalElement.style.pointerEvents).toBe("");
        expect(maskElement.style.opacity).toBe("0.5");
        expect(maskElement.style.pointerEvents).toBe("none");
        expect(guideElement.style.opacity).toBe("");
        expect(guideElement.style.pointerEvents).toBe("");
        
        // ガイドレイヤー
        layer.mode = 3;
        execute(layer);
        expect(normalElement.style.opacity).toBe("");
        expect(normalElement.style.pointerEvents).toBe("");
        expect(maskElement.style.opacity).toBe("");
        expect(maskElement.style.pointerEvents).toBe("");
        expect(guideElement.style.opacity).toBe("0.5");
        expect(guideElement.style.pointerEvents).toBe("none");

        // その他
        layer.mode = 5;
        execute(layer);
        expect(normalElement.style.opacity).toBe("0.5");
        expect(normalElement.style.pointerEvents).toBe("none");
        expect(maskElement.style.opacity).toBe("0.5");
        expect(maskElement.style.pointerEvents).toBe("none");
        expect(guideElement.style.opacity).toBe("0.5");
        expect(guideElement.style.pointerEvents).toBe("none");

        normalElement.remove();
        maskElement.remove();
        guideElement.remove();
    });
});