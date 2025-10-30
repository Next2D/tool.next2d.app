import { execute } from "./TimelineHeaderLabelIconPointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { $TIMELINE_MARKER_ID } from "../../../../config/TimelineConfig";
import {
    $setMoveIconFrame,
    $getMoveIconFrame,
    $setMoveIconType,
    $getMoveIconType
} from "../../TimelineUtil";

describe("TimelineHeaderLabelIconPointerDownEventUseCase Test", () =>
{
    it("execute test script", (): void =>
    {
        const markerElement = document.createElement("div");
        markerElement.id = $TIMELINE_MARKER_ID;
        document.body.appendChild(markerElement);

        const frame = 12;
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;
        movieClip.setLabel(frame, "test");

        const div = document.createElement("div");
        div.dataset.frame = `${frame}`;

        let stopPropagation = false;
        const mockEvent = {
            "currentTarget": div,
            "stopPropagation": vi.fn(() => { stopPropagation = true }),
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);

        $setMoveIconFrame(1);
        expect($getMoveIconFrame()).toBe(1);

        $setMoveIconType("");
        expect($getMoveIconType()).toBe("");

        expect(markerElement.style.pointerEvents).toBe("");

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect($getMoveIconFrame()).toBe(12);
        expect($getMoveIconType()).toBe("label");
        expect(markerElement.style.pointerEvents).toBe("none");

        markerElement.remove();
    });
});