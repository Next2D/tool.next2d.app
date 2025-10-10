import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const {
    mockScreenAreaCalcSelectedBoundsService,
    mockExternalCharacter
} = vi.hoisted(() => {
    return {
        mockScreenAreaCalcSelectedBoundsService: vi.fn(),
        mockExternalCharacter: vi.fn()
    };
});

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService", () => ({
    execute: mockScreenAreaCalcSelectedBoundsService
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: mockExternalCharacter
}));

import { execute } from "./ExternalAlignBottomUseCase";

describe("ExternalAlignBottomUseCase", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockExternalCharacterInstance: any;

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

        mockWorkSpace = {
            scene: mockMovieClip
        };

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

    describe("下端揃え処理", () => {
        it("選択範囲の下端に合わせて位置が調整される", async () => {
            await execute(mockWorkSpace, mockMovieClip);

            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
            
            // bottomY = 150, dy = 150 + (100 - 50) = 200
            expect(mockExternalCharacterInstance.setY).toHaveBeenCalledWith(200);
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

        it("複数レイヤーの処理", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [1, [2]]
            ]);
            const mockLayer2 = {
                getCharacter: vi.fn().mockReturnValue(mockCharacter)
            };
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 0 ? mockLayer : mockLayer2;
            });

            await execute(mockWorkSpace, mockMovieClip);

            expect(mockExternalCharacter).toHaveBeenCalledTimes(2);
        });

        it("異なるy座標とBoundsを持つキャラクター", async () => {
            mockCharacter.y = 200;
            mockCharacter.getBounds.mockReturnValue({
                xMin: 0,
                xMax: 100,
                yMin: 50,
                yMax: 150
            });

            await execute(mockWorkSpace, mockMovieClip);

            // bottomY = 150, dy = 150 + (200 - 150) = 200
            expect(mockExternalCharacterInstance.setY).toHaveBeenCalledWith(200);
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
