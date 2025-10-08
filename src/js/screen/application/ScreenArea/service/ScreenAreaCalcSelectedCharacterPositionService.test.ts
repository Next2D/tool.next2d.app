import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ScreenAreaCalcSelectedCharacterPositionService";

describe("ScreenAreaCalcSelectedCharacterPositionService", () => {
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Character モック
        mockCharacter = {
            id: "character-1",
            x: 100,
            y: 150
        };

        // Layer モック
        mockLayer = {
            id: "layer-1",
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        // MovieClip モック
        mockMovieClip = {
            currentFrame: 1,
            selectedDepths: new Map(),
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("正常系", () => {
        it("単一キャラクターの位置を正しく計算する", () => {
            mockMovieClip.selectedDepths.set(0, [1]);

            const result = execute(mockMovieClip);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(result).toEqual({
                x: 100,
                y: 150
            });
        });

        it("複数キャラクターの最小位置を計算する", () => {
            const character1 = { x: 100, y: 150 };
            const character2 = { x: 50, y: 200 };
            const character3 = { x: 150, y: 75 };

            mockMovieClip.selectedDepths.set(0, [1, 2, 3]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                switch (depth) {
                    case 1: return character1;
                    case 2: return character2;
                    case 3: return character3;
                    default: return null;
                }
            });

            const result = execute(mockMovieClip);

            expect(result).toEqual({
                x: 50,  // Math.min(100, 50, 150)
                y: 75   // Math.min(150, 200, 75)
            });
        });

        it("複数レイヤーの複数キャラクターから最小位置を計算する", () => {
            const layer1Character1 = { x: 100, y: 100 };
            const layer1Character2 = { x: 80, y: 120 };
            const layer2Character1 = { x: 60, y: 140 };

            const layer1 = {
                getCharacter: vi.fn().mockImplementation((frame: number, depth: number) => {
                    return depth === 1 ? layer1Character1 : layer1Character2;
                })
            };
            const layer2 = {
                getCharacter: vi.fn().mockReturnValue(layer2Character1)
            };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockMovieClip.selectedDepths.set(1, [1]);
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 0 ? layer1 : layer2;
            });

            const result = execute(mockMovieClip);

            expect(result).toEqual({
                x: 60,  // Math.min(100, 80, 60)
                y: 100  // Math.min(100, 120, 140)
            });
        });

        it("異なるフレームで正しく動作する", () => {
            mockMovieClip.currentFrame = 5;
            mockMovieClip.selectedDepths.set(0, [1]);

            execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(5, 1);
        });

        it("負の座標値も正しく処理する", () => {
            const character1 = { x: -50, y: 100 };
            const character2 = { x: 50, y: -75 };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? character1 : character2;
            });

            const result = execute(mockMovieClip);

            expect(result).toEqual({
                x: -50, // Math.min(-50, 50)
                y: -75  // Math.min(100, -75)
            });
        });

        it("0座標値を正しく処理する", () => {
            const character1 = { x: 0, y: 100 };
            const character2 = { x: 50, y: 0 };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? character1 : character2;
            });

            const result = execute(mockMovieClip);

            expect(result).toEqual({
                x: 0,   // Math.min(0, 50)
                y: 0    // Math.min(100, 0)
            });
        });

        it("小数点座標も正しく処理する", () => {
            const character1 = { x: 10.5, y: 20.7 };
            const character2 = { x: 10.3, y: 20.9 };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? character1 : character2;
            });

            const result = execute(mockMovieClip);

            expect(result).toEqual({
                x: 10.3, // Math.min(10.5, 10.3)
                y: 20.7  // Math.min(20.7, 20.9)
            });
        });
    });

    describe("早期リターン条件", () => {
        it("選択されたDepthsが空の場合はnullを返す", () => {
            // selectedDepths が空
            const result = execute(mockMovieClip);

            expect(result).toBeNull();
            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("selectedDepthsのサイズが0の場合はnullを返す", () => {
            mockMovieClip.selectedDepths = new Map();

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });
    });

    describe("レイヤーの存在確認", () => {
        it("レイヤーが存在しない場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockMovieClip.selectedDepths.set(1, [2]); // レイヤー1は存在しない
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 0 ? mockLayer : null;
            });

            const result = execute(mockMovieClip);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(1);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(result).toEqual({
                x: 100,
                y: 150
            });
        });

        it("レイヤーがundefinedの場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockMovieClip.getLayer.mockReturnValue(undefined);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });

        it("すべてのレイヤーが存在しない場合はnullを返す", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockMovieClip.selectedDepths.set(1, [2]);
            mockMovieClip.getLayer.mockReturnValue(null);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });
    });

    describe("キャラクターの存在確認", () => {
        it("キャラクターが存在しない場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? mockCharacter : null; // depth 2 は存在しない
            });

            const result = execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 2);
            expect(result).toEqual({
                x: 100,
                y: 150
            });
        });

        it("キャラクターがundefinedの場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.getCharacter.mockReturnValue(undefined);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });

        it("すべてのキャラクターが存在しない場合はnullを返す", () => {
            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockReturnValue(null);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });

        it("一部のキャラクターが存在しない場合、存在するもののみで計算する", () => {
            const character1 = { x: 100, y: 150 };
            const character3 = { x: 50, y: 200 };

            mockMovieClip.selectedDepths.set(0, [1, 2, 3]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                switch (depth) {
                    case 1: return character1;
                    case 2: return null; // 存在しない
                    case 3: return character3;
                    default: return null;
                }
            });

            const result = execute(mockMovieClip);

            expect(result).toEqual({
                x: 50,  // Math.min(100, 50)
                y: 150  // Math.min(150, 200)
            });
        });
    });

    describe("Number.MAX_VALUE の確認", () => {
        it("位置が更新されない場合はnullを返す", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.getCharacter.mockReturnValue(null);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });

        it("x座標のみが更新されない場合は{x: NaN, y: value}を返す", () => {
            // xがundefinedの場合、Math.min(Number.MAX_VALUE, undefined)はNaNになる
            const characterWithoutX = { y: 100 };
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.getCharacter.mockReturnValue(characterWithoutX);

            const result = execute(mockMovieClip);

            // 実装ではNaNをそのまま返す（厳密等価比較でNumber.MAX_VALUEとは一致しない）
            expect(result).not.toBeNull();
            expect(result?.x).toBeNaN();
            expect(result?.y).toBe(100);
        });

        it("y座標のみが更新されない場合は{x: value, y: NaN}を返す", () => {
            const characterWithoutY = { x: 100 };
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.getCharacter.mockReturnValue(characterWithoutY);

            const result = execute(mockMovieClip);

            // 実装ではNaNをそのまま返す
            expect(result).not.toBeNull();
            expect(result?.x).toBe(100);
            expect(result?.y).toBeNaN();
        });
    });

    describe("複雑な選択パターン", () => {
        it("複数レイヤーの複数深度で一部が除外される場合", () => {
            const layer1Character1 = { x: 100, y: 100 };
            const layer1Character2 = { x: 80, y: 120 };
            const layer3Character1 = { x: 60, y: 140 };

            const layer1 = {
                getCharacter: vi.fn().mockImplementation((frame: number, depth: number) => {
                    return depth === 1 ? layer1Character1 : layer1Character2;
                })
            };
            const layer3 = {
                getCharacter: vi.fn().mockReturnValue(layer3Character1)
            };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockMovieClip.selectedDepths.set(1, [3]); // レイヤー1は存在しない
            mockMovieClip.selectedDepths.set(2, [4]); // レイヤー2は存在しない
            mockMovieClip.selectedDepths.set(3, [1]);

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 0: return layer1;
                    case 1: return null; // 存在しない
                    case 2: return null; // 存在しない
                    case 3: return layer3;
                    default: return null;
                }
            });

            const result = execute(mockMovieClip);

            // レイヤー0の2個 + レイヤー3の1個 = 3個のキャラクター位置から最小値
            expect(result).toEqual({
                x: 60,  // Math.min(100, 80, 60)
                y: 100  // Math.min(100, 120, 140)
            });
        });

        it("空の深度配列を持つレイヤーは処理されない", () => {
            mockMovieClip.selectedDepths.set(0, []); // 空配列
            mockMovieClip.selectedDepths.set(1, [1]); // 正常

            const layer2 = {
                getCharacter: vi.fn().mockReturnValue({ x: 50, y: 75 })
            };

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 0 ? mockLayer : layer2;
            });

            const result = execute(mockMovieClip);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(layer2.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(result).toEqual({
                x: 50,
                y: 75
            });
        });

        it("深度が0のキャラクターも正しく処理される", () => {
            mockMovieClip.selectedDepths.set(0, [0]);

            execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 0);
        });

        it("負の深度値も処理される", () => {
            mockMovieClip.selectedDepths.set(0, [-1]);

            execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, -1);
        });
    });

    describe("極値テスト", () => {
        it("非常に大きな座標値を正しく処理する", () => {
            const character1 = { x: Number.MAX_SAFE_INTEGER, y: 100 };
            const character2 = { x: 50, y: Number.MAX_SAFE_INTEGER };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? character1 : character2;
            });

            const result = execute(mockMovieClip);

            expect(result).toEqual({
                x: 50,  // Math.min(Number.MAX_SAFE_INTEGER, 50)
                y: 100  // Math.min(100, Number.MAX_SAFE_INTEGER)
            });
        });

        it("非常に小さな座標値を正しく処理する", () => {
            const character1 = { x: Number.MIN_SAFE_INTEGER, y: 100 };
            const character2 = { x: 50, y: Number.MIN_SAFE_INTEGER };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? character1 : character2;
            });

            const result = execute(mockMovieClip);

            expect(result).toEqual({
                x: Number.MIN_SAFE_INTEGER, // Math.min(Number.MIN_SAFE_INTEGER, 50)
                y: Number.MIN_SAFE_INTEGER  // Math.min(100, Number.MIN_SAFE_INTEGER)
            });
        });

        it("Infinityの座標値を含む場合", () => {
            const character1 = { x: Infinity, y: 100 };
            const character2 = { x: 50, y: -Infinity };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? character1 : character2;
            });

            const result = execute(mockMovieClip);

            expect(result).toEqual({
                x: 50,        // Math.min(Infinity, 50)
                y: -Infinity  // Math.min(100, -Infinity)
            });
        });
    });

    describe("エラーハンドリング", () => {
        it("getLayerでエラーが発生した場合", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockMovieClip.getLayer.mockImplementation(() => {
                throw new Error("getLayer failed");
            });

            expect(() => execute(mockMovieClip)).toThrow("getLayer failed");
        });

        it("getCharacterでエラーが発生した場合", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.getCharacter.mockImplementation(() => {
                throw new Error("getCharacter failed");
            });

            expect(() => execute(mockMovieClip)).toThrow("getCharacter failed");
        });
    });

    describe("エッジケース", () => {
        it("movieClipがnullの場合", () => {
            expect(() => execute(null as any)).toThrow();
        });

        it("movieClipがundefinedの場合", () => {
            expect(() => execute(undefined as any)).toThrow();
        });

        it("selectedDepthsがnullの場合", () => {
            mockMovieClip.selectedDepths = null;

            expect(() => execute(mockMovieClip)).toThrow();
        });

        it("selectedDepthsがundefinedの場合", () => {
            mockMovieClip.selectedDepths = undefined;

            expect(() => execute(mockMovieClip)).toThrow();
        });

        it("currentFrameが0の場合", () => {
            mockMovieClip.currentFrame = 0;
            mockMovieClip.selectedDepths.set(0, [1]);

            execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(0, 1);
        });

        it("currentFrameが負の値の場合", () => {
            mockMovieClip.currentFrame = -1;
            mockMovieClip.selectedDepths.set(0, [1]);

            execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(-1, 1);
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量の選択要素でもパフォーマンスが安定している", () => {
            // 10レイヤー × 50深度 = 500個の選択要素
            for (let layerIndex = 0; layerIndex < 10; layerIndex++) {
                const depths = Array.from({ length: 50 }, (_, i) => i);
                mockMovieClip.selectedDepths.set(layerIndex, depths);
            }

            mockMovieClip.getLayer.mockReturnValue(mockLayer);

            const start = performance.now();
            const result = execute(mockMovieClip);
            const end = performance.now();
            const duration = end - start;

            // 500要素の処理が100ms以内で完了することを期待
            expect(duration).toBeLessThan(100);
            expect(result).toEqual({
                x: 100,
                y: 150
            });
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際の使用シナリオ：アニメーションツールでの複数オブジェクト選択", () => {
            // シナリオ：3つのレイヤーにそれぞれ異なる位置のオブジェクトが選択
            const layer1Character1 = { x: 100, y: 50 };  // 右上
            const layer1Character2 = { x: 200, y: 150 }; // 右下
            const layer2Character1 = { x: 50, y: 100 };  // 左中央
            const layer3Character1 = { x: 150, y: 25 };  // 中央上

            const layer1 = {
                getCharacter: vi.fn().mockImplementation((frame: number, depth: number) => {
                    return depth === 1 ? layer1Character1 : layer1Character2;
                })
            };
            const layer2 = {
                getCharacter: vi.fn().mockReturnValue(layer2Character1)
            };
            const layer3 = {
                getCharacter: vi.fn().mockReturnValue(layer3Character1)
            };

            mockMovieClip.selectedDepths.set(0, [1, 2]); // レイヤー0に2個
            mockMovieClip.selectedDepths.set(1, [1]);    // レイヤー1に1個
            mockMovieClip.selectedDepths.set(2, [1]);    // レイヤー2に1個

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 0: return layer1;
                    case 1: return layer2;
                    case 2: return layer3;
                    default: return null;
                }
            });

            const result = execute(mockMovieClip);

            // 選択範囲の左上座標（最小x, 最小y）を期待
            // x: Math.min(100, 200, 50, 150) = 50
            // y: Math.min(50, 150, 100, 25) = 25
            expect(result).toEqual({
                x: 50,
                y: 25
            });

            // 各レイヤーのキャラクター取得が正しく呼ばれることを確認
            expect(layer1.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(layer1.getCharacter).toHaveBeenCalledWith(1, 2);
            expect(layer2.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(layer3.getCharacter).toHaveBeenCalledWith(1, 1);
        });

        it("キャラクターが散在した複雑な配置での座標計算", () => {
            // 9つのキャラクターをグリッド状に配置
            const characters = [
                { x: 0, y: 0 },     // 左上
                { x: 100, y: 0 },   // 中上
                { x: 200, y: 0 },   // 右上
                { x: 0, y: 100 },   // 左中
                { x: 100, y: 100 }, // 中央
                { x: 200, y: 100 }, // 右中
                { x: 0, y: 200 },   // 左下
                { x: 100, y: 200 }, // 中下
                { x: 200, y: 200 }  // 右下
            ];

            // 3つのレイヤーに3つずつ配置
            mockMovieClip.selectedDepths.set(0, [1, 2, 3]);
            mockMovieClip.selectedDepths.set(1, [1, 2, 3]);
            mockMovieClip.selectedDepths.set(2, [1, 2, 3]);

            const createLayer = (startIndex: number) => ({
                getCharacter: vi.fn().mockImplementation((frame: number, depth: number) => {
                    const index = startIndex + (depth - 1);
                    return characters[index];
                })
            });

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return createLayer(index * 3);
            });

            const result = execute(mockMovieClip);

            // 全体の最小値は(0, 0)
            expect(result).toEqual({
                x: 0,
                y: 0
            });
        });
    });
});
