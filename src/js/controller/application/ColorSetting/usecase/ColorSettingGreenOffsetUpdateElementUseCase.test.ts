import { describe, it, expect, beforeEach, vi } from "vitest";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

const mockViewColorSettingChangeSvgFromGreenOffsetUseCase = vi.fn();

vi.mock("@/view/controller/ColorSetting/usecase/ViewColorSettingChangeSvgFromGreenOffsetUseCase", () => ({
    execute: (character: Character, layer: Layer) => mockViewColorSettingChangeSvgFromGreenOffsetUseCase(character, layer)
}));

const { execute } = await import("./ColorSettingGreenOffsetUpdateElementUseCase");

describe("ColorSettingGreenOffsetUpdateElementUseCase", () => {
    let mockMovieClip: MovieClip;
    let mockLayer: Layer;
    let mockCharacter: Character;

    beforeEach(() => {
        vi.clearAllMocks();

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
            getLayer: vi.fn().mockReturnValue(mockLayer),
            isSingleSelectedOfDisplayObject: vi.fn().mockReturnValue(true)
        } as unknown as MovieClip;
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
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);

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

            expect(mockViewColorSettingChangeSvgFromGreenOffsetUseCase).not.toHaveBeenCalled();
        });
    });

    describe("green offsetの更新", () => {
        it("green offsetが正しく更新される", () => {
            execute(mockMovieClip, 100);

            expect(mockCharacter.colorTransform[5]).toBe(100);
            expect(mockViewColorSettingChangeSvgFromGreenOffsetUseCase).toHaveBeenCalledWith(mockCharacter, mockLayer);
        });

        it("green offsetが負の値でも正しく更新される", () => {
            execute(mockMovieClip, -50);

            expect(mockCharacter.colorTransform[5]).toBe(-50);
            expect(mockViewColorSettingChangeSvgFromGreenOffsetUseCase).toHaveBeenCalledWith(mockCharacter, mockLayer);
        });

        it("green offsetが小数点の場合は整数に変換される", () => {
            execute(mockMovieClip, 50.7);

            expect(mockCharacter.colorTransform[5]).toBe(50);
            expect(mockViewColorSettingChangeSvgFromGreenOffsetUseCase).toHaveBeenCalledWith(mockCharacter, mockLayer);
        });
    });
});
