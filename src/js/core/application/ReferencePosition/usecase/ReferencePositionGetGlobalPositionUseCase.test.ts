import { MovieClip } from "../../../domain/model/MovieClip";
import { Layer } from "../../../domain/model/Layer";
import { Character } from "../../../domain/model/Character";
import { ReferencePosition } from "../../../domain/model/ReferencePosition";
import { referenceSetting } from "../../../../controller/domain/model/ReferenceSetting";
import type { IPivotType } from "../../../../interface/IPivotType";
import type { IPosition } from "../../../../interface/IPosition";
import type { IBounds } from "../../../../interface/IBounds";
import type { IMovieClipSaveObject } from "../../../../interface/IMovieClipSaveObject";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

// モックの設定（vi.hoistedを使用）
const { 
    mockScreenAreaCalcSelectedBoundsService,
    mockGetConcatenatedMatrix 
} = vi.hoisted(() => {
    return {
        mockScreenAreaCalcSelectedBoundsService: vi.fn(),
        mockGetConcatenatedMatrix: vi.fn(() => new Float32Array([1, 0, 0, 1, 0, 0]))
    };
});

vi.mock("../../../../screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService", () => ({
    execute: mockScreenAreaCalcSelectedBoundsService
}));

vi.mock("../../../../controller/application/TransformSetting/TransformSettingUtil", () => ({
    $getConcatenatedMatrix: mockGetConcatenatedMatrix
}));

import { execute } from "./ReferencePositionGetGlobalPositionUseCase";

