import { execute } from "./ScriptAreaFrameElementPointerDownEventUseCase";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it, vi } from "vitest";
import {
    $getTargetFrame,
    $setTargetFrame,
    $setTargetMovieClip,
    $getTargetMovieClip
} from "../../../../menu/application/ScriptEditorModal/ScriptEditorModalUtil";

describe("ScriptAreaFrameElementPointerDownEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const div = document.createElement("div");
        div.dataset.libraryId = "0";
        div.dataset.frame = "10";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "currentTarget": div,
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() =>
            {
                preventDefault = true;
            })
        } as unknown as PointerEvent;

        $setTargetFrame(1);
        $setTargetMovieClip(null);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect($getTargetFrame()).toBe(1);
        expect($getTargetMovieClip()).toBe(null);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect($getTargetFrame()).toBe(10);
        expect($getTargetMovieClip()).toBe(workSpace.root);
    });
});