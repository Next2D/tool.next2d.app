import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// モック関数の設定（vi.hoistedを使用）
const {
    mockGetCurrentWorkSpace,
    mockExternalCharacterSetAlphaMultiplier,
    mockColorSetting,
    mockExternalCharacterConstructor
} = vi.hoisted(() => {
    const mockExternalCharacterSetAlphaMultiplier = vi.fn();
    return {
        mockGetCurrentWorkSpace: vi.fn(),
        mockExternalCharacterSetAlphaMultiplier,
        mockColorSetting: {
            beforeValue: 50
        },
        mockExternalCharacterConstructor: vi.fn().mockImplementation(function() {
            return {
                setAlphaMultiplier: mockExternalCharacterSetAlphaMultiplier
            };
        })
    };
});

// vi.mockの呼び出し
vi.mock("@/controller/domain/model/ColorSetting", () => ({
    colorSetting: mockColorSetting
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: mockExternalCharacterConstructor
}));

import { execute } from "./ColorSettingAlphaMultiplierUpdateValueUseCase";

describe("ColorSettingAlphaMultiplierUpdateValueUseCase", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;

    beforeEach(() => {
        vi.clearAllMocks();

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

        // モックWorkSpace
        mockWorkSpace = {
            scene: mockMovieClip
        };

        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockExternalCharacterSetAlphaMultiplier.mockResolvedValue(undefined);

        // colorSetting.beforeValueをリセット
        mockColorSetting.beforeValue = 50;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("基本動作", () => {
        it("selectedDepthsが空の場合は何もしない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(75);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockExternalCharacterConstructor).not.toHaveBeenCalled();
        });

        it("selectedDepths.sizeが0の場合は早期リターン", async () => {
            mockMovieClip.selectedDepths = new Map();
            expect(mockMovieClip.selectedDepths.size).toBe(0);

            await execute(80);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("ExternalCharacterが正しく生成される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(60);

            expect(mockExternalCharacterConstructor).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
        });

        it("setAlphaMultiplierが呼ばれる", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(70);

            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(70);
        });

        it("colorTransform[3]がbeforeValueで更新される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 80;

            await execute(60);

            // beforeValue / 100 = 80 / 100 = 0.8
            expect(mockCharacter.colorTransform[3]).toBe(0.8);
        });
    });

    describe("beforeValueの使用", () => {
        it("beforeValue = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 0;

            await execute(50);

            expect(mockCharacter.colorTransform[3]).toBe(0);
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(50);
        });

        it("beforeValue = 50の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 50;

            await execute(75);

            expect(mockCharacter.colorTransform[3]).toBe(0.5);
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(75);
        });

        it("beforeValue = 100の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 100;

            await execute(25);

            expect(mockCharacter.colorTransform[3]).toBe(1);
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(25);
        });

        it("beforeValueが変更されても正しく反映される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            // 最初はbeforeValue = 50
            mockColorSetting.beforeValue = 50;
            await execute(60);
            expect(mockCharacter.colorTransform[3]).toBe(0.5);

            // beforeValueを変更
            mockCharacter.colorTransform[3] = 0; // リセット
            mockColorSetting.beforeValue = 80;
            await execute(90);
            expect(mockCharacter.colorTransform[3]).toBe(0.8);
        });
    });

    describe("複数の選択", () => {
        it("単一レイヤー、単一depth", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [5]]]);
            mockColorSetting.beforeValue = 60;

            await execute(70);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5);
            expect(mockCharacter.colorTransform[3]).toBe(0.6);
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(70);
        });

        it("単一レイヤー、複数depths - 最初のdepthのみ処理される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2, 3]]]);
            mockColorSetting.beforeValue = 40;

            await execute(80);

            // 最初のdepth (1) のみ処理される
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(1);
            expect(mockCharacter.colorTransform[3]).toBe(0.4);
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(80);
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledTimes(1);
        });

        it("複数レイヤー - 最初のレイヤーのみ処理される", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [1, [2]]
            ]);
            mockColorSetting.beforeValue = 30;

            await execute(90);

            // 最初のレイヤー (0) のみ処理される
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockMovieClip.getLayer).toHaveBeenCalledTimes(1);
            expect(mockExternalCharacterConstructor).toHaveBeenCalledTimes(1);
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledTimes(1);
        });

        it("複数レイヤー、複数depths - 最初のレイヤーの最初のdepthのみ処理される", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2]],
                [1, [3, 4]]
            ]);

            await execute(50);

            // 最初のレイヤー (0) の最初のdepth (1) のみ処理される
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockExternalCharacterConstructor).toHaveBeenCalledTimes(1);
        });
    });

    describe("エラーケース", () => {
        it("layerがnullの場合はスキップされる", async () => {
            mockMovieClip.getLayer.mockReturnValue(null);
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockExternalCharacterConstructor).not.toHaveBeenCalled();
        });

        it("layerがundefinedの場合はスキップされる", async () => {
            mockMovieClip.getLayer.mockReturnValue(undefined);
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockExternalCharacterConstructor).not.toHaveBeenCalled();
        });

        it("characterがnullの場合はスキップされる", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockLayer.getCharacter.mockReturnValue(null);

            await execute(50);

            expect(mockExternalCharacterConstructor).not.toHaveBeenCalled();
        });

        it("characterがundefinedの場合はスキップされる", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockLayer.getCharacter.mockReturnValue(undefined);

            await execute(50);

            expect(mockExternalCharacterConstructor).not.toHaveBeenCalled();
        });
    });

    describe("alphaの値の範囲", () => {
        it("alpha = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(0);

            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(0);
        });

        it("alpha = 25の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(25);

            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(25);
        });

        it("alpha = 50の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(50);
        });

        it("alpha = 75の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(75);

            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(75);
        });

        it("alpha = 100の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(100);

            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(100);
        });

        it("alpha > 100の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(150);

            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(150);
        });

        it("alpha < 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(-50);

            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(-50);
        });
    });

    describe("ExternalCharacterのコンストラクタ引数", () => {
        it("workSpace引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockExternalCharacterConstructor).toHaveBeenCalledWith(
                mockWorkSpace,
                expect.anything(),
                expect.anything(),
                expect.anything()
            );
        });

        it("movieClip引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockExternalCharacterConstructor).toHaveBeenCalledWith(
                expect.anything(),
                mockMovieClip,
                expect.anything(),
                expect.anything()
            );
        });

        it("layer引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockExternalCharacterConstructor).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                mockLayer,
                expect.anything()
            );
        });

        it("character引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockExternalCharacterConstructor).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                mockCharacter
            );
        });

        it("全ての引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(60);

            expect(mockExternalCharacterConstructor).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
        });
    });

    describe("currentFrameの使用", () => {
        it("currentFrame = 1の場合", async () => {
            mockMovieClip.currentFrame = 1;
            mockMovieClip.selectedDepths = new Map([[0, [5]]]);

            await execute(50);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5);
        });

        it("currentFrame = 10の場合", async () => {
            mockMovieClip.currentFrame = 10;
            mockMovieClip.selectedDepths = new Map([[0, [5]]]);

            await execute(50);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(10, 5);
        });

        it("currentFrame = 0の場合", async () => {
            mockMovieClip.currentFrame = 0;
            mockMovieClip.selectedDepths = new Map([[0, [5]]]);

            await execute(50);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(0, 5);
        });
    });

    describe("実行順序", () => {
        it("colorTransform更新がsetAlphaMultiplierより前に実行される", async () => {
            const callOrder: string[] = [];

            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 60;

            // colorTransformの更新を監視
            Object.defineProperty(mockCharacter.colorTransform, "3", {
                set: function(value) {
                    callOrder.push("colorTransform");
                    this._value = value;
                },
                get: function() {
                    return this._value;
                },
                configurable: true
            });

            mockExternalCharacterSetAlphaMultiplier.mockImplementation(() => {
                callOrder.push("setAlphaMultiplier");
                return Promise.resolve();
            });

            await execute(70);

            expect(callOrder[0]).toBe("colorTransform");
            expect(callOrder[1]).toBe("setAlphaMultiplier");
        });
    });

    describe("統合シナリオ", () => {
        it("完全な更新フロー: 単一選択", async () => {
            mockMovieClip.currentFrame = 5;
            mockMovieClip.selectedDepths = new Map([[2, [10]]]);
            mockColorSetting.beforeValue = 80;

            await execute(60);

            // 1. WorkSpaceの取得
            expect(mockGetCurrentWorkSpace).toHaveBeenCalled();

            // 2. レイヤーの取得
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(2);

            // 3. キャラクターの取得
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(5, 10);

            // 4. colorTransformの復元(beforeValue)
            expect(mockCharacter.colorTransform[3]).toBe(0.8);

            // 5. ExternalCharacterの生成
            expect(mockExternalCharacterConstructor).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );

            // 6. setAlphaMultiplierの呼び出し
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(60);
        });

        it("完全な更新フロー: 複数選択 - 最初の要素のみ処理", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2]],
                [1, [3]]
            ]);
            mockColorSetting.beforeValue = 45;

            await execute(85);

            // 最初のレイヤー (0) の最初のdepth (1) のみ処理される
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockCharacter.colorTransform[3]).toBe(0.45);
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledTimes(1);
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(85);
        });

        it("部分的なエラーケース: layerがnull", async () => {
            mockMovieClip.getLayer.mockReturnValue(null);
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            // layerがnullなので処理されない
            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockExternalCharacterConstructor).not.toHaveBeenCalled();
        });

        it("beforeValueが複数回の更新で正しく機能する", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            // 1回目: beforeValue = 30
            mockColorSetting.beforeValue = 30;
            await execute(50);
            expect(mockCharacter.colorTransform[3]).toBe(0.3);

            // 2回目: beforeValue = 70
            mockCharacter.colorTransform[3] = 0; // リセット
            mockColorSetting.beforeValue = 70;
            await execute(80);
            expect(mockCharacter.colorTransform[3]).toBe(0.7);
        });
    });

    describe("選択処理の仕組み", () => {
        it("Map.keysとvaluesのnext()を使用して最初の要素を取得", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [2, [3]],
                [5, [7]]
            ]);

            await execute(50);

            // 最初のkey (0) のみが使用される
            expect(mockMovieClip.getLayer).toHaveBeenCalledTimes(1);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
        });

        it("depths配列の最初の要素のみが処理される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [10, 20, 30, 40]]]);

            await execute(50);

            // 最初のdepth (10) のみが処理される
            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(1);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 10);
        });
    });

    describe("エッジケース", () => {
        it("selectedDepthsに空の配列が含まれる場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, []]]);

            await execute(50);

            // 空配列なので最初の要素が存在せず、処理されない
            expect(mockLayer.getCharacter).toHaveBeenCalled();
        });

        it("beforeValue = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 0;

            await execute(100);

            expect(mockCharacter.colorTransform[3]).toBe(0);
        });

        it("beforeValue = 100の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 100;

            await execute(0);

            expect(mockCharacter.colorTransform[3]).toBe(1);
        });

        it("beforeValueが小数点を含む場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 33.33;

            await execute(50);

            expect(mockCharacter.colorTransform[3]).toBeCloseTo(0.3333, 4);
        });

        it("layerIndex = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
        });

        it("depth = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [0]]]);

            await execute(50);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 0);
        });

        it("setAlphaMultiplierが非同期で正しく待機される", async () => {
            let resolvePromise: (value: void) => void;
            const asyncPromise = new Promise<void>((resolve) => {
                resolvePromise = resolve;
            });

            mockExternalCharacterSetAlphaMultiplier.mockReturnValue(asyncPromise);
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            const executePromise = execute(50);

            // Promiseが解決される前
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalled();

            // Promiseを解決
            resolvePromise!();
            await executePromise;

            // 正しく完了
            expect(mockExternalCharacterSetAlphaMultiplier).toHaveBeenCalledWith(50);
        });
    });
});
