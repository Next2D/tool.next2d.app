import { describe, it, expect } from "vitest";
import { $getPivotPosition } from "./ReferenceSettingUtil";
import type { IPivotType } from "../../../interface/IPivotType";

describe("ReferenceSettingUtil", () => {
    describe("$getPivotPosition", () => {
        const width = 100;
        const height = 200;

        describe("標準的なpivot位置の座標計算", () => {
            it("top-leftの場合は左上角(0, 0)を返す", () => {
                const result = $getPivotPosition("top-left", width, height);
                
                expect(result).toEqual({ x: 0, y: 0 });
            });

            it("top-centerの場合は上辺中央を返す", () => {
                const result = $getPivotPosition("top-center", width, height);
                
                expect(result).toEqual({ x: 50, y: 0 }); // width/2, 0
            });

            it("top-rightの場合は右上角を返す", () => {
                const result = $getPivotPosition("top-right", width, height);
                
                expect(result).toEqual({ x: 100, y: 0 }); // width, 0
            });

            it("middle-leftの場合は左辺中央を返す", () => {
                const result = $getPivotPosition("middle-left", width, height);
                
                expect(result).toEqual({ x: 0, y: 100 }); // 0, height/2
            });

            it("middle-centerの場合は中心点を返す", () => {
                const result = $getPivotPosition("middle-center", width, height);
                
                expect(result).toEqual({ x: 50, y: 100 }); // width/2, height/2
            });

            it("middle-rightの場合は右辺中央を返す", () => {
                const result = $getPivotPosition("middle-right", width, height);
                
                expect(result).toEqual({ x: 100, y: 100 }); // width, height/2
            });

            it("bottom-leftの場合は左下角を返す", () => {
                const result = $getPivotPosition("bottom-left", width, height);
                
                expect(result).toEqual({ x: 0, y: 200 }); // 0, height
            });

            it("bottom-centerの場合は下辺中央を返す", () => {
                const result = $getPivotPosition("bottom-center", width, height);
                
                expect(result).toEqual({ x: 50, y: 200 }); // width/2, height
            });

            it("bottom-rightの場合は右下角を返す", () => {
                const result = $getPivotPosition("bottom-right", width, height);
                
                expect(result).toEqual({ x: 100, y: 200 }); // width, height
            });
        });

        describe("異なるサイズでの座標計算", () => {
            it("正方形の場合の座標計算", () => {
                const size = 60;
                
                expect($getPivotPosition("top-center", size, size))
                    .toEqual({ x: 30, y: 0 });
                expect($getPivotPosition("middle-center", size, size))
                    .toEqual({ x: 30, y: 30 });
                expect($getPivotPosition("bottom-right", size, size))
                    .toEqual({ x: 60, y: 60 });
            });

            it("横長の矩形の場合の座標計算", () => {
                const w = 300;
                const h = 100;
                
                expect($getPivotPosition("top-center", w, h))
                    .toEqual({ x: 150, y: 0 });
                expect($getPivotPosition("middle-center", w, h))
                    .toEqual({ x: 150, y: 50 });
                expect($getPivotPosition("bottom-right", w, h))
                    .toEqual({ x: 300, y: 100 });
            });

            it("縦長の矩形の場合の座標計算", () => {
                const w = 80;
                const h = 240;
                
                expect($getPivotPosition("top-center", w, h))
                    .toEqual({ x: 40, y: 0 });
                expect($getPivotPosition("middle-center", w, h))
                    .toEqual({ x: 40, y: 120 });
                expect($getPivotPosition("bottom-right", w, h))
                    .toEqual({ x: 80, y: 240 });
            });
        });

        describe("エッジケースと境界値", () => {
            it("幅が0の場合の座標計算", () => {
                expect($getPivotPosition("top-center", 0, 100))
                    .toEqual({ x: 0, y: 0 });
                expect($getPivotPosition("middle-center", 0, 100))
                    .toEqual({ x: 0, y: 50 });
                expect($getPivotPosition("bottom-right", 0, 100))
                    .toEqual({ x: 0, y: 100 });
            });

            it("高さが0の場合の座標計算", () => {
                expect($getPivotPosition("middle-left", 100, 0))
                    .toEqual({ x: 0, y: 0 });
                expect($getPivotPosition("middle-center", 100, 0))
                    .toEqual({ x: 50, y: 0 });
                expect($getPivotPosition("bottom-right", 100, 0))
                    .toEqual({ x: 100, y: 0 });
            });

            it("幅と高さが共に0の場合の座標計算", () => {
                expect($getPivotPosition("middle-center", 0, 0))
                    .toEqual({ x: 0, y: 0 });
                expect($getPivotPosition("bottom-right", 0, 0))
                    .toEqual({ x: 0, y: 0 });
            });

            it("負の値の幅と高さの場合の座標計算", () => {
                expect($getPivotPosition("top-center", -100, -50))
                    .toEqual({ x: -50, y: 0 });
                expect($getPivotPosition("middle-center", -100, -50))
                    .toEqual({ x: -50, y: -25 });
                expect($getPivotPosition("bottom-right", -100, -50))
                    .toEqual({ x: -100, y: -50 });
            });
        });

        describe("小数点を含むサイズでの座標計算", () => {
            it("小数点を含む幅と高さの場合の座標計算", () => {
                const w = 123.45;
                const h = 67.89;
                
                expect($getPivotPosition("top-center", w, h))
                    .toEqual({ x: 61.725, y: 0 });
                expect($getPivotPosition("middle-center", w, h))
                    .toEqual({ x: 61.725, y: 33.945 });
                expect($getPivotPosition("bottom-right", w, h))
                    .toEqual({ x: 123.45, y: 67.89 });
            });
        });

        describe("デフォルト値の動作", () => {
            it("不明なpivot値の場合は引数のx, yを使用（デフォルト引数）", () => {
                const result = $getPivotPosition("unknown" as IPivotType, width, height);
                
                expect(result).toEqual({ x: 0, y: 0 }); // デフォルト引数の値
            });

            it("不明なpivot値の場合は指定したx, yを使用", () => {
                const result = $getPivotPosition("unknown" as IPivotType, width, height, 25, 75);
                
                expect(result).toEqual({ x: 25, y: 75 });
            });

            it("nullやundefinedのようなpivot値の場合", () => {
                const result = $getPivotPosition(null as any, width, height, 10, 20);
                
                expect(result).toEqual({ x: 10, y: 20 });
            });
        });

        describe("x, yパラメータの動作確認", () => {
            it("x, yパラメータが正常なpivot値の場合は使用されない", () => {
                const result = $getPivotPosition("middle-center", width, height, 999, 888);
                
                // pivot値が正常なので、x,yパラメータは無視される
                expect(result).toEqual({ x: 50, y: 100 });
            });

            it("x, yパラメータのデフォルト値確認", () => {
                // x, yを指定せずにデフォルト値で呼び出し
                const result = $getPivotPosition("invalid" as IPivotType, width, height);
                
                expect(result).toEqual({ x: 0, y: 0 }); // デフォルト値
            });

            it("x, yパラメータに負の値を指定", () => {
                const result = $getPivotPosition("invalid" as IPivotType, width, height, -10, -20);
                
                expect(result).toEqual({ x: -10, y: -20 });
            });

            it("x, yパラメータに小数点を指定", () => {
                const result = $getPivotPosition("invalid" as IPivotType, width, height, 12.34, 56.78);
                
                expect(result).toEqual({ x: 12.34, y: 56.78 });
            });
        });

        describe("全pivot値の網羅的テスト", () => {
            const testCases: Array<[IPivotType, number, number]> = [
                ["top-left", 0, 0],
                ["top-center", 50, 0],
                ["top-right", 100, 0],
                ["middle-left", 0, 100],
                ["middle-center", 50, 100],
                ["middle-right", 100, 100],
                ["bottom-left", 0, 200],
                ["bottom-center", 50, 200],
                ["bottom-right", 100, 200]
            ];

            testCases.forEach(([pivot, expectedX, expectedY]) => {
                it(`pivot="${pivot}"の場合は(${expectedX}, ${expectedY})を返す`, () => {
                    const result = $getPivotPosition(pivot, width, height);
                    
                    expect(result).toEqual({ x: expectedX, y: expectedY });
                });
            });
        });

        describe("戻り値の型確認", () => {
            it("戻り値はIPosition型のオブジェクトである", () => {
                const result = $getPivotPosition("middle-center", width, height);
                
                expect(result).toHaveProperty("x");
                expect(result).toHaveProperty("y");
                expect(typeof result.x).toBe("number");
                expect(typeof result.y).toBe("number");
            });
        });

        describe("パフォーマンステスト", () => {
            it("大量の呼び出しでもパフォーマンスが安定している", () => {
                const iterations = 10000;
                const start = performance.now();
                
                for (let i = 0; i < iterations; i++) {
                    $getPivotPosition("middle-center", width, height);
                }
                
                const end = performance.now();
                const duration = end - start;
                
                // 10,000回の呼び出しが100ms以内で完了することを期待
                expect(duration).toBeLessThan(100);
            });
        });
    });
});
