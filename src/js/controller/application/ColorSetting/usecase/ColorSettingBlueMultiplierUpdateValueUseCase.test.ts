import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

const mock$getCurrentWorkSpace = vi.fn();
const mockExternalCharacterSetBlueMultiplier = vi.fn();

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: class {
        constructor() {}
        setBlueMultiplier = mockExternalCharacterSetBlueMultiplier;
    }
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
        colorSetting.beforeValue = 50;

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

        mockWorkSpace = {
            scene: mockMovieClip
        } as WorkSpace;

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockExternalCharacterSetBlueMultiplier.mockResolvedValue(undefined);
    });

    describe("基本動作", () => {
        it("選択中のelementがない場合は何もしない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(75);

            expect(mockExternalCharacterSetBlueMultiplier).not.toHaveBeenCalled();
        });

        it("blueMultiplierが更新される", async () => {
            await execute(75);

            expect(mockExternalCharacterSetBlueMultiplier).toHaveBeenCalledWith(75);
        });

        it("更新前に元の値に戻される", async () => {
            await execute(75);

            expect(mockCharacter.colorTransform[2]).toBe(0.5);
        });
    });
});
