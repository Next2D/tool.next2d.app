import { execute } from "./ScreenMenuUpdateStyleSubMenuService";
import {
    $SCREEN_ALIGN_ID,
    $SCREEN_ORDER_ID
} from "@/config/ScreenConfig";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

describe("ScreenMenuUpdateStyleSubMenuServiceTest", () =>
{
    let alignElement: HTMLElement;
    let orderElement: HTMLElement;

    beforeEach(() =>
    {
        alignElement = document.createElement("div");
        alignElement.id = $SCREEN_ALIGN_ID;
        alignElement.setAttribute("style", "");
        document.body.appendChild(alignElement);

        orderElement = document.createElement("div");
        orderElement.id = $SCREEN_ORDER_ID;
        orderElement.setAttribute("style", "");
        document.body.appendChild(orderElement);
    });

    afterEach(() =>
    {
        if (alignElement && document.body.contains(alignElement)) {
            document.body.removeChild(alignElement);
        }
        if (orderElement && document.body.contains(orderElement)) {
            document.body.removeChild(orderElement);
        }
        vi.clearAllMocks();
    });

    it("should set elements to active when single object is selected", () =>
    {
        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => true)
        } as unknown as MovieClip;

        execute(mockMovieClip);

        expect(alignElement.getAttribute("style")).toBe("");
        expect(orderElement.getAttribute("style")).toBe("");
    });

    it("should set elements to inactive when multiple objects are selected", () =>
    {
        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => false)
        } as unknown as MovieClip;

        execute(mockMovieClip);

        expect(alignElement.style.opacity).toBe("0.5");
        expect(alignElement.style.pointerEvents).toBe("none");
        expect(orderElement.style.opacity).toBe("0.5");
        expect(orderElement.style.pointerEvents).toBe("none");
    });

    it("should continue execution when one element is not found", () =>
    {
        document.body.removeChild(alignElement);

        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => true)
        } as unknown as MovieClip;

        expect(() => execute(mockMovieClip)).not.toThrow();
        expect(orderElement.getAttribute("style")).toBe("");
    });

    it("should not throw error when both elements are not found", () =>
    {
        document.body.removeChild(alignElement);
        document.body.removeChild(orderElement);

        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => true)
        } as unknown as MovieClip;

        expect(() => execute(mockMovieClip)).not.toThrow();
    });
});
