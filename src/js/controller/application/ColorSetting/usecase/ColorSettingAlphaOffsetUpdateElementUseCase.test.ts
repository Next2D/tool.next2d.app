import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// モック関数の定義
const mockScreenAreaGetElementFromLayerIdAndDepthService = vi.fn();

// vi.mockの呼び出し
vi.mock("@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService", () => ({
    execute: (layerId: string, depth: number) => mockScreenAreaGetElementFromLayerIdAndDepthService(layerId, depth)
}));

// 動的インポート
const { execute } = await import("./ColorSettingAlphaOffsetUpdateElementUseCase");

describe("ColorSettingAlphaOffsetUpdateElementUseCase", () => {
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockNode: any;
    let mockCanvas: HTMLCanvasElement;

    beforeEach(() => {
        vi.clearAllMocks();

        // モックCanvas要素
        mockCanvas = document.createElement("canvas");
        mockCanvas.style.opacity = "1";

        // モックNode
        mockNode = {
            querySelector: vi.fn().mockReturnValue(mockCanvas)
        };

        // モックCharacter
        mockCharacter = {
            colorTransform: [1, 0, 1, 0, 1, 0, 1, 0], // R, rO, G, gO, B, bO, A, aO
            alpha: 1
        };

        // モックLayer
        mockLayer = {
            id: "layer-1",
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        // モックMovieClip
        mockMovieClip = {
            currentFrame: 1,
            selectedDepths: new Map(),
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };

        mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(mockNode);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("基本動作", () => {
        it("selectedDepthsが空の場合は何もしない", () => {
            mockMovieClip.selectedDepths = new Map();

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("selectedDepths.sizeが0の場合は早期リターン", () => {
            mockMovieClip.selectedDepths = new Map();
            expect(mockMovieClip.selectedDepths.size).toBe(0);

            execute(mockMovieClip, 75);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("alphaが正しく更新される(100の場合)", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 100);

            // Math.floor(100) = 100
            expect(mockCharacter.colorTransform[7]).toBe(100);
        });

        it("alphaが正しく更新される(50の場合)", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 50);

            // Math.floor(50) = 50
            expect(mockCharacter.colorTransform[7]).toBe(50);
        });

        it("alphaが正しく更新される(0の場合)", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 0);

            // Math.floor(0) = 0
            expect(mockCharacter.colorTransform[7]).toBe(0);
        });

        it("canvas要素のopacityが更新される", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockCharacter.alpha = 0.8;

            execute(mockMovieClip, 80);

            expect(mockCanvas.style.opacity).toBe("0.8");
        });

        it("canvas要素が存在しない場合でもエラーにならない", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockNode.querySelector.mockReturnValue(null);

            execute(mockMovieClip, 50);

            // エラーが発生しないことを確認
            expect(mockCharacter.colorTransform[7]).toBe(50);
        });
    });

    describe("colorTransformの配列インデックス", () => {
        it("colorTransform[7]がアルファ値として更新される", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockCharacter.colorTransform = [1, 0, 1, 0, 1, 0, 1, 0];

            execute(mockMovieClip, 75);

            // インデックス7が更新される
            expect(mockCharacter.colorTransform[7]).toBe(75);
            // 他のインデックスは変更されない
            expect(mockCharacter.colorTransform[0]).toBe(1);
            expect(mockCharacter.colorTransform[1]).toBe(0);
            expect(mockCharacter.colorTransform[2]).toBe(1);
            expect(mockCharacter.colorTransform[4]).toBe(1);
        });

        it("colorTransformの他の要素に影響しない", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockCharacter.colorTransform = [0.5, 100, 0.8, 0.6, 0.9, 50, 1, 0];

            execute(mockMovieClip, 30);

            expect(mockCharacter.colorTransform[0]).toBe(0.5);
            expect(mockCharacter.colorTransform[1]).toBe(100);
            expect(mockCharacter.colorTransform[2]).toBe(0.8);
            expect(mockCharacter.colorTransform[3]).toBe(0.6);
            expect(mockCharacter.colorTransform[4]).toBe(0.9);
            expect(mockCharacter.colorTransform[5]).toBe(50);
            expect(mockCharacter.colorTransform[6]).toBe(1);
            expect(mockCharacter.colorTransform[7]).toBe(30); // 更新される
        });
    });

    describe("複数の選択", () => {
        it("単一レイヤー、単一depth", () => {
            mockMovieClip.selectedDepths = new Map([[0, [5]]]);

            execute(mockMovieClip, 60);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 5);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5);
            expect(mockCharacter.colorTransform[7]).toBe(60);
        });

        it("単一レイヤー、複数depths", () => {
            const mockCharacter2 = {
                colorTransform: [1, 0, 1, 0, 1, 0, 1, 0],
                alpha: 1
            };
            const mockCharacter3 = {
                colorTransform: [1, 0, 1, 0, 1, 0, 1, 0],
                alpha: 1
            };

            let callCount = 0;
            mockLayer.getCharacter.mockImplementation(() => {
                callCount++;
                if (callCount === 1) return mockCharacter;
                if (callCount === 2) return mockCharacter2;
                return mockCharacter3;
            });

            mockMovieClip.selectedDepths = new Map([[0, [1, 2, 3]]]);

            execute(mockMovieClip, 40);

            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(3);
            expect(mockCharacter.colorTransform[7]).toBe(40);
            expect(mockCharacter2.colorTransform[7]).toBe(40);
            expect(mockCharacter3.colorTransform[7]).toBe(40);
        });

        it("複数レイヤー、各レイヤーに単一depth", () => {
            const mockLayer2 = {
                id: "layer-2",
                getCharacter: vi.fn().mockReturnValue({
                    colorTransform: [1, 0, 1, 0, 1, 0, 1, 0],
                    alpha: 1
                })
            };

            let layerCallCount = 0;
            mockMovieClip.getLayer.mockImplementation(() => {
                layerCallCount++;
                if (layerCallCount === 1) return mockLayer;
                return mockLayer2;
            });

            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [1, [2]]
            ]);

            execute(mockMovieClip, 70);

            expect(mockMovieClip.getLayer).toHaveBeenCalledTimes(2);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(1);
        });

        it("複数レイヤー、複数depths", () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2]],
                [1, [3, 4]]
            ]);

            execute(mockMovieClip, 85);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledTimes(4);
        });
    });

    describe("エラーケース", () => {
        it("layerがnullの場合はスキップされる", () => {
            mockMovieClip.getLayer.mockReturnValue(null);
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("layerがundefinedの場合はスキップされる", () => {
            mockMovieClip.getLayer.mockReturnValue(undefined);
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("nodeがnullの場合はスキップされる", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(null);

            execute(mockMovieClip, 50);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
        });

        it("nodeがundefinedの場合はスキップされる", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(undefined);

            execute(mockMovieClip, 50);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
        });

        it("characterがnullの場合はスキップされる", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockLayer.getCharacter.mockReturnValue(null);

            execute(mockMovieClip, 50);

            // canvas要素の更新もされない
            expect(mockNode.querySelector).not.toHaveBeenCalled();
        });

        it("characterがundefinedの場合はスキップされる", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockLayer.getCharacter.mockReturnValue(undefined);

            execute(mockMovieClip, 50);

            expect(mockNode.querySelector).not.toHaveBeenCalled();
        });

        it("複数エラーが混在する場合、有効なものだけ更新される", () => {
            const mockCharacter2 = {
                colorTransform: [1, 0, 1, 0, 1, 0, 1, 0],
                alpha: 1
            };

            let callCount = 0;
            mockLayer.getCharacter.mockImplementation(() => {
                callCount++;
                if (callCount === 1) return null; // 1つ目はnull
                return mockCharacter2; // 2つ目は有効
            });

            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);

            execute(mockMovieClip, 50);

            // 2つ目だけ更新される
            expect(mockCharacter2.colorTransform[7]).toBe(50);
        });
    });

    describe("alphaの値の範囲", () => {
        it("alpha = 0の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 0);

            expect(mockCharacter.colorTransform[7]).toBe(0);
        });

        it("alpha = 1の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 1);

            expect(mockCharacter.colorTransform[7]).toBe(1);
        });

        it("alpha = 25の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 25);

            expect(mockCharacter.colorTransform[7]).toBe(25);
        });

        it("alpha = 50の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 50);

            expect(mockCharacter.colorTransform[7]).toBe(50);
        });

        it("alpha = 75の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 75);

            expect(mockCharacter.colorTransform[7]).toBe(75);
        });

        it("alpha = 99の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 99);

            expect(mockCharacter.colorTransform[7]).toBe(99);
        });

        it("alpha = 100の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 100);

            expect(mockCharacter.colorTransform[7]).toBe(100);
        });

        it("alpha > 100の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 150);

            // Math.floor(150) = 150 (制約なし)
            expect(mockCharacter.colorTransform[7]).toBe(150);
        });

        it("alpha < 0の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, -50);

            // Math.floor(-50) = -50 (制約なし)
            expect(mockCharacter.colorTransform[7]).toBe(-50);
        });
    });

    describe("canvasのquerySelector", () => {
        it("canvas要素が見つかる場合、opacityが設定される", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockCharacter.alpha = 0.75;

            execute(mockMovieClip, 75);

            expect(mockNode.querySelector).toHaveBeenCalledWith("canvas");
            expect(mockCanvas.style.opacity).toBe("0.75");
        });

        it("canvas要素が見つからない場合でもエラーにならない", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockNode.querySelector.mockReturnValue(null);

            execute(mockMovieClip, 50);

            // colorTransformは更新される
            expect(mockCharacter.colorTransform[7]).toBe(50);
            // エラーは発生しない
        });

        it("querySelectorが複数回呼ばれる(複数depth)", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2, 3]]]);

            execute(mockMovieClip, 50);

            expect(mockNode.querySelector).toHaveBeenCalledTimes(3);
        });

        it("character.alphaが正しく参照される", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockCharacter.alpha = 0.333;

            execute(mockMovieClip, 50);

            expect(mockCanvas.style.opacity).toBe("0.333");
        });
    });

    describe("currentFrameの使用", () => {
        it("currentFrame = 1の場合", () => {
            mockMovieClip.currentFrame = 1;
            mockMovieClip.selectedDepths = new Map([[0, [5]]]);

            execute(mockMovieClip, 50);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5);
        });

        it("currentFrame = 10の場合", () => {
            mockMovieClip.currentFrame = 10;
            mockMovieClip.selectedDepths = new Map([[0, [5]]]);

            execute(mockMovieClip, 50);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(10, 5);
        });

        it("currentFrame = 0の場合", () => {
            mockMovieClip.currentFrame = 0;
            mockMovieClip.selectedDepths = new Map([[0, [5]]]);

            execute(mockMovieClip, 50);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(0, 5);
        });
    });

    describe("統合シナリオ", () => {
        it("完全な更新フロー: 単一選択", () => {
            mockMovieClip.currentFrame = 5;
            mockMovieClip.selectedDepths = new Map([[2, [10]]]);
            mockCharacter.alpha = 0.8;

            execute(mockMovieClip, 80);

            // レイヤーの取得
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(2);

            // 3. ノードの取得
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 10);

            // 4. キャラクターの取得
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(5, 10);

            // 5. colorTransformの更新
            expect(mockCharacter.colorTransform[7]).toBe(80);

            // 6. canvas opacityの更新
            expect(mockCanvas.style.opacity).toBe("0.8");
        });

        it("完全な更新フロー: 複数選択", () => {
            const mockCharacter2 = {
                colorTransform: [1, 0, 1, 0, 1, 0, 1, 0],
                alpha: 0.5
            };
            const mockCharacter3 = {
                colorTransform: [1, 0, 1, 0, 1, 0, 1, 0],
                alpha: 0.6
            };

            let charCallCount = 0;
            mockLayer.getCharacter.mockImplementation(() => {
                charCallCount++;
                if (charCallCount === 1) return mockCharacter;
                if (charCallCount === 2) return mockCharacter2;
                return mockCharacter3;
            });

            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2]],
                [1, [3]]
            ]);

            execute(mockMovieClip, 60);

            // 全てのキャラクターが更新される
            expect(mockCharacter.colorTransform[7]).toBe(60);
            expect(mockCharacter2.colorTransform[7]).toBe(60);
            expect(mockCharacter3.colorTransform[7]).toBe(60);
        });

        it("部分的なエラーケース: 一部のlayerがnull", () => {
            const mockLayer2 = {
                id: "layer-2",
                getCharacter: vi.fn().mockReturnValue({
                    colorTransform: [1, 0, 1, 0, 1, 0, 1, 0],
                    alpha: 1
                })
            };

            let layerCallCount = 0;
            mockMovieClip.getLayer.mockImplementation(() => {
                layerCallCount++;
                if (layerCallCount === 1) return null; // 1つ目はnull
                return mockLayer2; // 2つ目は有効
            });

            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [1, [2]]
            ]);

            execute(mockMovieClip, 50);

            // 2つ目のレイヤーだけ処理される
            expect(mockLayer2.getCharacter).toHaveBeenCalled();
        });

        it("境界値: alpha = 0とalpha = 100を連続して更新", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            // 最初は0
            execute(mockMovieClip, 0);
            expect(mockCharacter.colorTransform[7]).toBe(0);

            // 次は100
            execute(mockMovieClip, 100);
            expect(mockCharacter.colorTransform[7]).toBe(100);
        });
    });

    describe("Map.entriesの反復処理", () => {
        it("Map.entriesが正しく反復される", () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [2, [3]],
                [5, [7]]
            ]);

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).toHaveBeenCalledTimes(3);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(2);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(5);
        });

        it("depths配列が正しく反復される", () => {
            mockMovieClip.selectedDepths = new Map([[0, [10, 20, 30, 40]]]);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledTimes(4);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 10);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 20);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 30);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 40);
        });
    });

    describe("エッジケース", () => {
        it("selectedDepthsに空の配列が含まれる場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, []]]);

            execute(mockMovieClip, 50);

            // 空配列なので何も処理されない
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("alpha値が小数点を含む場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 33.33);

            // Math.floor(33.33) = 33
            expect(mockCharacter.colorTransform[7]).toBe(33);
        });

        it("alpha値が非常に小さい場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 0.01);

            // Math.floor(0.01) = 0
            expect(mockCharacter.colorTransform[7]).toBe(0);
        });

        it("layerIndex = 0の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
        });

        it("depth = 0の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [0]]]);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 0);
        });
    });
});
