import { execute } from "./ScreenMenuInitializeRegisterPointerOverUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";
import {
    $SCREEN_DISTRIBUTE_TO_LAYERS_ID,
    $SCREEN_DISTRIBUTE_TO_KEYFRAMES_ID,
    $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID,
    $SCREEN_ALIGN_MATRIX_PREV_KEYFRAME_ID,
    $SCREEN_INTEGRATING_PATHS_ID,
    $SCREEN_ADD_TWEEN_CURVE_POINTER_ID,
    $SCREEN_DELETE_TWEEN_CURVE_POINTER_ID,
    $SCREEN_CONVERT_MOVIE_CLIP_ID,
    $SCREEN_PREVIEW_ID,
    $SCREEN_CHANGE_SCENE_ID,
    $SCREEN_MOVE_SCENE_ID,
    $SCREEN_RULER_ID
} from "@/config/ScreenConfig";

describe("ScreenMenuInitializeRegisterPointerOverUseCase Test", () =>
{
    it("execute test", () =>
    {
        const hideElementIds = [
            $SCREEN_DISTRIBUTE_TO_LAYERS_ID,
            $SCREEN_DISTRIBUTE_TO_KEYFRAMES_ID,
            $SCREEN_ALIGN_COORDINATES_PREV_KEYFRAME_ID,
            $SCREEN_ALIGN_MATRIX_PREV_KEYFRAME_ID,
            $SCREEN_INTEGRATING_PATHS_ID,
            $SCREEN_ADD_TWEEN_CURVE_POINTER_ID,
            $SCREEN_DELETE_TWEEN_CURVE_POINTER_ID,
            $SCREEN_CONVERT_MOVIE_CLIP_ID,
            $SCREEN_PREVIEW_ID,
            $SCREEN_RULER_ID,
            $SCREEN_CHANGE_SCENE_ID,
            $SCREEN_MOVE_SCENE_ID
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