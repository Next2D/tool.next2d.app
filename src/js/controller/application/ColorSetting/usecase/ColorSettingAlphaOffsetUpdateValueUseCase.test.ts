import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// モック関数の定義
const mock$getCurrentWorkSpace = vi.fn();
const mockScreenAreaGetElementFromLayerIdAndDepthService = vi.fn();
const mockExternalCharacterSetAlphaOffset = vi.fn();

// colorSettingのモック
const mockColorSetting = {
    beforeValue: 50
};

// vi.mockの呼び出し
vi.mock("@/controller/domain/model/ColorSetting", () => ({
    colorSetting: mockColorSetting
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService", () => ({
    execute: (layerId: string, depth: number) => mockScreenAreaGetElementFromLayerIdAndDepthService(layerId, depth)
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: vi.fn().mockImplementation(function() { return {
        setAlphaOffset: mockExternalCharacterSetAlphaOffset
    }; })
}));

// 動的インポート
const { execute } = await import("./ColorSettingAlphaOffsetUpdateValueUseCase");
const { ExternalCharacter } = await import("@/external/core/domain/model/ExternalCharacter");

describe("ColorSettingAlphaOffsetUpdateValueUseCase", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockNode: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // モックNode
        mockNode = {
            querySelector: vi.fn()
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

        // モックWorkSpace
        mockWorkSpace = {
            scene: mockMovieClip
        };

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(mockNode);
        mockExternalCharacterSetAlphaOffset.mockResolvedValue(undefined);

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
            expect(ExternalCharacter).not.toHaveBeenCalled();
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

            expect(ExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
        });

        it("setAlphaOffsetが呼ばれる", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(70);

            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(70);
        });

        it("colorTransform[7]がbeforeValueで更新される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 80;

            await execute(60);

            // Math.floor(beforeValue) = Math.floor(80) = 80
            expect(mockCharacter.colorTransform[7]).toBe(80);
        });
    });

    describe("beforeValueの使用", () => {
        it("beforeValue = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 0;

            await execute(50);

            expect(mockCharacter.colorTransform[7]).toBe(0);
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(50);
        });

        it("beforeValue = 50の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 50;

            await execute(75);

            expect(mockCharacter.colorTransform[7]).toBe(50);
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(75);
        });

        it("beforeValue = 100の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 100;

            await execute(25);

            expect(mockCharacter.colorTransform[7]).toBe(100);
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(25);
        });

        it("beforeValueが変更されても正しく反映される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            // 最初はbeforeValue = 50
            mockColorSetting.beforeValue = 50;
            await execute(60);
            expect(mockCharacter.colorTransform[7]).toBe(50);

            // beforeValueを変更
            mockCharacter.colorTransform[7] = 0; // リセット
            mockColorSetting.beforeValue = 80;
            await execute(90);
            expect(mockCharacter.colorTransform[7]).toBe(80);
        });
    });

    describe("複数の選択", () => {
        it("単一レイヤー、単一depth", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [5]]]);
            mockColorSetting.beforeValue = 60;

            await execute(70);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 5);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5);
            expect(mockCharacter.colorTransform[7]).toBe(60);
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(70);
        });

        it("単一レイヤー、複数depths(最初のdepthのみ処理)", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1, 2, 3]]]);
            mockColorSetting.beforeValue = 40;

            await execute(80);

            // 最初のdepthのみ処理される
            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(1);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockCharacter.colorTransform[7]).toBe(40);
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledTimes(1);
        });

        it("複数レイヤー、各レイヤーに単一depth(最初のレイヤーのみ処理)", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [1, [2]]
            ]);
            mockColorSetting.beforeValue = 30;

            await execute(90);

            // 最初のレイヤーのみ処理される
            expect(mockMovieClip.getLayer).toHaveBeenCalledTimes(1);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(ExternalCharacter).toHaveBeenCalledTimes(1);
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledTimes(1);
        });

        it("複数レイヤー、複数depths(最初のレイヤーの最初のdepthのみ処理)", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2]],
                [1, [3, 4]]
            ]);

            await execute(50);

            // 最初のレイヤーの最初のdepthのみ処理される
            expect(mockMovieClip.getLayer).toHaveBeenCalledTimes(1);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledTimes(1);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 1);
            expect(ExternalCharacter).toHaveBeenCalledTimes(1);
        });
    });

    describe("エラーケース", () => {
        it("layerがnullの場合はスキップされる", async () => {
            mockMovieClip.getLayer.mockReturnValue(null);
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("layerがundefinedの場合はスキップされる", async () => {
            mockMovieClip.getLayer.mockReturnValue(undefined);
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
        });

        it("nodeがnullの場合はスキップされる", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(null);

            await execute(50);

            // nodeチェックはcharacterチェックの後なのでgetCharacterは呼ばれる
            expect(mockLayer.getCharacter).toHaveBeenCalled();
            expect(ExternalCharacter).not.toHaveBeenCalled();
        });

        it("nodeがundefinedの場合はスキップされる", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockScreenAreaGetElementFromLayerIdAndDepthService.mockReturnValue(undefined);

            await execute(50);

            // nodeチェックはcharacterチェックの後なのでgetCharacterは呼ばれる
            expect(mockLayer.getCharacter).toHaveBeenCalled();
            expect(ExternalCharacter).not.toHaveBeenCalled();
        });

        it("characterがnullの場合はスキップされる", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockLayer.getCharacter.mockReturnValue(null);

            await execute(50);

            expect(ExternalCharacter).not.toHaveBeenCalled();
        });

        it("characterがundefinedの場合はスキップされる", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockLayer.getCharacter.mockReturnValue(undefined);

            await execute(50);

            expect(ExternalCharacter).not.toHaveBeenCalled();
        });

        it("複数depthsがあっても最初のdepthでエラーなら何もしない", async () => {
            mockLayer.getCharacter.mockReturnValue(null);
            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);

            await execute(50);

            // 最初のdepthがnullなので何も処理されない
            expect(ExternalCharacter).not.toHaveBeenCalled();
        });
    });

    describe("alphaの値の範囲", () => {
        it("alpha = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(0);

            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(0);
        });

        it("alpha = 25の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(25);

            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(25);
        });

        it("alpha = 50の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(50);
        });

        it("alpha = 75の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(75);

            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(75);
        });

        it("alpha = 100の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(100);

            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(100);
        });

        it("alpha > 100の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(150);

            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(150);
        });

        it("alpha < 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(-50);

            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(-50);
        });
    });

    describe("ExternalCharacterのコンストラクタ引数", () => {
        it("workSpace引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(ExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                expect.anything(),
                expect.anything(),
                expect.anything()
            );
        });

        it("movieClip引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(ExternalCharacter).toHaveBeenCalledWith(
                expect.anything(),
                mockMovieClip,
                expect.anything(),
                expect.anything()
            );
        });

        it("layer引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(ExternalCharacter).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                mockLayer,
                expect.anything()
            );
        });

        it("character引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(ExternalCharacter).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                mockCharacter
            );
        });

        it("全ての引数が正しく渡される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(60);

            expect(ExternalCharacter).toHaveBeenCalledWith(
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
        it("colorTransform更新がsetAlphaOffsetより前に実行される", async () => {
            const callOrder: string[] = [];

            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 60;

            // colorTransformの更新を監視
            Object.defineProperty(mockCharacter.colorTransform, "7", {
                set: function(value) {
                    callOrder.push("colorTransform");
                    this._value = value;
                },
                get: function() {
                    return this._value;
                },
                configurable: true
            });

            mockExternalCharacterSetAlphaOffset.mockImplementation(() => {
                callOrder.push("setAlphaOffset");
                return Promise.resolve();
            });

            await execute(70);

            expect(callOrder[0]).toBe("colorTransform");
            expect(callOrder[1]).toBe("setAlphaOffset");
        });
    });

    describe("統合シナリオ", () => {
        it("完全な更新フロー: 単一選択", async () => {
            mockMovieClip.currentFrame = 5;
            mockMovieClip.selectedDepths = new Map([[2, [10]]]);
            mockColorSetting.beforeValue = 80;

            await execute(60);

            // 1. WorkSpaceの取得
            expect(mock$getCurrentWorkSpace).toHaveBeenCalled();

            // 2. レイヤーの取得
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(2);

            // 3. ノードの取得
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 10);

            // 4. キャラクターの取得
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(5, 10);

            // 5. colorTransformの復元(beforeValue)
            expect(mockCharacter.colorTransform[7]).toBe(80);

            // 6. ExternalCharacterの生成
            expect(ExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );

            // 7. setAlphaOffsetの呼び出し
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(60);
        });

        it("完全な更新フロー: 複数depths(最初のみ処理)", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2]],
                [1, [3]]
            ]);
            mockColorSetting.beforeValue = 45;

            await execute(85);

            // 最初のレイヤーの最初のdepthのみ処理される
            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(1);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
            expect(mockCharacter.colorTransform[7]).toBe(45);
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledTimes(1);
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(85);
        });

        it("部分的なエラーケース: 最初のlayerがnull", async () => {
            mockMovieClip.getLayer.mockReturnValue(null);
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [1, [2]]
            ]);

            await execute(50);

            // 最初のレイヤーがnullなので何も処理されない
            expect(ExternalCharacter).not.toHaveBeenCalled();
        });

        it("beforeValueが複数回の更新で正しく機能する", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            // 1回目: beforeValue = 30
            mockColorSetting.beforeValue = 30;
            await execute(50);
            expect(mockCharacter.colorTransform[7]).toBe(30);

            // 2回目: beforeValue = 70
            mockCharacter.colorTransform[7] = 0; // リセット
            mockColorSetting.beforeValue = 70;
            await execute(80);
            expect(mockCharacter.colorTransform[7]).toBe(70);
        });
    });

    describe("Map.entriesの反復処理", () => {
        it("最初のレイヤーのみ取得される", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1]],
                [2, [3]],
                [5, [7]]
            ]);

            await execute(50);

            // 最初のレイヤーのみ処理される
            expect(mockMovieClip.getLayer).toHaveBeenCalledTimes(1);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
        });

        it("最初のdepthのみ取得される", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [10, 20, 30, 40]]]);

            await execute(50);

            // 最初のdepthのみ処理される
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledTimes(1);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 10);
        });
    });

    describe("エッジケース", () => {
        it("selectedDepthsに空の配列が含まれる場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, []]]);
            mockLayer.getCharacter.mockReturnValue(null);

            await execute(50);

            // values[0]がundefinedとなり、getCharacter(1, undefined)でnullが返るため、
            // screenAreaGetElementFromLayerIdAndDepthServiceは呼ばれない
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, undefined);
            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).not.toHaveBeenCalled();
            expect(ExternalCharacter).not.toHaveBeenCalled();
        });

        it("beforeValue = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 0;

            await execute(100);

            expect(mockCharacter.colorTransform[7]).toBe(0);
        });

        it("beforeValue = 100の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 100;

            await execute(0);

            expect(mockCharacter.colorTransform[7]).toBe(100);
        });

        it("beforeValueが小数点を含む場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockColorSetting.beforeValue = 33.33;

            await execute(50);

            expect(mockCharacter.colorTransform[7]).toBe(33.33);
        });

        it("layerIndex = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute(50);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
        });

        it("depth = 0の場合", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [0]]]);

            await execute(50);

            expect(mockScreenAreaGetElementFromLayerIdAndDepthService).toHaveBeenCalledWith("layer-1", 0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 0);
        });

        it("setAlphaOffsetが非同期で正しく待機される", async () => {
            let resolvePromise: (value: void) => void;
            const asyncPromise = new Promise<void>((resolve) => {
                resolvePromise = resolve;
            });

            mockExternalCharacterSetAlphaOffset.mockReturnValue(asyncPromise);
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            const executePromise = execute(50);

            // Promiseが解決される前
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalled();

            // Promiseを解決
            resolvePromise!();
            await executePromise;

            // 正しく完了
            expect(mockExternalCharacterSetAlphaOffset).toHaveBeenCalledWith(50);
        });
    });
});
