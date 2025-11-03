import { describe, it, expect, beforeEach, vi } from "vitest";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

const mockViewColorSettingChangeSvgFromRedMultiplierUseCase = vi.fn();

vi.mock("@/view/controller/ColorSetting/usecase/ViewColorSettingChangeSvgFromRedMultiplierUseCase", () => ({
    execute: (character: Character, layer: Layer) => mockViewColorSettingChangeSvgFromRedMultiplierUseCase(character, layer)
}));

const { execute } = await import("./ColorSettingRedMultiplierUpdateElementUseCase");

describe("ColorSettingRedMultiplierUpdateElementUseCase", () => {
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

        const selectedDepths = new Map([[1, [10]]]);
        mockMovieClip = {
            selectedDepths: selectedDepths,
            currentFrame: 0,
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

        it("redMultiplierが正しく更新される", () => {
            execute(mockMovieClip, 50);

            expect(mockCharacter.colorTransform[0]).toBe(0.5);
            expect(mockViewColorSettingChangeSvgFromRedMultiplierUseCase).toHaveBeenCalledWith(mockCharacter, mockLayer);
        });
    });
});
