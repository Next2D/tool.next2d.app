import { describe, it, expect, beforeEach, vi } from "vitest";

const { mockScreenAreaCalcSelectedBoundsService, mock$getCurrentWorkSpace, mockExternalCharacter } = vi.hoisted(() => ({
    mockScreenAreaCalcSelectedBoundsService: vi.fn(),
    mock$getCurrentWorkSpace: vi.fn(),
    mockExternalCharacter: vi.fn()
}));

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService", () => ({ execute: mockScreenAreaCalcSelectedBoundsService }));
vi.mock("@/core/application/CoreUtil", () => ({ $getCurrentWorkSpace: mock$getCurrentWorkSpace }));
vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({ ExternalCharacter: mockExternalCharacter }));

import { execute } from "./ExternalAlignStageTopUseCase";

describe("ExternalAlignStageTopUseCase", () => {
    let mockWorkSpace: any, mockMovieClip: any, mockLayer: any, mockCharacter: any, mockExternalCharacterInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockExternalCharacterInstance = { setY: vi.fn().mockResolvedValue(undefined) };
        mockExternalCharacter.mockImplementation(function() { return mockExternalCharacterInstance; });
        mockCharacter = { y: 100, getBounds: vi.fn().mockReturnValue({ xMin: 0, xMax: 100, yMin: 80, yMax: 120 }) };
        mockLayer = { getCharacter: vi.fn().mockReturnValue(mockCharacter) };
        mockMovieClip = { selectedDepths: new Map([[0, [1]]]), currentFrame: 1, getLayer: vi.fn().mockReturnValue(mockLayer) };
        mockWorkSpace = { scene: mockMovieClip, stage: { width: 800, height: 600 } };
        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockScreenAreaCalcSelectedBoundsService.mockReturnValue({ xMin: 0, xMax: 200, yMin: 0, yMax: 150 });
    });

    it("選択中のキャラクターがない場合、何も処理しない", async () => {
        mockMovieClip.selectedDepths = new Map();
        await execute(mockWorkSpace, mockMovieClip);
        expect(mockExternalCharacter).not.toHaveBeenCalled();
    });

    it("ステージの上端に合わせて位置が調整される", async () => {
        await execute(mockWorkSpace, mockMovieClip);
        // topY = 0, dy = 0 + (100 - 80) = 20
        expect(mockExternalCharacterInstance.setY).toHaveBeenCalledWith(20);
    });
});
