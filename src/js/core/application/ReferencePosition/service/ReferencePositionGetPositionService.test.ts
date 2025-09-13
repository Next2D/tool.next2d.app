import { execute } from "./ReferencePositionGetPositionService";
import { Character } from "../../../domain/model/Character";
import type { IPivotType } from "../../../../interface/IPivotType";
import type { IPosition } from "../../../../interface/IPosition";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { describe, expect, it, beforeEach } from "vitest";

describe("ReferencePositionGetPositionServiceTest", () =>
{
    let mockCharacter: Character;

    beforeEach(() =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        // モックCharacterを作成
        mockCharacter = new Character();
        
        // width, height, matrixプロパティを設定
        Object.defineProperty(mockCharacter, 'width', {
            get: () => 100,
            configurable: true
        });
        
        Object.defineProperty(mockCharacter, 'height', {
            get: () => 200,
            configurable: true
        });
        
        // 単位行列を設定
        mockCharacter.matrix.set([1, 0, 0, 1, 0, 0]);
    });

    it("top-left位置の座標変換テスト - Top-left position coordinate transformation test", () =>
    {
        const result: IPosition = execute("top-left", 50, 75, mockCharacter);
        
        // top-left: dx=0, dy=0
        // matrix変換: x = 0*1 + 0*0 + 0 = 0, y = 0*0 + 0*1 + 0 = 0
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it("top-center位置の座標変換テスト - Top-center position coordinate transformation test", () =>
    {
        const result: IPosition = execute("top-center", 50, 75, mockCharacter);
        
        // top-center: dx=width/2=50, dy=0
        // matrix変換: x = 50*1 + 0*0 + 0 = 50, y = 50*0 + 0*1 + 0 = 0
        expect(result.x).toBe(50);
        expect(result.y).toBe(0);
    });

    it("top-right位置の座標変換テスト - Top-right position coordinate transformation test", () =>
    {
        const result: IPosition = execute("top-right", 50, 75, mockCharacter);
        
        // top-right: dx=width=100, dy=0
        // matrix変換: x = 100*1 + 0*0 + 0 = 100, y = 100*0 + 0*1 + 0 = 0
        expect(result.x).toBe(100);
        expect(result.y).toBe(0);
    });

    it("middle-left位置の座標変換テスト - Middle-left position coordinate transformation test", () =>
    {
        const result: IPosition = execute("middle-left", 50, 75, mockCharacter);
        
        // middle-left: dx=0, dy=height/2=100
        // matrix変換: x = 0*1 + 100*0 + 0 = 0, y = 0*0 + 100*1 + 0 = 100
        expect(result.x).toBe(0);
        expect(result.y).toBe(100);
    });

    it("middle-center位置の座標変換テスト - Middle-center position coordinate transformation test", () =>
    {
        const result: IPosition = execute("middle-center", 50, 75, mockCharacter);
        
        // middle-center: dx=width/2=50, dy=height/2=100
        // matrix変換: x = 50*1 + 100*0 + 0 = 50, y = 50*0 + 100*1 + 0 = 100
        expect(result.x).toBe(50);
        expect(result.y).toBe(100);
    });

    it("middle-right位置の座標変換テスト - Middle-right position coordinate transformation test", () =>
    {
        const result: IPosition = execute("middle-right", 50, 75, mockCharacter);
        
        // middle-right: dx=width=100, dy=height/2=100
        // matrix変換: x = 100*1 + 100*0 + 0 = 100, y = 100*0 + 100*1 + 0 = 100
        expect(result.x).toBe(100);
        expect(result.y).toBe(100);
    });

    it("bottom-left位置の座標変換テスト - Bottom-left position coordinate transformation test", () =>
    {
        const result: IPosition = execute("bottom-left", 50, 75, mockCharacter);
        
        // bottom-left: dx=0, dy=height=200
        // matrix変換: x = 0*1 + 200*0 + 0 = 0, y = 0*0 + 200*1 + 0 = 200
        expect(result.x).toBe(0);
        expect(result.y).toBe(200);
    });

    it("bottom-center位置の座標変換テスト - Bottom-center position coordinate transformation test", () =>
    {
        const result: IPosition = execute("bottom-center", 50, 75, mockCharacter);
        
        // bottom-center: dx=width/2=50, dy=height=200
        // matrix変換: x = 50*1 + 200*0 + 0 = 50, y = 50*0 + 200*1 + 0 = 200
        expect(result.x).toBe(50);
        expect(result.y).toBe(200);
    });

    it("bottom-right位置の座標変換テスト - Bottom-right position coordinate transformation test", () =>
    {
        const result: IPosition = execute("bottom-right", 50, 75, mockCharacter);
        
        // bottom-right: dx=width=100, dy=height=200
        // matrix変換: x = 100*1 + 200*0 + 0 = 100, y = 100*0 + 200*1 + 0 = 200
        expect(result.x).toBe(100);
        expect(result.y).toBe(200);
    });

    it("変形行列が適用された場合のテスト - Test with transformation matrix applied", () =>
    {
        // スケール2倍、平行移動(10, 20)の行列を設定
        mockCharacter.matrix.set([2, 0, 0, 2, 10, 20]);
        
        const result: IPosition = execute("middle-center", 0, 0, mockCharacter);
        
        // middle-center: dx=50, dy=100
        // matrix変換: x = 50*2 + 100*0 + 10 = 110, y = 50*0 + 100*2 + 20 = 220
        expect(result.x).toBe(110);
        expect(result.y).toBe(220);
    });

    it("回転行列が適用された場合のテスト - Test with rotation matrix applied", () =>
    {
        // 90度回転の行列を設定 (cos90=0, sin90=1)
        mockCharacter.matrix.set([0, 1, -1, 0, 0, 0]);
        
        const result: IPosition = execute("top-right", 0, 0, mockCharacter);
        
        // top-right: dx=100, dy=0
        // matrix変換: x = 100*0 + 0*(-1) + 0 = 0, y = 100*1 + 0*0 + 0 = 100
        expect(result.x).toBe(0);
        expect(result.y).toBe(100);
    });

    it("入力座標x,yが無視されることの確認テスト - Test that input coordinates x,y are ignored", () =>
    {
        const result1: IPosition = execute("top-left", 0, 0, mockCharacter);
        const result2: IPosition = execute("top-left", 999, 888, mockCharacter);
        
        // 入力座標は無視され、pivotのみで決定される
        expect(result1.x).toBe(result2.x);
        expect(result1.y).toBe(result2.y);
        expect(result1.x).toBe(0);
        expect(result1.y).toBe(0);
    });

    it("defaultケースのテスト - Default case test", () =>
    {
        const result: IPosition = execute("invalid" as IPivotType, 50, 75, mockCharacter);
        
        // defaultケース: dx=x=50, dy=y=75
        // matrix変換: x = 50*1 + 75*0 + 0 = 50, y = 50*0 + 75*1 + 0 = 75
        expect(result.x).toBe(50);
        expect(result.y).toBe(75);
    });

    it("異なるサイズのCharacterでのテスト - Test with different sized Character", () =>
    {
        // 異なるサイズを設定
        Object.defineProperty(mockCharacter, 'width', {
            get: () => 80,
            configurable: true
        });
        
        Object.defineProperty(mockCharacter, 'height', {
            get: () => 60,
            configurable: true
        });

        const result: IPosition = execute("middle-center", 0, 0, mockCharacter);
        
        // middle-center: dx=40, dy=30
        expect(result.x).toBe(40);
        expect(result.y).toBe(30);
    });

    it("複雑な変形行列でのテスト - Test with complex transformation matrix", () =>
    {
        // スケール、回転、平行移動を組み合わせた行列
        mockCharacter.matrix.set([1.5, 0.5, -0.5, 1.5, 25, 30]);
        
        const result: IPosition = execute("bottom-right", 0, 0, mockCharacter);
        
        // bottom-right: dx=100, dy=200
        // matrix変換: x = 100*1.5 + 200*(-0.5) + 25 = 150 - 100 + 25 = 75
        //           y = 100*0.5 + 200*1.5 + 30 = 50 + 300 + 30 = 380
        expect(result.x).toBe(75);
        expect(result.y).toBe(380);
    });
});
