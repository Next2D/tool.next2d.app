import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const {
    mockScreenAreaCalcSelectedBoundsService,
    mock$getCurrentWorkSpace,
    mockExternalCharacter
} = vi.hoisted(() => {
    return {
        mockScreenAreaCalcSelectedBoundsService: vi.fn(),
        mock$getCurrentWorkSpace: vi.fn(),
        mockExternalCharacter: vi.fn()
    };
});

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService", () => ({
    execute: mockScreenAreaCalcSelectedBoundsService
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mock$getCurrentWorkSpace
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: mockExternalCharacter
}));

import { execute } from "./ExternalAlignStageCenterUseCase";

describe("ExternalAlignStageCenterUseCase", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockExternalCharacterInstance: any;
    let mockStage: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockExternalCharacterInstance = {
            setX: vi.fn().mockResolvedValue(undefined)
        };

        mockExternalCharacter.mockImplementation(function() { return mockExternalCharacterInstance; });

        mockCharacter = {
            x: 100,
            getBounds: vi.fn().mockReturnValue({
                xMin: 50,
                xMax: 150,
                yMin: 0,
                yMax: 100
            })
        };

        mockLayer = {
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        mockMovieClip = {
            selectedDepths: new Map([[0, [1]]]),
            currentFrame: 1,
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };

        mockStage = {
            width: 800,
            height: 600
        };

        mockWorkSpace = {
            scene: mockMovieClip,
            stage: mockStage
        };

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        mockScreenAreaCalcSelectedBoundsService.mockReturnValue({
            xMin: 0,
            xMax: 200,
            yMin: 0,
            yMax: 150
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("早期リターン条件", () => {
        it("選択中のキャラクターがない場合、何も処理しない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(mockWorkSpace, mockMovieClip);

            expect(mockScreenAreaCalcSelectedBoundsService).not.toHaveBeenCalled();
            expect(mockExternalCharacter).not.toHaveBeenCalled();
        });

        it("Boundsがnullの場合、何も処理しない", async () => {
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(null);

            await execute(mockWorkSpace, mockMovieClip);

            expect(mockExternalCharacter).not.toHaveBeenCalled();
        });
    });

    describe("ステージ中央揃え処理", () => {
        it("ステージの中央に合わせて位置が調整される", async () => {
            await execute(mockWorkSpace, mockMovieClip);

            expect(mock$getCurrentWorkSpace).toHaveBeenCalled();
            
            // centerX = stage.width / 2 = 400, characterCenterX = (50 + 150) / 2 = 100
            // dx = 400 + (100 - 100) = 400
            expect(mockExternalCharacterInstance.setX).toHaveBeenCalledWith(400);
        });

        it("複数のキャラクターが処理される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);

            await execute(mockWorkSpace, mockMovieClip);

            expect(mockExternalCharacter).toHaveBeenCalledTimes(2);
        });

        it("異なるステージサイズで動作する", async () => {
            mockStage.width = 1920;

            await execute(mockWorkSpace, mockMovieClip);

            // centerX = 1920 / 2 = 960, dx = 960 + (100 - 100) = 960
            expect(mockExternalCharacterInstance.setX).toHaveBeenCalledWith(960);
        });
    });
});
