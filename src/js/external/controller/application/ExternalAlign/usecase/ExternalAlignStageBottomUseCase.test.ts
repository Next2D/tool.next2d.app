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

import { execute } from "./ExternalAlignStageBottomUseCase";

describe("ExternalAlignStageBottomUseCase", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockExternalCharacterInstance: any;
    let mockStage: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockExternalCharacterInstance = {
            setY: vi.fn().mockResolvedValue(undefined)
        };

        mockExternalCharacter.mockImplementation(() => mockExternalCharacterInstance);

        mockCharacter = {
            y: 100,
            getBounds: vi.fn().mockReturnValue({
                xMin: 0,
                xMax: 100,
                yMin: 0,
                yMax: 50
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

    describe("ステージ下端揃え処理", () => {
        it("ステージの下端に合わせて位置が調整される", async () => {
            await execute(mockWorkSpace, mockMovieClip);

            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledWith(mockMovieClip);
            expect(mock$getCurrentWorkSpace).toHaveBeenCalled();
            expect(mockExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
            
            // bottomY = stage.height = 600, dy = 600 + (100 - 50) = 650
            expect(mockExternalCharacterInstance.setY).toHaveBeenCalledWith(650);
        });

        it("複数のキャラクターが処理される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);

            await execute(mockWorkSpace, mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacter).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacterInstance.setY).toHaveBeenCalledTimes(2);
        });

        it("レイヤーが見つからない場合はスキップ", async () => {
            mockMovieClip.getLayer.mockReturnValue(null);

            await execute(mockWorkSpace, mockMovieClip);

            expect(mockExternalCharacter).not.toHaveBeenCalled();
        });

        it("キャラクターが見つからない場合はスキップ", async () => {
            mockLayer.getCharacter.mockReturnValue(null);

            await execute(mockWorkSpace, mockMovieClip);

            expect(mockExternalCharacter).not.toHaveBeenCalled();
        });

        it("キャラクターのBoundsがnullの場合はスキップ", async () => {
            mockCharacter.getBounds.mockReturnValue(null);

            await execute(mockWorkSpace, mockMovieClip);

            expect(mockExternalCharacter).not.toHaveBeenCalled();
        });

        it("異なるステージサイズで動作する", async () => {
            mockStage.height = 1080;

            await execute(mockWorkSpace, mockMovieClip);

            // bottomY = 1080, dy = 1080 + (100 - 50) = 1130
            expect(mockExternalCharacterInstance.setY).toHaveBeenCalledWith(1130);
        });
    });

    describe("非同期処理", () => {
        it("setY メソッドが非同期で実行される", async () => {
            let setYCalled = false;
            mockExternalCharacterInstance.setY.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                setYCalled = true;
            });

            await execute(mockWorkSpace, mockMovieClip);

            expect(setYCalled).toBe(true);
        });
    });
});
