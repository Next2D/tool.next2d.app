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

import { execute } from "./ExternalAlignMiddleUseCase";

describe("ExternalAlignMiddleUseCase", () => {
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
                yMin: 50,
                yMax: 150
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
            yMax: 200
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

    describe("中間揃え処理", () => {
        it("選択範囲の中間に合わせて位置が調整される", async () => {
            await execute(mockWorkSpace, mockMovieClip);

            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
            
            // middleY = (0 + 200) / 2 = 100, characterMiddleY = (50 + 150) / 2 = 100
            // dy = 100 + (100 - 100) = 100
            expect(mockExternalCharacterInstance.setY).toHaveBeenCalledWith(100);
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
