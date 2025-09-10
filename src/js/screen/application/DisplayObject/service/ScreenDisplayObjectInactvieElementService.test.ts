import { execute } from "./ScreenDisplayObjectInactvieElementService";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";
import { Layer } from "../../../../core/domain/model/Layer";
import { describe, expect, it } from "vitest";

describe("ScreenDisplayObjectInactvieElementService Test", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_STAGE_AREA_ID;
        document.body.appendChild(parent);

        for (let idx = 0; idx < 10; ++idx) {
            const div = document.createElement("div");
            parent.appendChild(div);
            div.classList.add("container-layer-id-2", "active");
        }

        for (let idx = 0; idx < 10; ++idx) {
            const div = parent.children[idx];
            expect(div.classList.contains("active")).toBe(true);
        }

        const layer = new Layer();
        layer.id = 2;
        execute(layer, [0, 2, 4, 6, 8]);

        for (let idx = 0; idx < 10; ++idx) {
            const div = parent.children[idx];
            if (idx % 2 === 0) {
                expect(div.classList.contains("active")).toBe(false);
            } else {
                expect(div.classList.contains("active")).toBe(true);
            }
        }

        parent.remove();
    });
});