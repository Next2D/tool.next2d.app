import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

const mock$getCurrentWorkSpace = vi.fn();
const mockScreenAreaGetElementFromLayerIdAndDepthService = vi.fn();
const mockExternalCharacter = {
    setGreenOffset: vi.fn()
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

const { execute } = await import("./ColorSettingGreenOffsetUpdateValueUseCase");
const { colorSetting } = await import("@/controller/domain/model/ColorSetting");

describe("ColorSettingGreenOffsetUpdateValueUseCase", () => {
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
        mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(mockNode);
        mockExternalCharacter.setGreenOffset.mockResolvedValue(undefined);
    });

    describe("基本動作", () => {
        it("選択中のelementがない場合は何もしない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(50);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("layerが存在しない場合は何もしない", async () => {
            (mockMovieClip.getLayer as any).mockReturnValue(null);

            await execute(50);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
        });

        it("characterが存在しない場合は何もしない", async () => {
            (mockLayer.getCharacter as any).mockReturnValue(null);

            await execute(50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("nodeが存在しない場合は何もしない", async () => {
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(null);

            await execute(50);

            expect(mockExternalCharacter.setGreenOffset).not.toHaveBeenCalled();
        });
    });

    describe("green offsetの更新", () => {
        it("green offsetが更新前の値に戻されてから新しい値が設定される", async () => {
            colorSetting.beforeValue = 10;
            mockCharacter.colorTransform[5] = 50;

            await execute(100);

            expect(mockCharacter.colorTransform[5]).toBe(10);
            expect(mockExternalCharacter.setGreenOffset).toHaveBeenCalledWith(100);
        });

        it("ExternalCharacterが正しいパラメータで生成される", async () => {
            const { ExternalCharacter } = await import("@/external/core/domain/model/ExternalCharacter");

            await execute(50);

            expect(ExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
        });

        it("setGreenOffsetが正しい値で呼ばれる", async () => {
            await execute(75);

            expect(mockExternalCharacter.setGreenOffset).toHaveBeenCalledWith(75);
            expect(mockExternalCharacter.setGreenOffset).toHaveBeenCalledTimes(1);
        });

        it("負の値でも正しく処理される", async () => {
            await execute(-100);

            expect(mockExternalCharacter.setGreenOffset).toHaveBeenCalledWith(-100);
        });
    });
});
