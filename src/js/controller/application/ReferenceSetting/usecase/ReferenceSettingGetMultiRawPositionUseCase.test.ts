import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ReferenceSettingGetMultiRawPositionUseCase";
import type { MovieClip } from "../../../../core/domain/model/MovieClip";
import type { IPosition } from "../../../../interface/IPosition";

// モックの設定
vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: {
        pivot: "middle-center"
    }
}));

vi.mock("../ReferenceSettingUtil", () => ({
    $getPivotPosition: vi.fn()
}));

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService", () => ({
    execute: vi.fn()
}));

describe("ReferenceSettingGetMultiRawPositionUseCase", () => {

    let mockMovieClip: MovieClip;
    let mockGetPivotPosition: any;
    let mockScreenAreaCalcSelectedBoundsService: any;
    let mockReferenceSetting: any;

    beforeEach(async () => {
        // モックされた関数を取得
        const { $getPivotPosition } = await import("../ReferenceSettingUtil");
        const { execute: screenAreaService } = await import("../../../../screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService");
        const { referenceSetting } = await import("../../../../controller/domain/model/ReferenceSetting");

        mockGetPivotPosition = vi.mocked($getPivotPosition);
        mockScreenAreaCalcSelectedBoundsService = vi.mocked(screenAreaService);
        mockReferenceSetting = referenceSetting;

        // MovieClipのモック作成
        mockMovieClip = {
            selectedDepths: new Map<number, number[]>()
        } as unknown as MovieClip;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("正常系", () => {

        test("選択されたオブジェクトの中心点座標が正しく取得される", () => {
            // 選択されたDepthを設定
            mockMovieClip.selectedDepths.set(0, [1, 2, 3]);

            // boundsのモック設定
            const mockBounds = {
                xMin: 10,
                yMin: 20,
                xMax: 110,  // width = 100
                yMax: 70    // height = 50
            };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);

            // pivot位置のモック設定
            const mockPivotPosition: IPosition = { x: 50, y: 25 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result).toEqual({ x: 50, y: 25 });
            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockGetPivotPosition).toHaveBeenCalledWith(
                mockReferenceSetting.pivot,
                100, // width
                50   // height
            );
        });

        test("異なるboundsサイズでも正しく計算される", () => {
            mockMovieClip.selectedDepths.set(0, [5]);

            // 大きなbounds
            const mockBounds = {
                xMin: 0,
                yMin: 0,
                xMax: 200,  // width = 200
                yMax: 150   // height = 150
            };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);

            const mockPivotPosition: IPosition = { x: 100, y: 75 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result).toEqual({ x: 100, y: 75 });
            expect(mockGetPivotPosition).toHaveBeenCalledWith(
                mockReferenceSetting.pivot,
                200, // width
                150  // height
            );
        });

        test("負の座標のboundsでも正しく計算される", () => {
            mockMovieClip.selectedDepths.set(0, [10]);

            // 負の座標を含むbounds
            const mockBounds = {
                xMin: -50,
                yMin: -30,
                xMax: 50,   // width = Math.abs(50 - (-50)) = 100
                yMax: 20    // height = Math.abs(20 - (-30)) = 50
            };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);

            const mockPivotPosition: IPosition = { x: 0, y: -5 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result).toEqual({ x: 0, y: -5 });
            expect(mockGetPivotPosition).toHaveBeenCalledWith(
                mockReferenceSetting.pivot,
                100, // width
                50   // height
            );
        });

        test("小数点を含む座標が返される場合", () => {
            mockMovieClip.selectedDepths.set(0, [1]);

            const mockBounds = {
                xMin: 10.5,
                yMin: 20.3,
                xMax: 110.7,  // width = 100.2
                yMax: 70.8    // height = 50.5
            };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);

            const mockPivotPosition: IPosition = { x: 55.1, y: 45.25 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result).toEqual({ x: 55.1, y: 45.25 });
            expect(mockGetPivotPosition).toHaveBeenCalledWith(
                mockReferenceSetting.pivot,
                100.2, // width (計算結果)
                50.5   // height
            );
        });

    });

    describe("異常系", () => {

        test("selectedDepthsが空の場合、nullを返す", () => {
            mockMovieClip.selectedDepths.clear();

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
            expect(mockScreenAreaCalcSelectedBoundsService).not.toHaveBeenCalled();
            expect(mockGetPivotPosition).not.toHaveBeenCalled();
        });

        test("selectedDepthsのsizeが0の場合、nullを返す", () => {
            mockMovieClip.selectedDepths.clear();

            // sizeが確実に0になることを確認
            expect(mockMovieClip.selectedDepths.size).toBe(0);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });

        test("boundsがnullの場合、nullを返す", () => {
            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(null);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockGetPivotPosition).not.toHaveBeenCalled();
        });

        test("boundsがundefinedの場合、nullを返す", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(undefined);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });

    });

    describe("Math.absの動作確認", () => {

        test("逆順のbounds（xMax < xMin）でも正しくwidthが計算される", () => {
            mockMovieClip.selectedDepths.set(0, [1]);

            const mockBounds = {
                xMin: 100,
                yMin: 50,
                xMax: 50,   // width = Math.abs(50 - 100) = 50
                yMax: 20    // height = Math.abs(20 - 50) = 30
            };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);

            const mockPivotPosition: IPosition = { x: 25, y: 15 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result).toEqual({ x: 25, y: 15 });
            expect(mockGetPivotPosition).toHaveBeenCalledWith(
                mockReferenceSetting.pivot,
                50, // Math.abs(50 - 100)
                30  // Math.abs(20 - 50)
            );
        });

        test("width/heightが0の場合でも動作する", () => {
            mockMovieClip.selectedDepths.set(0, [1]);

            const mockBounds = {
                xMin: 50,
                yMin: 30,
                xMax: 50,   // width = 0
                yMax: 30    // height = 0
            };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);

            const mockPivotPosition: IPosition = { x: 0, y: 0 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result).toEqual({ x: 0, y: 0 });
            expect(mockGetPivotPosition).toHaveBeenCalledWith(
                mockReferenceSetting.pivot,
                0, // width
                0  // height
            );
        });

    });

    describe("依存関係の呼び出し確認", () => {

        test("ScreenAreaCalcSelectedBoundsServiceが正しい引数で呼ばれる", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            
            const mockBounds = { xMin: 0, yMin: 0, xMax: 100, yMax: 100 };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
            
            const mockPivotPosition: IPosition = { x: 50, y: 50 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            execute(mockMovieClip);

            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledTimes(1);
            expect(mockScreenAreaCalcSelectedBoundsService).toHaveBeenCalledWith(mockMovieClip);
        });

        test("$getPivotPositionが正しい引数で呼ばれる", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            
            const mockBounds = { xMin: 10, yMin: 20, xMax: 60, yMax: 80 };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
            
            const mockPivotPosition: IPosition = { x: 35, y: 50 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            // referenceSettingのpivotを変更してテスト
            mockReferenceSetting.pivot = "top-left";

            execute(mockMovieClip);

            expect(mockGetPivotPosition).toHaveBeenCalledTimes(1);
            expect(mockGetPivotPosition).toHaveBeenCalledWith(
                "top-left", // referenceSetting.pivot
                50,         // width = Math.abs(60 - 10)
                60          // height = Math.abs(80 - 20)
            );
        });

    });

    describe("戻り値の形式確認", () => {

        test("戻り値がIPosition形式で返される", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            
            const mockBounds = { xMin: 0, yMin: 0, xMax: 100, yMax: 100 };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
            
            const mockPivotPosition: IPosition = { x: 50, y: 50 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result).toHaveProperty("x");
            expect(result).toHaveProperty("y");
            expect(typeof result?.x).toBe("number");
            expect(typeof result?.y).toBe("number");
        });

        test("戻り値のx,yプロパティが$getPivotPositionの結果と同じ", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            
            const mockBounds = { xMin: 0, yMin: 0, xMax: 100, yMax: 100 };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
            
            const mockPivotPosition: IPosition = { x: 123.45, y: 678.90 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result?.x).toBe(mockPivotPosition.x);
            expect(result?.y).toBe(mockPivotPosition.y);
        });

    });

    describe("selectedDepthsの様々なサイズでのテスト", () => {

        test("selectedDepthsに1つの要素がある場合", () => {
            mockMovieClip.selectedDepths.set(0, [5]);
            
            const mockBounds = { xMin: 0, yMin: 0, xMax: 50, yMax: 50 };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
            
            const mockPivotPosition: IPosition = { x: 25, y: 25 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result).toEqual({ x: 25, y: 25 });
        });

        test("selectedDepthsに複数の要素がある場合", () => {
            mockMovieClip.selectedDepths.set(0, [1, 3, 5, 7, 9]);
            
            const mockBounds = { xMin: 0, yMin: 0, xMax: 200, yMax: 150 };
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
            
            const mockPivotPosition: IPosition = { x: 100, y: 75 };
            mockGetPivotPosition.mockReturnValue(mockPivotPosition);

            const result = execute(mockMovieClip);

            expect(result).toEqual({ x: 100, y: 75 });
        });

    });

});