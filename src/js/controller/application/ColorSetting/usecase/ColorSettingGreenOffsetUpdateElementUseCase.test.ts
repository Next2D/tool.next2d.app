import { describe, it, expect, beforeEach, vi } from "vitest";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

const mockScreenAreaGetElementFromLayerIdAndDepthService = vi.fn();

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService", () => ({
    execute: (layerId: number, depth: number) => mockScreenAreaGetElementFromLayerIdAndDepthService(layerId, depth)
}));

const { execute } = await import("./ColorSettingGreenOffsetUpdateElementUseCase");

describe("ColorSettingGreenOffsetUpdateElementUseCase", () => {
    let mockMovieClip: MovieClip;
    let mockLayer: Layer;
    let mockCharacter: Character;
    let mockNode: HTMLElement;
    let mockContainer: HTMLDivElement;

    beforeEach(() => {
        vi.clearAllMocks();

        mockContainer = document.createElement("div");
        mockContainer.className = "canvas-container";
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

        const selectedDepths = new Map([[0, [10]]]);
        mockMovieClip = {
            selectedDepths: selectedDepths,
            currentFrame: 1,
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

        it("複数選択時は何もしない (複数のMap entriesがある場合)", () => {
            const selectedDepths = new Map();
            selectedDepths.set(0, [10]);
            selectedDepths.set(1, [20]); // 2つのレイヤーが選択されている
            mockMovieClip.selectedDepths = selectedDepths;

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("layerが存在しない場合は何もしない", () => {
            (mockMovieClip.getLayer as any).mockReturnValue(null);

            execute(mockMovieClip, 50);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
        });

        it("characterが存在しない場合は何もしない", () => {
            (mockLayer.getCharacter as any).mockReturnValue(null);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("nodeが存在しない場合は何もしない", () => {
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(null);

            execute(mockMovieClip, 50);

            expect(mockCharacter.colorTransform[5]).toBe(0);
        });

        it("containerが存在しない場合は何もしない", () => {
            const emptyNode = document.createElement("div");
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(emptyNode);

            execute(mockMovieClip, 50);

            // containerがない場合は早期リターンするのでcolorTransformも更新されない
            expect(mockCharacter.colorTransform[5]).toBe(0);
        });
    });

    describe("green offsetの更新", () => {
        it("green offsetが正しく更新される", () => {
            execute(mockMovieClip, 100);

            expect(mockCharacter.colorTransform[5]).toBe(100);
        });

        it("green offsetが負の値でも正しく更新される", () => {
            execute(mockMovieClip, -50);

            expect(mockCharacter.colorTransform[5]).toBe(-50);
        });

        it("green offsetが小数点の場合は整数に変換される", () => {
            execute(mockMovieClip, 50.7);

            expect(mockCharacter.colorTransform[5]).toBe(50);
        });
    });

    describe("画面への反映", () => {
        it("color-transformプロパティが正しく設定される", () => {
            mockCharacter.colorTransform = [1, 1, 1, 1, 0, 50, 0, 0];

            execute(mockMovieClip, 100);

            // r: 255 * 1 + 0 = 255
            // g: 255 * 1 + 100 = 255 (clamped)
            // b: 255 * 1 + 0 = 255
            expect(mockContainer.style.setProperty).toHaveBeenCalledWith(
                "--color-transform",
                "255 255 255"
            );
        });

        it("multiplierとoffsetを考慮して色が計算される", () => {
            mockCharacter.colorTransform = [0.5, 0.5, 0.5, 1, 50, 50, 50, 0];

            execute(mockMovieClip, 100);

            const r = Math.max(0, Math.min(255, 255 * 0.5 + 50));
            const g = Math.max(0, Math.min(255, 255 * 0.5 + 100));
            const b = Math.max(0, Math.min(255, 255 * 0.5 + 50));

            expect(mockContainer.style.setProperty).toHaveBeenCalledWith(
                "--color-transform",
                `${r} ${g} ${b}`
            );
        });

        it("色の値が0未満にならない", () => {
            mockCharacter.colorTransform = [1, 1, 1, 1, 0, 0, 0, 0];

            execute(mockMovieClip, -300);

            // r: 255 * 1 + 0 = 255
            // g: 255 * 1 + (-300) = -45 => clamped to 0
            // b: 255 * 1 + 0 = 255
            expect(mockContainer.style.setProperty).toHaveBeenCalledWith(
                "--color-transform",
                "255 0 255"
            );
        });

        it("色の値が255を超えない", () => {
            mockCharacter.colorTransform = [1, 1, 1, 1, 255, 255, 255, 0];

            execute(mockMovieClip, 300);

            expect(mockContainer.style.setProperty).toHaveBeenCalledWith(
                "--color-transform",
                "255 255 255"
            );
        });
    });
});
