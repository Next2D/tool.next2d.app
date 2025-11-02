import { execute } from "./TimelineToolDeleteKeyframeUseCase";
import { $getCurrentWorkSpace, $createWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/external/timeline/domain/model/ExternalTimeline");

describe("TimelineToolDeleteKeyframeUseCase", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("should delete keyframes when selectedStartFrame exists", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;

        movieClip.selectedFrameObject.start = 5;
        movieClip.selectedFrameObject.end = 10;

        const deleteKeyframesMock = vi.fn();
        (ExternalTimeline as any).mockImplementation(function(this: any) {
            this.deleteKeyframes = deleteKeyframesMock;
        });

        execute();

        expect(ExternalTimeline).toHaveBeenCalledWith(workSpace, movieClip);
        expect(deleteKeyframesMock).toHaveBeenCalledWith(5, 11);
    });

    it("should not delete keyframes when selectedStartFrame is null", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;

        movieClip.selectedFrameObject.start = null;
        movieClip.selectedFrameObject.end = null;

        const deleteKeyframesMock = vi.fn();
        (ExternalTimeline as any).mockImplementation(function(this: any) {
            this.deleteKeyframes = deleteKeyframesMock;
        });

        execute();

        expect(deleteKeyframesMock).not.toHaveBeenCalled();
    });

    it("should handle selectedEndFrame when deleting keyframes", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;

        movieClip.selectedFrameObject.start = 1;
        movieClip.selectedFrameObject.end = 1;

        const deleteKeyframesMock = vi.fn();
        (ExternalTimeline as any).mockImplementation(function(this: any) {
            this.deleteKeyframes = deleteKeyframesMock;
        });

        execute();

        expect(deleteKeyframesMock).toHaveBeenCalledWith(1, 2);
    });
});
