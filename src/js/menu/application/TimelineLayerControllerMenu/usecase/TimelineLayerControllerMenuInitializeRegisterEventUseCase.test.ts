import { execute } from "./TimelineLayerControllerMenuInitializeRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $TIMELINE_CONTROLLER_LAYER_COLOR_ID,
    $TIMELINE_CONTROLLER_LAYER_GUIDE_ID,
    $TIMELINE_CONTROLLER_LAYER_MASK_ID,
    $TIMELINE_CONTROLLER_LAYER_NORMAL_ID,
    $TIMELINE_CONTROLLER_LAYER_SCALE_ID
} from "../../../../config/TimelineLayerControllerMenuConfig";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("TimelineLayerControllerMenuInitializeRegisterEventUseCase", () =>
{
    it("execute test", () =>
    {
        const colorElement = document.createElement("input");
        document.body.appendChild(colorElement);
        colorElement.id = $TIMELINE_CONTROLLER_LAYER_COLOR_ID;

        let colorElementCheck = false;
        colorElement.addEventListener = vi.fn((type) =>
        {
            if (type === "change") {
                colorElementCheck = true;   
            }
        });

        const scaleElement = document.createElement("input");
        document.body.appendChild(scaleElement);
        scaleElement.id = $TIMELINE_CONTROLLER_LAYER_SCALE_ID;

        let scaleElementCheck = false;
        scaleElement.addEventListener = vi.fn((type) =>
        {
            if (type === "change") {
                scaleElementCheck = true;
            }
        });

        const normalElement = document.createElement("input");
        document.body.appendChild(normalElement);
        normalElement.id = $TIMELINE_CONTROLLER_LAYER_NORMAL_ID;

        let normalElementCheck = false;
        normalElement.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                normalElementCheck = true;
            }
        });

        const maskElement = document.createElement("input");
        document.body.appendChild(maskElement);
        maskElement.id = $TIMELINE_CONTROLLER_LAYER_MASK_ID;

        let maskElementCheck = false;
        maskElement.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                maskElementCheck = true;
            }
        });

        const guideElement = document.createElement("input");
        document.body.appendChild(guideElement);
        guideElement.id = $TIMELINE_CONTROLLER_LAYER_GUIDE_ID;

        let guideElementCheck = false;
        guideElement.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                guideElementCheck = true;
            }
        });

        expect(colorElementCheck).toBe(false);
        expect(scaleElementCheck).toBe(false);
        expect(normalElementCheck).toBe(false);
        expect(maskElementCheck).toBe(false);
        expect(guideElementCheck).toBe(false);

        execute();

        expect(colorElementCheck).toBe(true);
        expect(scaleElementCheck).toBe(true);
        expect(normalElementCheck).toBe(true);
        expect(maskElementCheck).toBe(true);
        expect(guideElementCheck).toBe(true);

        colorElement.remove();
        scaleElement.remove();
        normalElement.remove();
        maskElement.remove();
        guideElement.remove();
    });
});