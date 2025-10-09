import { describe, it, expect, beforeEach, vi } from "vitest";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

// モック関数の定義
const mockScreenAreaGetElementFromLayerIdAndDepthService = vi.fn();

// vi.mockの呼び出し
vi.mock("@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService", () => ({
    execute: (layerId: number, depth: number) => mockScreenAreaGetElementFromLayerIdAndDepthService(layerId, depth)
}));

// 動的インポート
const { execute } = await import("./ColorSettingGreenMultiplierUpdateElementUseCase");

describe("ColorSettingGreenMultiplierUpdateElementUseCase", () => {
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
            getLayer: vi.fn().mockReturnValue(mockLayer)
        } as unknown as MovieClip;

        mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(mockNode);
    });

    describe("基本動作", () => {
        it("選択中のelementがない場合は何もしない", () => {
            mockMovieClip.selectedDepths = new Map();

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("複数選択時は何もしない", () => {
            mockMovieClip.selectedDepths = new Map([[1, [10]], [2, [20]]]);

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("layerがnullの場合は何もしない", () => {
            mockMovieClip.getLayer = vi.fn().mockReturnValue(null);

            execute(mockMovieClip, 50);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
        });

        it("characterがnullの場合は何もしない", () => {
            mockLayer.getCharacter = vi.fn().mockReturnValue(null);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("nodeがnullの場合は何もしない", () => {
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(null);

            execute(mockMovieClip, 50);

            expect(mockContainer.style.setProperty).not.toHaveBeenCalled();
        });

        it("containerがnullの場合は何もしない", () => {
            const nodeWithoutContainer = document.createElement("div");
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(nodeWithoutContainer);

            execute(mockMovieClip, 50);

            // エラーが発生しないことを確認
            expect(mockMovieClip.getLayer).toHaveBeenCalled();
        });

        it("greenが正しく更新される", () => {
            execute(mockMovieClip, 50);

            expect(mockCharacter.colorTransform[1]).toBe(0.5);
        });

        it("画面に反映される", () => {
            execute(mockMovieClip, 50);

            expect(mockContainer.style.setProperty).toHaveBeenCalledWith(
                "--color-transform",
                expect.any(String)
            );
        });
    });
});
