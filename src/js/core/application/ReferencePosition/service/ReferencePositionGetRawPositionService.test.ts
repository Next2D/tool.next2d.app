import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import type { Character } from "../../../../core/domain/model/Character";
import { $MOVIE_CLIP_TYPE } from "../../../../config/InstanceConfig";

// モック化（vi.hoistedを使用してhoistingの問題を解決）
const { mockGetCurrentWorkSpace } = vi.hoisted(() => {
    return {
        mockGetCurrentWorkSpace: vi.fn()
    };
});

vi.mock("../../CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

import { execute } from "./ReferencePositionGetRawPositionService";

describe("ReferencePositionGetRawPositionService", () => {

    let mockCharacter: Character;
    let mockWorkSpace: any;
    let mockLibrary: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // キャラクターのモック作成
        mockCharacter = {
            libraryId: "test-library-id",
            getRawBounds: vi.fn()
        } as unknown as Character;

        // ライブラリのモック作成
        mockLibrary = {
            type: $MOVIE_CLIP_TYPE
        };

        // ワークスペースのモック作成
        mockWorkSpace = {
            getLibrary: vi.fn().mockReturnValue(mockLibrary)
        };

        // CoreUtilのモック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("正常系", () => {

        beforeEach(() => {
            // 標準的なrawBoundsを設定
            mockCharacter.getRawBounds.mockReturnValue({
                xMin: 10,
                yMin: 20,
                xMax: 110,  // width = 100
                yMax: 70    // height = 50
            });
        });

        test("top-leftの場合、左上角の座標を返す", () => {
            const result = execute("top-left", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 10,  // 0 + rawBounds.xMin
                y: 20   // 0 + rawBounds.yMin
            });
        });

        test("top-centerの場合、上辺中央の座標を返す", () => {
            const result = execute("top-center", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 60,  // width/2 + rawBounds.xMin = 50 + 10
                y: 20   // 0 + rawBounds.yMin
            });
        });

        test("top-rightの場合、右上角の座標を返す", () => {
            const result = execute("top-right", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 110, // width + rawBounds.xMin = 100 + 10
                y: 20   // 0 + rawBounds.yMin
            });
        });

        test("middle-leftの場合、左辺中央の座標を返す", () => {
            const result = execute("middle-left", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 10,  // 0 + rawBounds.xMin
                y: 45   // height/2 + rawBounds.yMin = 25 + 20
            });
        });

        test("middle-centerの場合、中央の座標を返す", () => {
            const result = execute("middle-center", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 60,  // width/2 + rawBounds.xMin = 50 + 10
                y: 45   // height/2 + rawBounds.yMin = 25 + 20
            });
        });

        test("middle-rightの場合、右辺中央の座標を返す", () => {
            const result = execute("middle-right", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 110, // width + rawBounds.xMin = 100 + 10
                y: 45   // height/2 + rawBounds.yMin = 25 + 20
            });
        });

        test("bottom-leftの場合、左下角の座標を返す", () => {
            const result = execute("bottom-left", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 10,  // 0 + rawBounds.xMin
                y: 70   // height + rawBounds.yMin = 50 + 20
            });
        });

        test("bottom-centerの場合、下辺中央の座標を返す", () => {
            const result = execute("bottom-center", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 60,  // width/2 + rawBounds.xMin = 50 + 10
                y: 70   // height + rawBounds.yMin = 50 + 20
            });
        });

        test("bottom-rightの場合、右下角の座標を返す", () => {
            const result = execute("bottom-right", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 110, // width + rawBounds.xMin = 100 + 10
                y: 70   // height + rawBounds.yMin = 50 + 20
            });
        });

        test("負の座標のrawBoundsでも正しく計算される", () => {
            mockCharacter.getRawBounds.mockReturnValue({
                xMin: -50,
                yMin: -30,
                xMax: 50,   // width = 100
                yMax: 20    // height = 50
            });

            const result = execute("middle-center", 0, 0, mockCharacter);

            expect(result).toEqual({
                x: 0,   // width/2 + rawBounds.xMin = 50 + (-50)
                y: -5   // height/2 + rawBounds.yMin = 25 + (-30)
            });
        });

    });

    describe("MOVIE_CLIPタイプ以外の場合", () => {

        beforeEach(() => {
            mockCharacter.getRawBounds.mockReturnValue({
                xMin: 10,
                yMin: 20,
                xMax: 110,
                yMax: 70
            });

            // MOVIE_CLIPタイプ以外に設定
            mockLibrary.type = "OTHER_TYPE";
        });

        test("rawBounds.xMin/yMinが加算されない", () => {
            const result = execute("top-left", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 0,   // rawBounds.xMinが加算されない
                y: 0    // rawBounds.yMinが加算されない
            });
        });

        test("middle-centerでもrawBounds.xMin/yMinが加算されない", () => {
            const result = execute("middle-center", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 50,  // width/2のみ
                y: 25   // height/2のみ
            });
        });

    });

    describe("異常系", () => {

        test("rawBoundsがnullの場合、原点座標を返す", () => {
            mockCharacter.getRawBounds.mockReturnValue(null);

            const result = execute("middle-center", 100, 200, mockCharacter);

            expect(result).toEqual({ x: 0, y: 0 });
        });

        test("rawBoundsがundefinedの場合、原点座標を返す", () => {
            mockCharacter.getRawBounds.mockReturnValue(undefined as any);

            const result = execute("middle-center", 100, 200, mockCharacter);

            expect(result).toEqual({ x: 0, y: 0 });
        });

        test("ライブラリが存在しない場合、rawBounds.xMin/yMinが加算されない", () => {
            mockCharacter.getRawBounds.mockReturnValue({
                xMin: 10,
                yMin: 20,
                xMax: 110,
                yMax: 70
            });

            mockWorkSpace.getLibrary.mockReturnValue(null);

            const result = execute("top-left", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 0,   // rawBounds.xMinが加算されない
                y: 0    // rawBounds.yMinが加算されない
            });
        });

        test("無効なpivot値でもエラーにならない", () => {
            mockCharacter.getRawBounds.mockReturnValue({
                xMin: 10,
                yMin: 20,
                xMax: 110,
                yMax: 70
            });

            const result = execute("invalid-pivot" as any, 100, 200, mockCharacter);

            // 無効なpivotの場合、$getPivotPositionは(0, 0)を返し、
            // MovieClipタイプの場合はrawBounds.xMin, yMinが加算される
            expect(result).toEqual({
                x: 10, // 0 + rawBounds.xMin = 0 + 10
                y: 20  // 0 + rawBounds.yMin = 0 + 20
            });
        });

        test("width/heightが0の場合でも正常に動作する", () => {
            mockCharacter.getRawBounds.mockReturnValue({
                xMin: 50,
                yMin: 50,
                xMax: 50,   // width = 0
                yMax: 50    // height = 0
            });

            const result = execute("middle-center", 100, 200, mockCharacter);

            expect(result).toEqual({
                x: 50,  // width/2 + rawBounds.xMin = 0 + 50
                y: 50   // height/2 + rawBounds.yMin = 0 + 50
            });
        });

    });

    describe("座標計算の検証", () => {

        test("Math.absによる幅・高さ計算が正しく動作する", () => {
            // 逆順のbounds（xMax < xMin, yMax < yMin）
            mockCharacter.getRawBounds.mockReturnValue({
                xMin: 100,
                yMin: 80,
                xMax: 50,   // width = Math.abs(50 - 100) = 50
                yMax: 30    // height = Math.abs(30 - 80) = 50
            });

            const result = execute("middle-center", 0, 0, mockCharacter);

            expect(result).toEqual({
                x: 125, // width/2 + rawBounds.xMin = 25 + 100
                y: 105  // height/2 + rawBounds.yMin = 25 + 80
            });
        });

        test("引数のx, yはdefaultケース以外では使用されない", () => {
            mockCharacter.getRawBounds.mockReturnValue({
                xMin: 0,
                yMin: 0,
                xMax: 100,
                yMax: 100
            });

            const result1 = execute("middle-center", 999, 888, mockCharacter);
            const result2 = execute("middle-center", 0, 0, mockCharacter);

            // x, yの値に関わらず同じ結果になる
            expect(result1).toEqual(result2);
            expect(result1).toEqual({ x: 50, y: 50 });
        });

    });

});