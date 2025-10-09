import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

const mock$getCurrentWorkSpace = vi.fn();
const mockScreenAreaGetElementFromLayerIdAndDepthService = vi.fn();
const mockExternalCharacterSetBlueOffset = vi.fn();

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService", () => ({
    execute: (layerId: number, depth: number) => mockScreenAreaGetElementFromLayerIdAndDepthService(layerId, depth)
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: class {
        constructor() {}
        setBlueOffset = mockExternalCharacterSetBlueOffset;
    }
}));

const { execute } = await import("./ColorSettingBlueOffsetUpdateValueUseCase");
const { colorSetting } = await import("@/controller/domain/model/ColorSetting");

describe("ColorSettingBlueOffsetUpdateValueUseCase", () => {
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockLayer: Layer;
    let mockCharacter: Character;
    let mockNode: HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();
        colorSetting.beforeValue = 0;

        mockNode = document.createElement("div");

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
        mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(mockNode);
        mockExternalCharacterSetBlueOffset.mockResolvedValue(undefined);
    });

    describe("基本動作", () => {
        it("選択中のelementがない場合は何もしない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(50);

            expect(mockExternalCharacterSetBlueOffset).not.toHaveBeenCalled();
        });

        it("blueOffsetが更新される", async () => {
            await execute(50);

            expect(mockExternalCharacterSetBlueOffset).toHaveBeenCalledWith(50);
        });

        it("更新前に元の値に戻される", async () => {
            colorSetting.beforeValue = 25;

            await execute(50);

            expect(mockCharacter.colorTransform[6]).toBe(25);
        });
    });
});
