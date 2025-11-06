import { execute } from "./ScreenMenuUpdateStyleMoveParentMovieClipService";
import { $SCREEN_MOVE_SCENE_ID } from "@/config/ScreenConfig";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

vi.mock("@/timeline/domain/model/TimelineSceneList", () => ({
    timelineSceneList: {
        parents: []
    }
}));

describe("ScreenMenuUpdateStyleMoveParentMovieClipServiceTest", () =>
{
    let moveSceneElement: HTMLElement;

    beforeEach(() =>
    {
        moveSceneElement = document.createElement("div");
        moveSceneElement.id = $SCREEN_MOVE_SCENE_ID;
        moveSceneElement.setAttribute("style", "");
        document.body.appendChild(moveSceneElement);
    });

    afterEach(() =>
    {
        if (moveSceneElement && document.body.contains(moveSceneElement)) {
            document.body.removeChild(moveSceneElement);
        }
        vi.clearAllMocks();
        timelineSceneList.parents = [];
    });

    it("should return early when element is not found", () =>
    {
        const tempElement = moveSceneElement;
        document.body.removeChild(moveSceneElement);
        moveSceneElement = null as any;

        expect(() => execute()).not.toThrow();

        moveSceneElement = tempElement;
    });

    it("should set element to inactive when there are no parents", () =>
    {
        timelineSceneList.parents = [];

        execute();

        expect(moveSceneElement.style.opacity).toBe("0.5");
        expect(moveSceneElement.style.pointerEvents).toBe("none");
    });

    it("should set element to active when there are parents", () =>
    {
        timelineSceneList.parents = [{ id: 1 } as any];

        execute();

        expect(moveSceneElement.getAttribute("style")).toBe("");
    });

    it("should set element to active when there are multiple parents", () =>
    {
        timelineSceneList.parents = [{ id: 1 } as any, { id: 2 } as any];

        execute();

        expect(moveSceneElement.getAttribute("style")).toBe("");
    });
});
