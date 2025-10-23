import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

const mock$getCurrentWorkSpace = vi.fn();
const mockExternalCharacter = {
    setBlueMultiplier: vi.fn()
};

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: vi.fn().mockImplementation(() => mockExternalCharacter)
}));

const { execute } = await import("./ColorSettingBlueMultiplierUpdateValueUseCase");
const { colorSetting } = await import("@/controller/domain/model/ColorSetting");

describe("ColorSettingBlueMultiplierUpdateValueUseCase", () => {
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockLayer: Layer;
    let mockCharacter: Character;

    beforeEach(() => {
        vi.clearAllMocks();
        colorSetting.beforeValue = 0;

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

        mockWorkSpace = {
            scene: mockMovieClip
        } as unknown as WorkSpace;

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockExternalCharacter.setBlueMultiplier.mockResolvedValue(undefined);
    });

    describe("基本動作", () => {
        it("選択中のelementがない場合は何もしない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(50);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("setBlueMultiplierが正しい値で呼ばれる", async () => {
            await execute(75);

            expect(mockExternalCharacter.setBlueMultiplier).toHaveBeenCalledWith(75);
        });

        it("blueが更新前の値に戻されてから新しい値が設定される", async () => {
            colorSetting.beforeValue = 50;
            mockCharacter.colorTransform[2] = 0.75;

            await execute(100);

            expect(mockCharacter.colorTransform[2]).toBe(0.5);
            expect(mockExternalCharacter.setBlueMultiplier).toHaveBeenCalledWith(100);
        });
    });
});
