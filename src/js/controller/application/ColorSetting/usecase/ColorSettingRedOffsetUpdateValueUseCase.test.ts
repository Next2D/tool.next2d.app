import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

const mock$getCurrentWorkSpace = vi.fn();
const mockScreenAreaGetElementFromLayerIdAndDepthService = vi.fn();
const mockExternalCharacter = {
    setRedOffset: vi.fn()
};

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService", () => ({
    execute: (layerId: number, depth: number) => mockScreenAreaGetElementFromLayerIdAndDepthService(layerId, depth)
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: vi.fn().mockImplementation(() => mockExternalCharacter)
}));

vi.mock("@/controller/domain/model/ColorSetting", () => ({
    colorSetting: {
        beforeValue: 0
    }
}));

const { execute } = await import("./ColorSettingRedOffsetUpdateValueUseCase");
const { colorSetting } = await import("@/controller/domain/model/ColorSetting");

describe("ColorSettingRedOffsetUpdateValueUseCase", () => {
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockLayer: Layer;
    let mockCharacter: Character;
    let mockNode: HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();

        colorSetting.beforeValue = 50;

        mockNode = document.createElement("div");

        mockCharacter = {
            colorTransform: [1, 1, 1, 1, 0, 0, 0, 0]
        } as Character;

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
        mockExternalCharacter.setRedOffset.mockResolvedValue(undefined);
    });

    describe("基本動作", () => {
        it("選択中のelementがない場合は何もしない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(50);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("layerがnullの場合は何もしない", async () => {
            mockMovieClip.getLayer = vi.fn().mockReturnValue(null);

            await execute(50);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
        });

        it("characterがnullの場合は何もしない", async () => {
            mockLayer.getCharacter = vi.fn().mockReturnValue(null);

            await execute(50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("nodeがnullの場合は何もしない", async () => {
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(null);

            await execute(50);

            expect(mockExternalCharacter.setRedOffset).not.toHaveBeenCalled();
        });

        it("redOffsetが更新前の値に戻される", async () => {
            colorSetting.beforeValue = 75;

            await execute(50);

            expect(mockCharacter.colorTransform[4]).toBe(75);
        });

        it("setRedOffsetが呼ばれる", async () => {
            await execute(50);

            expect(mockExternalCharacter.setRedOffset).toHaveBeenCalledWith(50);
        });
    });
});
