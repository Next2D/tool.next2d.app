import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { execute } from "./LibraryAreaMovieClipIconMouseDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $MOVIE_CLIP_TYPE } from "../../../../config/InstanceConfig";
import { timelineHeader } from "../../../../timeline/domain/model/TimelineHeader";

describe("LibraryAreaMovieClipIconMouseDownEventUseCase Test", () =>
{
    it("execute test case1", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = new MovieClip({
            "id": 2,
            "name": "test",
            "type": $MOVIE_CLIP_TYPE
        });
        workSpace.libraries.set(movieClip.id, movieClip);

        const div = document.createElement("div");
        div.dataset.libraryId = "2";

        let preventDefault = false;
        let stopPropagation = false;
        const mockEvent = {
            "currentTarget": div,
            "preventDefault": vi.fn(() => { preventDefault = true; }),
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "button": 0,
        } as unknown as PointerEvent;

        expect(movieClip.active).toBe(false);
        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);

        await workSpace.run();
        await execute(mockEvent);
        await execute(mockEvent);

        expect(movieClip.active).toBe(true);
        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);

        workSpace.libraries.delete(movieClip.id);
        workSpace.stop();
    });

    it("execute test case2", async () =>
    {
        let preventDefault = false;
        let stopPropagation = false;
        const mockEvent = {
            "preventDefault": vi.fn(() => { preventDefault = true; }),
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "button": 0,
        } as unknown as PointerEvent;

        timelineHeader.stopFlag = false;
        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);

        await execute(mockEvent);

        timelineHeader.stopFlag = true;
        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);
    });
});