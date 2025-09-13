import { execute } from "./ReferencePositionGetGlobalPositionUseCase";
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

// 必要なモジュールをモック
vi.mock("../../../../screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../../controller/application/TransformSetting/TransformSettingUtil", () => ({
    $getConcatenatedMatrix: vi.fn(() => new Float32Array([1, 0, 0, 1, 0, 0]))
}));

import { execute as screenAreaCalcSelectedBoundsService } from "../../../../screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { $getConcatenatedMatrix } from "../../../../controller/application/TransformSetting/TransformSettingUtil";

describe("ReferencePositionGetGlobalPositionUseCaseTest", () =>
{
    let mockMovieClip: MovieClip;
    let mockLayer: Layer;
    let mockCharacter: Character;
    let mockReferencePosition: ReferencePosition;

    beforeEach(() =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

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

        // referencePositionの座標を設定
        mockReferencePosition.x = 100;
        mockReferencePosition.y = 200;
        mockCharacter.referencePosition = mockReferencePosition;

        // MovieClipのcurrentFrameを設定
        mockMovieClip.currentFrame = 1;

        // referenceSettingのpivotをリセット
        referenceSetting.pivot = "middle-center";

        // モック関数をリセット
        vi.clearAllMocks();
    });

    it("選択オブジェクトがない場合はnullを返す - Returns null when no objects are selected", () =>
    {
        // selectedDepthsが空の場合
        mockMovieClip.selectedDepths.clear();

        const result: IPosition | null = execute(mockMovieClip);

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

        const result: IPosition | null = execute(mockMovieClip);

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

        const result: IPosition | null = execute(mockMovieClip);

        expect(result).toBeNull();
    });

    it("単一選択でCharacterが見つからない場合はnullを返す - Returns null when Character is not found in single selection", () =>
    {
        mockMovieClip.selectedDepths.set(0, [5]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(true);
        vi.spyOn(mockMovieClip, 'getLayer').mockReturnValue(mockLayer);
        vi.spyOn(mockLayer, 'getCharacter').mockReturnValue(null);

        const result: IPosition | null = execute(mockMovieClip);

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
        
        (screenAreaCalcSelectedBoundsService as any).mockReturnValue(mockBounds);
        referenceSetting.pivot = "top-left";

        const result: IPosition | null = execute(mockMovieClip);

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
        
        (screenAreaCalcSelectedBoundsService as any).mockReturnValue(mockBounds);
        referenceSetting.pivot = "top-center";

        const result: IPosition | null = execute(mockMovieClip);

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
        
        (screenAreaCalcSelectedBoundsService as any).mockReturnValue(mockBounds);
        referenceSetting.pivot = "middle-center";

        const result: IPosition | null = execute(mockMovieClip);

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
        
        (screenAreaCalcSelectedBoundsService as any).mockReturnValue(mockBounds);
        referenceSetting.pivot = "bottom-right";

        const result: IPosition | null = execute(mockMovieClip);

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
        
        (screenAreaCalcSelectedBoundsService as any).mockReturnValue(mockBounds);
        referenceSetting.pivot = "invalid" as IPivotType;

        const result: IPosition | null = execute(mockMovieClip);

        expect(result).not.toBeNull();
        expect(result!.x).toBe(60); // middle-center: bounds.xMin + (bounds.xMax - bounds.xMin) / 2
        expect(result!.y).toBe(70); // middle-center: bounds.yMin + (bounds.yMax - bounds.yMin) / 2
    });

    it("複数選択でboundsが取得できない場合はnullを返す - Returns null when bounds cannot be obtained in multiple selection", () =>
    {
        mockMovieClip.selectedDepths.set(0, [1]);
        mockMovieClip.selectedDepths.set(1, [2]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
        
        (screenAreaCalcSelectedBoundsService as any).mockReturnValue(null);

        const result: IPosition | null = execute(mockMovieClip);

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
        ($getConcatenatedMatrix as any).mockReturnValue(new Float32Array([2, 0, 0, 2, 10, 20]));

        mockMovieClip.selectedDepths.set(0, [1]);
        mockMovieClip.selectedDepths.set(1, [2]);
        vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
        
        (screenAreaCalcSelectedBoundsService as any).mockReturnValue(mockBounds);
        referenceSetting.pivot = "middle-center";

        const result: IPosition | null = execute(mockMovieClip);

        expect(result).not.toBeNull();
        // middle-center: x=50, y=50
        // matrix変換: x = 50*2 + 50*0 + 10 = 110, y = 50*0 + 50*2 + 20 = 120
        expect(result!.x).toBe(110);
        expect(result!.y).toBe(120);
    });

    it("全てのpivot位置での座標計算テスト - Coordinate calculation test for all pivot positions", () =>
    {
        const mockBounds: IBounds = {
            xMin: 10,
            yMin: 20,
            xMax: 60,
            yMax: 80
        };

        const testCases: Array<{pivot: IPivotType, expectedX: number, expectedY: number}> = [
            { pivot: "top-left", expectedX: 20, expectedY: 40 },
            { pivot: "top-center", expectedX: 70, expectedY: 40 },
            { pivot: "top-right", expectedX: 120, expectedY: 40 },
            { pivot: "middle-left", expectedX: 20, expectedY: 100 },
            { pivot: "middle-center", expectedX: 70, expectedY: 100 },
            { pivot: "middle-right", expectedX: 120, expectedY: 100 },
            { pivot: "bottom-left", expectedX: 20, expectedY: 160 },
            { pivot: "bottom-center", expectedX: 70, expectedY: 160 },
            { pivot: "bottom-right", expectedX: 120, expectedY: 160 }
        ];

        testCases.forEach(({ pivot, expectedX, expectedY }) => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockMovieClip.selectedDepths.set(1, [2]);
            vi.spyOn(mockMovieClip, 'isSingleSelectedOfDisplayObject').mockReturnValue(false);
            
            (screenAreaCalcSelectedBoundsService as any).mockReturnValue(mockBounds);
            referenceSetting.pivot = pivot;

            const result: IPosition | null = execute(mockMovieClip);

            expect(result).not.toBeNull();
            expect(result!.x).toBe(expectedX);
            expect(result!.y).toBe(expectedY);
        });
    });
});
