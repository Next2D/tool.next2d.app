import { execute } from "./TimelineLayerControllerMenuNormalPointerDownUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import {
    $MASK_MODE,
    $NORMAL_MODE
} from "../../../../config/LayerModeConfig";

describe("TimelineLayerControllerMenuNormalPointerDownUseCase", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;

        const layer = movieClip.layers[0];
        layer.mode = $MASK_MODE; // MASK
        expect(layer.mode).toBe($MASK_MODE);

        movieClip.selectedLayers.length = 0;
        movieClip.selectedLayers.push(layer);

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "preventDefault": vi.fn(() => { preventDefault = true; }),
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(layer.mode).toBe($NORMAL_MODE); // NORMAL
    });
});