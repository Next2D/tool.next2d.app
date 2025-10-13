import { execute } from "./ScreenDisplayObjectChangeElementClassService";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it } from "vitest";

describe("ScreenDisplayObjectChangeElementClassServiceTest", () =>
{
    it("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.layers[0];

        const parent = document.createElement("div");
        parent.id = $SCREEN_STAGE_AREA_ID;
        document.body.appendChild(parent);

        for (let idx = 0; idx < 10; ++idx) {
            const div = document.createElement("div");
            parent.appendChild(div);
            div.classList.add(`layer-id-${layer.id}`);
            
            // Add canvas-container div as the implementation expects
            const container = document.createElement("div");
            container.classList.add("canvas-container");
            container.classList.add("active");
            div.appendChild(container);
        }

        // Check initial state - should have active class
        for (let idx = 0; idx < 10; ++idx) {
            const div = parent.children[idx];
            const container = div.querySelector(".canvas-container") as HTMLDivElement;
            expect(container.classList.contains("active")).toBe(true);
            expect(container.style.pointerEvents).toBe("");
        }

        // Lock layer
        layer.lock = true;
        execute(layer);

        // After lock, should remove active class and set pointerEvents to none
        for (let idx = 0; idx < 10; ++idx) {
            const div = parent.children[idx];
            const container = div.querySelector(".canvas-container") as HTMLDivElement;
            expect(container.classList.contains("active")).toBe(false);
            expect(container.style.pointerEvents).toBe("none");
        }

        // Unlock layer
        layer.lock = false;
        execute(layer);

        // After unlock, should set pointerEvents to empty (allows events)
        for (let idx = 0; idx < 10; ++idx) {
            const div = parent.children[idx];
            const container = div.querySelector(".canvas-container") as HTMLDivElement;
            expect(container.style.pointerEvents).toBe("");
        }

        parent.remove();
    });
});