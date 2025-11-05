import { execute } from "./ScreenMenuUpdateStyleEditMovieClipService";
import { $SCREEN_CHANGE_SCENE_ID } from "@/config/ScreenConfig";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

vi.mock("@/core/application/CoreUtil");

describe("ScreenMenuUpdateStyleEditMovieClipServiceTest", () =>
{
    let changeSceneElement: HTMLElement;

    beforeEach(() =>
    {
        changeSceneElement = document.createElement("div");
        changeSceneElement.id = $SCREEN_CHANGE_SCENE_ID;
        changeSceneElement.setAttribute("style", "");
        document.body.appendChild(changeSceneElement);
    });

    afterEach(() =>
    {
        if (changeSceneElement && document.body.contains(changeSceneElement)) {
            document.body.removeChild(changeSceneElement);
        }
        vi.clearAllMocks();
    });

    it("should return early when element is not found", () =>
    {
        const tempElement = changeSceneElement;
        document.body.removeChild(changeSceneElement);
        changeSceneElement = null as any;

        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => true)
        } as unknown as MovieClip;

        expect(() => execute(mockMovieClip)).not.toThrow();

        changeSceneElement = tempElement;
    });

    it("should set element to inactive when multiple objects are selected", () =>
    {
        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => false)
        } as unknown as MovieClip;

        execute(mockMovieClip);

        expect(changeSceneElement.style.opacity).toBe("0.5");
        expect(changeSceneElement.style.pointerEvents).toBe("none");
    });

    it("should set element to active when single MovieClip is selected", () =>
    {
        const mockDepth = 1;
        const mockPlaceId = 100;
        const mockLibraryId = 200;

        const mockCharacter = {
            libraryId: mockLibraryId
        };

        const mockLayer = {
            getCharacter: vi.fn(() => mockCharacter)
        };

        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => true),
            selectedDepths: new Map([[mockDepth, [mockPlaceId]]]),
            currentFrame: 1,
            getLayer: vi.fn(() => mockLayer)
        } as unknown as MovieClip;

        const mockLibrary = {
            type: $MOVIE_CLIP_TYPE
        };

        const mockWorkSpace = {
            getLibrary: vi.fn(() => mockLibrary)
        };

        vi.mocked($getCurrentWorkSpace).mockReturnValue(mockWorkSpace as any);

        execute(mockMovieClip);

        expect(changeSceneElement.getAttribute("style")).toBe("");
    });

    it("should set element to inactive when selected instance is not MovieClip", () =>
    {
        const mockDepth = 1;
        const mockPlaceId = 100;
        const mockLibraryId = 200;

        const mockCharacter = {
            libraryId: mockLibraryId
        };

        const mockLayer = {
            getCharacter: vi.fn(() => mockCharacter)
        };

        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => true),
            selectedDepths: new Map([[mockDepth, [mockPlaceId]]]),
            currentFrame: 1,
            getLayer: vi.fn(() => mockLayer)
        } as unknown as MovieClip;

        const mockLibrary = {
            type: "OtherType"
        };

        const mockWorkSpace = {
            getLibrary: vi.fn(() => mockLibrary)
        };

        vi.mocked($getCurrentWorkSpace).mockReturnValue(mockWorkSpace as any);

        execute(mockMovieClip);

        expect(changeSceneElement.style.opacity).toBe("0.5");
        expect(changeSceneElement.style.pointerEvents).toBe("none");
    });

    it("should return early when layer is not found", () =>
    {
        const mockDepth = 1;

        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => true),
            selectedDepths: new Map([[mockDepth, [100]]]),
            getLayer: vi.fn(() => null)
        } as unknown as MovieClip;

        expect(() => execute(mockMovieClip)).not.toThrow();
    });

    it("should return early when character is not found", () =>
    {
        const mockDepth = 1;
        const mockPlaceId = 100;

        const mockLayer = {
            getCharacter: vi.fn(() => null)
        };

        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => true),
            selectedDepths: new Map([[mockDepth, [mockPlaceId]]]),
            currentFrame: 1,
            getLayer: vi.fn(() => mockLayer)
        } as unknown as MovieClip;

        expect(() => execute(mockMovieClip)).not.toThrow();
    });

    it("should return early when instance is not found", () =>
    {
        const mockDepth = 1;
        const mockPlaceId = 100;
        const mockLibraryId = 200;

        const mockCharacter = {
            libraryId: mockLibraryId
        };

        const mockLayer = {
            getCharacter: vi.fn(() => mockCharacter)
        };

        const mockMovieClip = {
            isSingleSelectedOfDisplayObject: vi.fn(() => true),
            selectedDepths: new Map([[mockDepth, [mockPlaceId]]]),
            currentFrame: 1,
            getLayer: vi.fn(() => mockLayer)
        } as unknown as MovieClip;

        const mockWorkSpace = {
            getLibrary: vi.fn(() => null)
        };

        vi.mocked($getCurrentWorkSpace).mockReturnValue(mockWorkSpace as any);

        expect(() => execute(mockMovieClip)).not.toThrow();
    });
});
