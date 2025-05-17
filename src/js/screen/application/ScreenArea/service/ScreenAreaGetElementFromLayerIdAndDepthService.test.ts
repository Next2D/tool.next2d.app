import { execute } from "./ScreenAreaGetElementFromLayerIdAndDepthService";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("ScreenAreaGetElementFromLayerIdAndDepthService Test", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_STAGE_AREA_ID;
        document.body.appendChild(parent);

        for (let idx = 0; idx < 10; ++idx) {
            const div = document.createElement("div");
            div.dataset.id = `${idx}`;
            div.classList.add(`layer-id-1`);
            parent.appendChild(div);
        }

        for (let idx = 0; idx < 10; ++idx) {
            const node = execute(1, idx);
            if (!node) {
                throw new Error("Node is null");
            }
            expect(node.dataset.id).toBe(`${idx}`);
        }

        parent.remove();
    });
});