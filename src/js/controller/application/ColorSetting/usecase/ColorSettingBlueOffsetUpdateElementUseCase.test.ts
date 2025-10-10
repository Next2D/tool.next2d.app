import { describe, it, expect, beforeEach, vi } from "vitest";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

const mockScreenAreaGetElementFromLayerIdAndDepthService = vi.fn();

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService", () => ({
    execute: (layerId: number, depth: number) => mockScreenAreaGetElementFromLayerIdAndDepthService(layerId, depth)
}));

const { execute } = await import("./ColorSettingBlueOffsetUpdateElementUseCase");

describe("ColorSettingBlueOffsetUpdateElementUseCase", () => {
    let mockMovieClip: MovieClip;
    let mockLayer: Layer;
    let mockCharacter: Character;
    let mockNode: HTMLElement;
    let mockContainer: HTMLDivElement;

    beforeEach(() => {
        vi.clearAllMocks();

        mockContainer = document.createElement("div");
        mockContainer.classList.add("canvas-container");
        mockContainer.style.setProperty = vi.fn();

        mockNode = document.createElement("div");
        mockNode.appendChild(mockContainer);

        mockCharacter = {
            colorTransform: [1, 1, 1, 1, 0, 0, 0, 0]
        } as unknown as Character;

        mockLayer = {
            id: 1,
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        } as unknown as Layer;

        const selectedDepths = new Map([[1, [10]]]);
        mockMovieClip = {
            selectedDepths: selectedDepths,
            currentFrame: 0,
            getLayer: vi.fn().mockReturnValue(mockLayer),
            isSingleSelectedOfDisplayObject: vi.fn().mockReturnValue(true)
        } as unknown as MovieClip;

        mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(mockNode);
    });

    describe("基本動作", () => {
        it("選択中のelementがない場合は何もしない", () => {
            mockMovieClip.selectedDepths = new Map();

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("blueOffsetが正しく更新される", () => {
            execute(mockMovieClip, 50);

            expect(mockCharacter.colorTransform[6]).toBe(50);
        });
    });
});
