import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// モック関数の定義
const mockScreenAreaGetElementFromLayerIdAndDepthService = vi.fn();

// vi.mockの呼び出し
vi.mock("@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService", () => ({
    execute: (layerId: string, depth: number) => mockScreenAreaGetElementFromLayerIdAndDepthService(layerId, depth)
}));

// 動的インポート
const { execute } = await import("./ColorSettingAlphaMultiplierUpdateElementUseCase");

describe("ColorSettingAlphaMultiplierUpdateElementUseCase", () => {
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
            selectedDepths: new Map([[0, [1]]]), // デフォルトで単一選択
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
            execute(mockMovieClip, 100);

            // Math.floor(100) / 100 = 100 / 100 = 1
            expect(mockCharacter.colorTransform[3]).toBe(1);
        });

        it("alphaが正しく更新される(50の場合)", () => {
            execute(mockMovieClip, 50);

            // Math.floor(50) / 100 = 50 / 100 = 0.5
            expect(mockCharacter.colorTransform[3]).toBe(0.5);
        });

        it("alphaが正しく更新される(0の場合)", () => {
            execute(mockMovieClip, 0);

            // Math.floor(0) / 100 = 0 / 100 = 0
            expect(mockCharacter.colorTransform[3]).toBe(0);
        });

        it("canvas要素のopacityが更新される", () => {
            mockCharacter.alpha = 0.8;

            execute(mockMovieClip, 80);

            expect(mockCanvas.style.opacity).toBe("0.8");
        });

        it("canvas要素が存在しない場合でもエラーにならない", () => {
            mockNode.querySelector.mockReturnValue(null);

            execute(mockMovieClip, 50);

            // エラーが発生しないことを確認
            expect(mockCharacter.colorTransform[3]).toBe(0.5);
        });
    });

    describe("単一選択のみ処理", () => {
        it("単一選択の場合のみ処理される", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockMovieClip, 60);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockCharacter.colorTransform[3]).toBe(0.6);
        });

        it("複数選択の場合は何もしない(2レイヤー)", () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [1, [2]]
            ]);

            execute(mockMovieClip, 60);

            // size > 1なので早期リターン
            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("複数選択の場合は何もしない(3レイヤー)", () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [1, [2]],
                [2, [3]]
            ]);

            execute(mockMovieClip, 70);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("1つのレイヤーに複数depthsがある場合、最初のdepthのみ処理", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2, 3]]]);

            execute(mockMovieClip, 40);

            // 最初のdepth(1)のみ処理される
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(1);
        });

        it("keys().next().valueで最初のlayerIndexを取得", () => {
            mockMovieClip.selectedDepths = new Map([[5, [10]]]);

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(5);
        });

        it("values().next().value[0]で最初のdepthを取得", () => {
            mockMovieClip.selectedDepths = new Map([[0, [7, 8, 9]]]);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 7);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 7);
        });
    });

    describe("colorTransformの配列インデックス", () => {
        it("colorTransform[3]がアルファ値として更新される", () => {
            mockCharacter.colorTransform = [1, 0, 1, 0, 1, 0, 1, 0];

            execute(mockMovieClip, 75);

            // インデックス3が更新される
            expect(mockCharacter.colorTransform[3]).toBe(0.75);
            // 他のインデックスは変更されない
            expect(mockCharacter.colorTransform[0]).toBe(1);
            expect(mockCharacter.colorTransform[1]).toBe(0);
            expect(mockCharacter.colorTransform[2]).toBe(1);
            expect(mockCharacter.colorTransform[4]).toBe(1);
        });

        it("colorTransformの他の要素に影響しない", () => {
            mockCharacter.colorTransform = [0.5, 100, 0.8, 0.6, 0.9, 50, 1, 0];

            execute(mockMovieClip, 30);

            expect(mockCharacter.colorTransform[0]).toBe(0.5);
            expect(mockCharacter.colorTransform[1]).toBe(100);
            expect(mockCharacter.colorTransform[2]).toBe(0.8);
            expect(mockCharacter.colorTransform[3]).toBe(0.3); // 更新される
            expect(mockCharacter.colorTransform[4]).toBe(0.9);
            expect(mockCharacter.colorTransform[5]).toBe(50);
            expect(mockCharacter.colorTransform[6]).toBe(1);
            expect(mockCharacter.colorTransform[7]).toBe(0);
        });
    });

    describe("Math.floorの適用", () => {
        it("Math.floorが適用される: 75.9 -> 75", () => {
            execute(mockMovieClip, 75.9);

            // Math.floor(75.9) / 100 = 75 / 100 = 0.75
            expect(mockCharacter.colorTransform[3]).toBe(0.75);
        });

        it("Math.floorが適用される: 50.1 -> 50", () => {
            execute(mockMovieClip, 50.1);

            // Math.floor(50.1) / 100 = 50 / 100 = 0.5
            expect(mockCharacter.colorTransform[3]).toBe(0.5);
        });

        it("Math.floorが適用される: 99.99 -> 99", () => {
            execute(mockMovieClip, 99.99);

            // Math.floor(99.99) / 100 = 99 / 100 = 0.99
            expect(mockCharacter.colorTransform[3]).toBe(0.99);
        });

        it("Math.floorが適用される: 33.33 -> 33", () => {
            execute(mockMovieClip, 33.33);

            // Math.floor(33.33) / 100 = 33 / 100 = 0.33
            expect(mockCharacter.colorTransform[3]).toBe(0.33);
        });

        it("Math.floorが適用される: 0.99 -> 0", () => {
            execute(mockMovieClip, 0.99);

            // Math.floor(0.99) / 100 = 0 / 100 = 0
            expect(mockCharacter.colorTransform[3]).toBe(0);
        });

        it("Math.floorが適用される: 100.5 -> 100", () => {
            execute(mockMovieClip, 100.5);

            // Math.floor(100.5) / 100 = 100 / 100 = 1
            expect(mockCharacter.colorTransform[3]).toBe(1);
        });
    });

    describe("エラーケース", () => {
        it("layerがnullの場合は早期リターン", () => {
            mockMovieClip.getLayer.mockReturnValue(null);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("layerがundefinedの場合は早期リターン", () => {
            mockMovieClip.getLayer.mockReturnValue(undefined);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("characterがnullの場合は早期リターン", () => {
            mockLayer.getCharacter.mockReturnValue(null);

            execute(mockMovieClip, 50);

            // canvas要素の更新もされない
            expect(mockNode.querySelector).not.toHaveBeenCalled();
        });

        it("characterがundefinedの場合は早期リターン", () => {
            mockLayer.getCharacter.mockReturnValue(undefined);

            execute(mockMovieClip, 50);

            expect(mockNode.querySelector).not.toHaveBeenCalled();
        });

        it("nodeがnullの場合は早期リターン", () => {
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(null);

            execute(mockMovieClip, 50);

            // layerとcharacterは取得されるが、更新は行われない
            expect(mockMovieClip.getLayer).toHaveBeenCalled();
            expect(mockLayer.getCharacter).toHaveBeenCalled();
        });

        it("nodeがundefinedの場合は早期リターン", () => {
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(undefined);

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).toHaveBeenCalled();
            expect(mockLayer.getCharacter).toHaveBeenCalled();
        });
    });

    describe("alphaの値の範囲", () => {
        it("alpha = 0の場合", () => {
            execute(mockMovieClip, 0);

            expect(mockCharacter.colorTransform[3]).toBe(0);
        });

        it("alpha = 1の場合", () => {
            execute(mockMovieClip, 1);

            expect(mockCharacter.colorTransform[3]).toBe(0.01);
        });

        it("alpha = 25の場合", () => {
            execute(mockMovieClip, 25);

            expect(mockCharacter.colorTransform[3]).toBe(0.25);
        });

        it("alpha = 50の場合", () => {
            execute(mockMovieClip, 50);

            expect(mockCharacter.colorTransform[3]).toBe(0.5);
        });

        it("alpha = 75の場合", () => {
            execute(mockMovieClip, 75);

            expect(mockCharacter.colorTransform[3]).toBe(0.75);
        });

        it("alpha = 99の場合", () => {
            execute(mockMovieClip, 99);

            expect(mockCharacter.colorTransform[3]).toBe(0.99);
        });

        it("alpha = 100の場合", () => {
            execute(mockMovieClip, 100);

            expect(mockCharacter.colorTransform[3]).toBe(1);
        });

        it("alpha > 100の場合", () => {
            execute(mockMovieClip, 150);

            // Math.floor(150) / 100 = 150 / 100 = 1.5
            expect(mockCharacter.colorTransform[3]).toBe(1.5);
        });

        it("alpha < 0の場合", () => {
            execute(mockMovieClip, -50);

            // Math.floor(-50) / 100 = -50 / 100 = -0.5
            expect(mockCharacter.colorTransform[3]).toBe(-0.5);
        });
    });

    describe("canvasのquerySelector", () => {
        it("canvas要素が見つかる場合、opacityが設定される", () => {
            mockCharacter.alpha = 0.75;

            execute(mockMovieClip, 75);

            expect(mockNode.querySelector).toHaveBeenCalledWith("canvas");
            expect(mockCanvas.style.opacity).toBe("0.75");
        });

        it("canvas要素が見つからない場合でもエラーにならない", () => {
            mockNode.querySelector.mockReturnValue(null);

            execute(mockMovieClip, 50);

            // colorTransformは更新される
            expect(mockCharacter.colorTransform[3]).toBe(0.5);
            // エラーは発生しない
        });

        it("character.alphaが正しく参照される", () => {
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

            // 1. レイヤーの取得
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(2);

            // 2. ノードの取得
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 10);

            // 3. キャラクターの取得
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(5, 10);

            // 4. colorTransformの更新
            expect(mockCharacter.colorTransform[3]).toBe(0.8);

            // 5. canvas opacityの更新
            expect(mockCanvas.style.opacity).toBe("0.8");
        });

        it("境界値: alpha = 0とalpha = 100を連続して更新", () => {
            // 最初は0
            execute(mockMovieClip, 0);
            expect(mockCharacter.colorTransform[3]).toBe(0);

            // 次は100
            execute(mockMovieClip, 100);
            expect(mockCharacter.colorTransform[3]).toBe(1);
        });
    });

    describe("エッジケース", () => {
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

        it("大きなlayerIndex", () => {
            mockMovieClip.selectedDepths = new Map([[999, [100]]]);

            execute(mockMovieClip, 50);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(999);
        });

        it("大きなdepth値", () => {
            mockMovieClip.selectedDepths = new Map([[0, [9999]]]);

            execute(mockMovieClip, 50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 9999);
        });
    });
});
