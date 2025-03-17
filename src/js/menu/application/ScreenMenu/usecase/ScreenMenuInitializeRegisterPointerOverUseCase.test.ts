import { execute } from "./ScreenMenuInitializeRegisterPointerOverUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ScreenMenuInitializeRegisterPointerOverUseCase Test", () =>
{
    it("execute test", () =>
    {
        const hideElementIds = [
            "screen-distribute-to-layers",
            "screen-distribute-to-keyframes",
            "screen-align-coordinates-prev-keyframe",
            "screen-align-matrix-prev-keyframe",
            "screen-integrating-paths",
            "screen-add-tween-curve-pointer",
            "screen-delete-tween-curve-pointer",
            "screen-change-movie-clip",
            "screen-preview",
            "screen-ruler",
            "screen-change-scene",
            "screen-move-scene",
            "screen-order",
            "screen-align"
        ];

        for (let idx = 0; idx < hideElementIds.length; ++idx) {
            const div = document.createElement("div");
            document.body.appendChild(div);
            div.id = hideElementIds[idx];
            div.dataset.pointerOver = "false";
            div.addEventListener = vi.fn((type) =>
            {
                if (type === EventType.POINTER_OVER) {
                    div.dataset.pointerOver = "true";
                } else {
                    throw new Error("error");
                }
            });

            expect(div.dataset.pointerOver).toBe("false");
        }

        execute();

        for (let idx = 0; idx < hideElementIds.length; ++idx) {
            const div = document.getElementById(hideElementIds[idx]);
            if (!div) {
                throw new Error("error");
            }
            expect(div.dataset.pointerOver).toBe("true");
            div.remove();
        }
    });
});