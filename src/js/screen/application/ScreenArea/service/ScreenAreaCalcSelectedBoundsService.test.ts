import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ScreenAreaCalcSelectedBoundsService";

// モック設定
const mockCalcBoundingBox = vi.fn();

vi.mock("@/core/application/CoreUtil", () => ({
    $calcBoundingBox: mockCalcBoundingBox
}));

describe("ScreenAreaCalcSelectedBoundsService", () => {
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockBounds: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Bounds モック
        mockBounds = {
            xMin: 10,
            yMin: 20,
            xMax: 100,
            yMax: 80,
            width: 90,
            height: 60
        };

        // Character モック
        mockCharacter = {
            id: "character-1",
            getBounds: vi.fn().mockReturnValue(mockBounds)
        };

        // Layer モック
        mockLayer = {
            id: "layer-1",
            lock: false,
            disable: false,
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        // MovieClip モック
        mockMovieClip = {
            currentFrame: 1,
            selectedDepths: new Map(),
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };

        // calcBoundingBox のモック設定
        mockCalcBoundingBox.mockReturnValue({
            xMin: 0,
            yMin: 0,
            xMax: 200,
            yMax: 150,
            width: 200,
            height: 150
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("正常系", () => {
        it("選択されたキャラクターのバウンディングボックスを計算する", () => {
            // 選択状態を設定
            mockMovieClip.selectedDepths.set(0, [1, 2]);

            const result = execute(mockMovieClip);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 2);
            expect(mockCharacter.getBounds).toHaveBeenCalledWith(1, false);
            expect(mockCalcBoundingBox).toHaveBeenCalledWith([mockBounds, mockBounds]);
            expect(result).toEqual({
                xMin: 0,
                yMin: 0,
                xMax: 200,
                yMax: 150,
                width: 200,
                height: 150
            });
        });

        it("use_parent_matrix=trueの場合、親マトリックスを使用する", () => {
            mockMovieClip.selectedDepths.set(0, [1]);

            execute(mockMovieClip, true);

            expect(mockCharacter.getBounds).toHaveBeenCalledWith(1, true);
        });

        it("複数レイヤーの選択されたキャラクターを処理する", () => {
            const mockLayer2 = {
                id: "layer-2",
                lock: false,
                disable: false,
                getCharacter: vi.fn().mockReturnValue(mockCharacter)
            };

            mockMovieClip.selectedDepths.set(0, [1]);
            mockMovieClip.selectedDepths.set(1, [2]);
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 0 ? mockLayer : mockLayer2;
            });

            const result = execute(mockMovieClip);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(1);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockLayer2.getCharacter).toHaveBeenCalledWith(1, 2);
            expect(mockCalcBoundingBox).toHaveBeenCalledWith([mockBounds, mockBounds]);
            expect(result).toBeDefined();
        });

        it("複数の深度を持つレイヤーを処理する", () => {
            mockMovieClip.selectedDepths.set(0, [1, 2, 3]);

            const result = execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(3);
            expect(mockLayer.getCharacter).toHaveBeenNthCalledWith(1, 1, 1);
            expect(mockLayer.getCharacter).toHaveBeenNthCalledWith(2, 1, 2);
            expect(mockLayer.getCharacter).toHaveBeenNthCalledWith(3, 1, 3);
            expect(mockCalcBoundingBox).toHaveBeenCalledWith([mockBounds, mockBounds, mockBounds]);
            expect(result).toBeDefined();
        });

        it("異なるフレームで正しく動作する", () => {
            mockMovieClip.currentFrame = 5;
            mockMovieClip.selectedDepths.set(0, [1]);

            execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(5, 1);
            expect(mockCharacter.getBounds).toHaveBeenCalledWith(5, false);
        });
    });

    describe("早期リターン条件", () => {
        it("選択されたDepthsが空の場合はnullを返す", () => {
            // selectedDepths が空
            const result = execute(mockMovieClip);

            expect(result).toBeNull();
            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockCalcBoundingBox).not.toHaveBeenCalled();
        });

        it("selectedDepthsのサイズが0の場合はnullを返す", () => {
            mockMovieClip.selectedDepths = new Map();

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });
    });

    describe("レイヤーの状態による除外処理", () => {
        it("レイヤーが存在しない場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockMovieClip.getLayer.mockReturnValue(null);

            const result = execute(mockMovieClip);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it("レイヤーがundefinedの場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockMovieClip.getLayer.mockReturnValue(undefined);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });

        it("レイヤーがロックされている場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.lock = true;

            const result = execute(mockMovieClip);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it("レイヤーが無効化されている場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.disable = true;

            const result = execute(mockMovieClip);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it("レイヤーがロックかつ無効化されている場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.lock = true;
            mockLayer.disable = true;

            const result = execute(mockMovieClip);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe("キャラクターとバウンズの処理", () => {
        it("キャラクターが存在しない場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.getCharacter.mockReturnValue(null);

            const result = execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(result).toBeNull();
        });

        it("キャラクターがundefinedの場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockLayer.getCharacter.mockReturnValue(undefined);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });

        it("バウンズが存在しない場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockCharacter.getBounds.mockReturnValue(null);

            const result = execute(mockMovieClip);

            expect(mockCharacter.getBounds).toHaveBeenCalledWith(1, false);
            expect(result).toBeNull();
        });

        it("バウンズがundefinedの場合はスキップする", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockCharacter.getBounds.mockReturnValue(undefined);

            const result = execute(mockMovieClip);

            expect(result).toBeNull();
        });

        it("一部のキャラクターにバウンズがない場合、有効なもののみを使用する", () => {
            const mockCharacter2 = {
                id: "character-2",
                getBounds: vi.fn().mockReturnValue(null) // バウンズなし
            };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? mockCharacter : mockCharacter2;
            });

            const result = execute(mockMovieClip);

            expect(mockCharacter.getBounds).toHaveBeenCalledWith(1, false);
            expect(mockCharacter2.getBounds).toHaveBeenCalledWith(1, false);
            expect(mockCalcBoundingBox).toHaveBeenCalledWith([mockBounds]);
            expect(result).toBeDefined();
        });
    });

    describe("複雑な選択パターン", () => {
        it("複数レイヤーの複数深度で一部が除外される場合", () => {
            // レイヤー0: 有効、レイヤー1: ロック済み、レイヤー2: 有効
            const mockLayer1 = { lock: true, disable: false };
            const mockLayer2 = { lock: false, disable: false, getCharacter: vi.fn().mockReturnValue(mockCharacter) };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockMovieClip.selectedDepths.set(1, [3]);
            mockMovieClip.selectedDepths.set(2, [4]);

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 0: return mockLayer;
                    case 1: return mockLayer1;
                    case 2: return mockLayer2;
                    default: return null;
                }
            });

            const result = execute(mockMovieClip);

            // レイヤー0の2個 + レイヤー2の1個 = 3個のバウンズ
            expect(mockCalcBoundingBox).toHaveBeenCalledWith([mockBounds, mockBounds, mockBounds]);
            expect(result).toBeDefined();
        });

        it("空の深度配列を持つレイヤーは処理されない", () => {
            mockMovieClip.selectedDepths.set(0, []); // 空配列

            const result = execute(mockMovieClip);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(result).toBeNull();
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

    describe("calcBoundingBoxの統合", () => {
        it("バウンディングボックスが空の場合はnullを返す", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockCharacter.getBounds.mockReturnValue(null);

            const result = execute(mockMovieClip);

            expect(mockCalcBoundingBox).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it("calcBoundingBoxに正しい配列が渡される", () => {
            const bounds1 = { xMin: 10, yMin: 20, xMax: 100, yMax: 80 };
            const bounds2 = { xMin: 50, yMin: 60, xMax: 150, yMax: 120 };

            const character1 = { getBounds: vi.fn().mockReturnValue(bounds1) };
            const character2 = { getBounds: vi.fn().mockReturnValue(bounds2) };

            mockMovieClip.selectedDepths.set(0, [1, 2]);
            mockLayer.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? character1 : character2;
            });

            execute(mockMovieClip);

            expect(mockCalcBoundingBox).toHaveBeenCalledWith([bounds1, bounds2]);
        });

        it("calcBoundingBoxの結果をそのまま返す", () => {
            const expectedResult = {
                xMin: 5,
                yMin: 10,
                xMax: 250,
                yMax: 200,
                width: 245,
                height: 190
            };

            mockCalcBoundingBox.mockReturnValue(expectedResult);
            mockMovieClip.selectedDepths.set(0, [1]);

            const result = execute(mockMovieClip);

            expect(result).toBe(expectedResult);
        });
    });

    describe("パラメータのデフォルト値", () => {
        it("use_parent_matrixが省略された場合はfalseが使用される", () => {
            mockMovieClip.selectedDepths.set(0, [1]);

            execute(mockMovieClip);

            expect(mockCharacter.getBounds).toHaveBeenCalledWith(1, false);
        });

        it("use_parent_matrixが明示的にfalseの場合", () => {
            mockMovieClip.selectedDepths.set(0, [1]);

            execute(mockMovieClip, false);

            expect(mockCharacter.getBounds).toHaveBeenCalledWith(1, false);
        });

        it("use_parent_matrixが明示的にtrueの場合", () => {
            mockMovieClip.selectedDepths.set(0, [1]);

            execute(mockMovieClip, true);

            expect(mockCharacter.getBounds).toHaveBeenCalledWith(1, true);
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

        it("getBoundsでエラーが発生した場合", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockCharacter.getBounds.mockImplementation(() => {
                throw new Error("getBounds failed");
            });

            expect(() => execute(mockMovieClip)).toThrow("getBounds failed");
        });

        it("calcBoundingBoxでエラーが発生した場合", () => {
            mockMovieClip.selectedDepths.set(0, [1]);
            mockCalcBoundingBox.mockImplementation(() => {
                throw new Error("calcBoundingBox failed");
            });

            expect(() => execute(mockMovieClip)).toThrow("calcBoundingBox failed");
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
            expect(mockCharacter.getBounds).toHaveBeenCalledWith(0, false);
        });

        it("currentFrameが負の値の場合", () => {
            mockMovieClip.currentFrame = -1;
            mockMovieClip.selectedDepths.set(0, [1]);

            execute(mockMovieClip);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(-1, 1);
            expect(mockCharacter.getBounds).toHaveBeenCalledWith(-1, false);
        });

        it("selectedDepthsが非常に大きなMapの場合", () => {
            // 大量のレイヤーと深度を設定
            for (let i = 0; i < 100; i++) {
                mockMovieClip.selectedDepths.set(i, [1, 2, 3]);
            }

            // すべて同じレイヤーを返す
            mockMovieClip.getLayer.mockReturnValue(mockLayer);

            const result = execute(mockMovieClip);

            // 100レイヤー × 3深度 = 300個のバウンズが期待される
            expect(mockCalcBoundingBox).toHaveBeenCalledWith(
                Array(300).fill(mockBounds)
            );
            expect(result).toBeDefined();
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
            expect(result).toBeDefined();
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際の使用シナリオ：複数のオブジェクトが選択された状態", () => {
            // シナリオ：3つのレイヤーにそれぞれ異なる数のオブジェクトが選択
            const layer1 = { lock: false, disable: false, getCharacter: vi.fn() };
            const layer2 = { lock: false, disable: false, getCharacter: vi.fn() };
            const layer3 = { lock: true, disable: false, getCharacter: vi.fn() }; // ロック済み

            const character1 = { getBounds: vi.fn().mockReturnValue({ xMin: 0, yMin: 0, xMax: 50, yMax: 50 }) };
            const character2 = { getBounds: vi.fn().mockReturnValue({ xMin: 25, yMin: 25, xMax: 75, yMax: 75 }) };
            const character3 = { getBounds: vi.fn().mockReturnValue({ xMin: 50, yMin: 50, xMax: 100, yMax: 100 }) };

            mockMovieClip.selectedDepths.set(0, [1, 2]); // レイヤー0に2個
            mockMovieClip.selectedDepths.set(1, [1]);    // レイヤー1に1個
            mockMovieClip.selectedDepths.set(2, [1]);    // レイヤー2に1個（ロック済みで除外）

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 0: return layer1;
                    case 1: return layer2;
                    case 2: return layer3;
                    default: return null;
                }
            });

            layer1.getCharacter.mockImplementation((frame: number, depth: number) => {
                return depth === 1 ? character1 : character2;
            });
            layer2.getCharacter.mockReturnValue(character3);

            const result = execute(mockMovieClip);

            // レイヤー0の2個 + レイヤー1の1個 = 3個のバウンズが処理される
            // レイヤー2はロック済みで除外
            expect(character1.getBounds).toHaveBeenCalledWith(1, false);
            expect(character2.getBounds).toHaveBeenCalledWith(1, false);
            expect(character3.getBounds).toHaveBeenCalledWith(1, false);
            expect(layer3.getCharacter).not.toHaveBeenCalled();

            const expectedBounds = [
                { xMin: 0, yMin: 0, xMax: 50, yMax: 50 },
                { xMin: 25, yMin: 25, xMax: 75, yMax: 75 },
                { xMin: 50, yMin: 50, xMax: 100, yMax: 100 }
            ];
            expect(mockCalcBoundingBox).toHaveBeenCalledWith(expectedBounds);
            expect(result).toBeDefined();
        });
    });
});
