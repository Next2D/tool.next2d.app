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

import { execute } from "./ExternalAlignRightUseCase";

describe("ExternalAlignRightUseCase", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockExternalCharacterInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockExternalCharacterInstance = {
            setX: vi.fn().mockResolvedValue(undefined)
        };

        mockExternalCharacter.mockImplementation(function() { return mockExternalCharacterInstance; });

        mockCharacter = {
            x: 100,
            getBounds: vi.fn().mockReturnValue({
                xMin: 80,
                xMax: 120,
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

        mockWorkSpace = {
            scene: mockMovieClip
        };

        mockScreenAreaCalcSelectedBoundsService.mockReturnValue({
            xMin: 50,
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

    describe("右端揃え処理", () => {
        it("選択範囲の右端に合わせて位置が調整される", async () => {
            await execute(mockWorkSpace, mockMovieClip);

            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
            
            // rightX = 200, dx = 200 + (100 - 120) = 180
            expect(mockExternalCharacterInstance.setX).toHaveBeenCalledWith(180);
        });

        it("複数のキャラクターが処理される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);

            await execute(mockWorkSpace, mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacter).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacterInstance.setX).toHaveBeenCalledTimes(2);
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
    });

    describe("非同期処理", () => {
        it("setX メソッドが非同期で実行される", async () => {
            let setXCalled = false;
            mockExternalCharacterInstance.setX.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                setXCalled = true;
            });

            await execute(mockWorkSpace, mockMovieClip);

            expect(setXCalled).toBe(true);
        });
    });
});