describe("ReferencePositionGetGlobalPositionUseCaseTest", () =>
{
    let workSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockLayer: Layer;
    let mockCharacter: Character;
    let mockReferencePosition: ReferencePosition;

    beforeEach(() =>
    {
        workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        // モックオブジェクトの初期化
        mockCharacter = new Character();
        mockReferencePosition = new ReferencePosition(mockCharacter);
        mockLayer = new Layer();
        
        // MovieClipの最小限のsaveObjectを作成
        const mockMovieClipSaveObject: IMovieClipSaveObject = {
            id: 1,
            name: "test",
            type: "container" as const,
            layers: []
        };
        mockMovieClip = new MovieClip(mockMovieClipSaveObject);

        // selectedDepthsを初期化
        mockMovieClip.selectedDepths = new Map();

        // referencePositionの座標を設定
        mockReferencePosition.x = 100;
        mockReferencePosition.y = 200;
        mockCharacter.referencePosition = mockReferencePosition;

        // MovieClipのcurrentFrameを設定
        mockMovieClip.currentFrame = 1;

        // referenceSettingのpivotをリセット
        referenceSetting.pivot = "middle-center";
        referenceSetting.movementX = 0;
        referenceSetting.movementY = 0;

        // workSpaceのscaleを設定
        workSpace.scale = 1;

        // モック関数をリセット
        vi.clearAllMocks();
    });

    it("選択オブジェクトがない場合はnullを返す - Returns null when no objects are selected", () =>
    {
        // selectedDepthsが空の場合
        mockMovieClip.selectedDepths.clear();

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).toBeNull();
    });

    it("単一オブジェクト選択時の座標を返す - Returns coordinates for single object selection", () =>
    {
        // 単一オブジェクト選択の設定
        mockMovieClip.selectedDepths.set(0, [5]);

        // getLayerメソッドをモック
        vi.spyOn(mockMovieClip, 'getLayer').mockReturnValue(mockLayer);

        // getCharacterメソッドをモック
        vi.spyOn(mockLayer, 'getCharacter').mockReturnValue(mockCharacter);

        // isSingleSelectedOfDisplayObjectメソッドをモック
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(true);

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).not.toBeNull();
        expect(result!.x).toBe(0);
        expect(result!.y).toBe(0);
        expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
        expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5);
    });

    it("単一選択でLayerが見つからない場合はnullを返す - Returns null when Layer is not found in single selection", () =>
    {
        mockMovieClip.selectedDepths.set(0, [5]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(true);
        vi.spyOn(mockMovieClip, 'getLayer').mockReturnValue(null);

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).toBeNull();
    });

    it("単一選択でCharacterが見つからない場合はnullを返す - Returns null when Character is not found in single selection", () =>
    {
        mockMovieClip.selectedDepths.set(0, [5]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(true);
        vi.spyOn(mockMovieClip, 'getLayer').mockReturnValue(mockLayer);
        vi.spyOn(mockLayer, 'getCharacter').mockReturnValue(null);

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).toBeNull();
    });

    it("複数選択時のtop-left座標計算 - Top-left coordinate calculation for multiple selection", () =>
    {
        const mockBounds: IBounds = {
            xMin: 10,
            yMin: 20,
            xMax: 110,
            yMax: 120
        };

        // 複数選択の設定
        mockMovieClip.selectedDepths.set(0, [1]);
        mockMovieClip.selectedDepths.set(1, [2]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
        
        mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
        referenceSetting.pivot = "top-left";

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).not.toBeNull();
        expect(result!.x).toBe(10); // bounds.xMin
        expect(result!.y).toBe(20); // bounds.yMin
    });

    it("複数選択時のtop-center座標計算 - Top-center coordinate calculation for multiple selection", () =>
    {
        const mockBounds: IBounds = {
            xMin: 10,
            yMin: 20,
            xMax: 110,
            yMax: 120
        };

        mockMovieClip.selectedDepths.set(0, [1]);
        mockMovieClip.selectedDepths.set(1, [2]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
        
        mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
        referenceSetting.pivot = "top-center";

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).not.toBeNull();
        expect(result!.x).toBe(60); // bounds.xMin + (bounds.xMax - bounds.xMin) / 2
        expect(result!.y).toBe(20); // bounds.yMin
    });

    it("複数選択時のmiddle-center座標計算 - Middle-center coordinate calculation for multiple selection", () =>
    {
        const mockBounds: IBounds = {
            xMin: 10,
            yMin: 20,
            xMax: 110,
            yMax: 120
        };

        mockMovieClip.selectedDepths.set(0, [1]);
        mockMovieClip.selectedDepths.set(1, [2]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
        
        mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
        referenceSetting.pivot = "middle-center";

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).not.toBeNull();
        expect(result!.x).toBe(60); // bounds.xMin + (bounds.xMax - bounds.xMin) / 2
        expect(result!.y).toBe(70); // bounds.yMin + (bounds.yMax - bounds.yMin) / 2
    });

    it("複数選択時のbottom-right座標計算 - Bottom-right coordinate calculation for multiple selection", () =>
    {
        const mockBounds: IBounds = {
            xMin: 10,
            yMin: 20,
            xMax: 110,
            yMax: 120
        };

        mockMovieClip.selectedDepths.set(0, [1]);
        mockMovieClip.selectedDepths.set(1, [2]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
        
        mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
        referenceSetting.pivot = "bottom-right";

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).not.toBeNull();
        expect(result!.x).toBe(110); // bounds.xMin + (bounds.xMax - bounds.xMin)
        expect(result!.y).toBe(120); // bounds.yMin + (bounds.yMax - bounds.yMin)
    });

    it("複数選択時のdefault座標計算 - Default coordinate calculation for multiple selection", () =>
    {
        const mockBounds: IBounds = {
            xMin: 10,
            yMin: 20,
            xMax: 110,
            yMax: 120
        };

        mockMovieClip.selectedDepths.set(0, [1]);
        mockMovieClip.selectedDepths.set(1, [2]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
        
        mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
        referenceSetting.pivot = "invalid" as IPivotType;

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).not.toBeNull();
        // invalidなpivotの場合、$getPivotPositionは(0, 0)を返し、bounds.xMin, yMinが加算される
        expect(result!.x).toBe(10); // 0 + bounds.xMin = 0 + 10
        expect(result!.y).toBe(20); // 0 + bounds.yMin = 0 + 20
    });

    it("複数選択でboundsが取得できない場合はnullを返す - Returns null when bounds cannot be obtained in multiple selection", () =>
    {
        mockMovieClip.selectedDepths.set(0, [1]);
        mockMovieClip.selectedDepths.set(1, [2]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
        
        mockScreenAreaCalcSelectedBoundsService.mockReturnValue(null);

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).toBeNull();
    });

    it("複数選択時の変形行列が適用された座標計算 - Coordinate calculation with transformation matrix applied in multiple selection", () =>
    {
        const mockBounds: IBounds = {
            xMin: 0,
            yMin: 0,
            xMax: 100,
            yMax: 100
        };

        // スケール2倍、平行移動(10, 20)の行列を設定
        mockGetConcatenatedMatrix.mockReturnValue(new Float32Array([2, 0, 0, 2, 10, 20]));

        mockMovieClip.selectedDepths.set(0, [1]);
        mockMovieClip.selectedDepths.set(1, [2]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
        
        mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
        referenceSetting.pivot = "middle-center";

        const result: IPosition | null = execute(workSpace, mockMovieClip);

        expect(result).not.toBeNull();
        // middle-center: x=50, y=50
        // matrix変換は適用されない（複数選択時）
        expect(result!.x).toBe(50);
        expect(result!.y).toBe(50);
    });

    it("全てのpivot位置での座標計算テスト - Coordinate calculation test for all pivot positions", () =>
    {
        const mockBounds: IBounds = {
            xMin: 10,
            yMin: 20,
            xMax: 60,  // width = 50
            yMax: 80   // height = 60
        };

        const testCases: Array<{pivot: IPivotType, expectedX: number, expectedY: number}> = [
            { pivot: "top-left", expectedX: 10, expectedY: 20 },        // (0, 0) + (10, 20)
            { pivot: "top-center", expectedX: 35, expectedY: 20 },      // (25, 0) + (10, 20)
            { pivot: "top-right", expectedX: 60, expectedY: 20 },       // (50, 0) + (10, 20)
            { pivot: "middle-left", expectedX: 10, expectedY: 50 },     // (0, 30) + (10, 20)
            { pivot: "middle-center", expectedX: 35, expectedY: 50 },   // (25, 30) + (10, 20)
            { pivot: "middle-right", expectedX: 60, expectedY: 50 },    // (50, 30) + (10, 20)
            { pivot: "bottom-left", expectedX: 10, expectedY: 80 },     // (0, 60) + (10, 20)
            { pivot: "bottom-center", expectedX: 35, expectedY: 80 },   // (25, 60) + (10, 20)
            { pivot: "bottom-right", expectedX: 60, expectedY: 80 }     // (50, 60) + (10, 20)
        ];

        testCases.forEach(({ pivot, expectedX, expectedY }) => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockMovieClip.selectedDepths.set(1, [2]);
            vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
            
            mockScreenAreaCalcSelectedBoundsService.mockReturnValue(mockBounds);
            referenceSetting.pivot = pivot;

            const result: IPosition | null = execute(workSpace, mockMovieClip);

            expect(result).not.toBeNull();
            expect(result!.x).toBe(expectedX);
            expect(result!.y).toBe(expectedY);
        });
    });
});
