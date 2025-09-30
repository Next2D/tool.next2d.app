import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ScreenAreaUpdateMovedLayerService";

// モック設定
const mockGetCurrentWorkSpace = vi.fn();
const mockExternalLayer = vi.fn();

vi.mock("@/config/ScreenConfig", () => ({
    $SCREEN_STAGE_AREA_ID: "screen-stage-area"
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/external/core/domain/model/ExternalLayer", () => ({
    ExternalLayer: mockExternalLayer
}));

describe("ScreenAreaUpdateMovedLayerService", () => {
    let mockLayer: any;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockExternalLayerInstance: any;
    let mockStageElement: HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();

        // DOM環境のセットアップ
        document.body.innerHTML = '<div id="screen-stage-area"></div>';
        mockStageElement = document.getElementById("screen-stage-area") as HTMLElement;

        // Layer モック
        mockLayer = {
            id: "layer-1",
            getActiveCharacters: vi.fn()
        };

        // ExternalLayer インスタンスモック
        mockExternalLayerInstance = {
            index: 2
        };

        // MovieClip モック
        mockMovieClip = {
            currentFrame: 1,
            getLayer: vi.fn()
        };

        // WorkSpace モック
        mockWorkSpace = {
            scene: mockMovieClip
        };

        // モック関数の設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockExternalLayer.mockReturnValue(mockExternalLayerInstance);

        // insertAdjacentElement のモック
        Element.prototype.insertAdjacentElement = vi.fn();
        Element.prototype.appendChild = vi.fn();
    });

    afterEach(() => {
        vi.resetAllMocks();
        // DOM のクリーンアップ
        document.body.innerHTML = "";
    });

    describe("早期リターン条件", () => {
        it("アクティブキャラクターが存在しない場合は何もしない", () => {
            mockLayer.getActiveCharacters.mockReturnValue([]);

            execute(mockLayer);

            expect(mockLayer.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
        });

        it("ステージ要素が存在しない場合は何もしない", () => {
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);

            // ステージ要素を削除
            document.body.innerHTML = "";

            execute(mockLayer);

            expect(mockLayer.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(mockGetCurrentWorkSpace).toHaveBeenCalledOnce();
        });

        it("アクティブキャラクターのみ存在確認", () => {
            const activeCharacters = [{ id: "char1" }, { id: "char2" }];
            mockLayer.getActiveCharacters.mockReturnValue(activeCharacters);

            // レイヤーIDの要素が存在しない場合
            execute(mockLayer);

            expect(mockLayer.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(mockGetCurrentWorkSpace).toHaveBeenCalledOnce();
            expect(mockExternalLayer).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip, mockLayer);
        });
    });

    describe("index === -1 の場合（最下位レイヤー）", () => {
        beforeEach(() => {
            mockExternalLayerInstance.index = 0; // index - 1 = -1
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
        });

        it("移動対象の要素をステージの最下位に配置する", () => {
            const element1 = document.createElement("div");
            element1.className = "layer-id-layer-1";
            const element2 = document.createElement("div");
            element2.className = "layer-id-layer-1";

            mockStageElement.appendChild(element1);
            mockStageElement.appendChild(element2);

            execute(mockLayer);

            expect(mockStageElement.appendChild).toHaveBeenCalledWith(element1);
            expect(mockStageElement.appendChild).toHaveBeenCalledWith(element2);
            expect(mockStageElement.appendChild).toHaveBeenCalledTimes(4); // 初期2回 + 移動2回
        });

        it("移動要素がnullの場合はスキップする", () => {
            // querySelectorAllのモックで一部null要素を含む
            const originalQuerySelectorAll = mockStageElement.querySelectorAll;
            mockStageElement.querySelectorAll = vi.fn().mockReturnValue([
                document.createElement("div"),
                null,
                document.createElement("div")
            ] as any);

            execute(mockLayer);

            expect(mockStageElement.appendChild).toHaveBeenCalledTimes(2); // nullを除く2回
        });

        it("移動対象の要素が存在しない場合", () => {
            // layer-id-layer-1 のクラスを持つ要素がない状態

            execute(mockLayer);

            expect(mockStageElement.appendChild).not.toHaveBeenCalled();
        });
    });

    describe("index > -1 の場合（上位レイヤー検索）", () => {
        beforeEach(() => {
            mockExternalLayerInstance.index = 3; // index - 1 = 2 から開始
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
        });

        it("上位レイヤーに配置されている要素の前に移動要素を配置する", () => {
            // 移動対象の要素
            const moveElement1 = document.createElement("div");
            moveElement1.className = "layer-id-layer-1";
            const moveElement2 = document.createElement("div");
            moveElement2.className = "layer-id-layer-1";
            mockStageElement.appendChild(moveElement1);
            mockStageElement.appendChild(moveElement2);

            // 上位レイヤーの要素
            const upperElement = document.createElement("div");
            upperElement.className = "layer-id-upper-layer";
            mockStageElement.appendChild(upperElement);

            // 上位レイヤーの設定
            const mockUpperLayer = {
                id: "upper-layer",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "upperChar" }])
            };
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 2 ? mockUpperLayer : null;
            });

            execute(mockLayer);

            // 逆順で挿入される（elemets.length - 1 から 0 まで）
            expect(upperElement.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", moveElement2);
            expect(upperElement.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", moveElement1);
            expect(upperElement.insertAdjacentElement).toHaveBeenCalledTimes(2);
        });

        it("複数の上位レイヤーがある場合、最初に見つかったレイヤーで配置する", () => {
            const moveElement = document.createElement("div");
            moveElement.className = "layer-id-layer-1";
            mockStageElement.appendChild(moveElement);

            // 複数の上位レイヤー要素
            const upperElement1 = document.createElement("div");
            upperElement1.className = "layer-id-upper-layer-1";
            const upperElement2 = document.createElement("div");
            upperElement2.className = "layer-id-upper-layer-2";
            mockStageElement.appendChild(upperElement1);
            mockStageElement.appendChild(upperElement2);

            // 上位レイヤーの設定（index=2で見つかる）
            const mockUpperLayer1 = {
                id: "upper-layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char1" }])
            };
            const mockUpperLayer2 = {
                id: "upper-layer-2",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char2" }])
            };

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 2: return mockUpperLayer1;
                    case 1: return mockUpperLayer2;
                    default: return null;
                }
            });

            execute(mockLayer);

            // 最初に見つかったレイヤー（index=2）で配置され、ループ終了
            expect(upperElement1.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", moveElement);
            expect(upperElement2.insertAdjacentElement).not.toHaveBeenCalled();
        });

        it("上位レイヤーに複数の要素がある場合、最後の要素の前に配置する", () => {
            const moveElement = document.createElement("div");
            moveElement.className = "layer-id-layer-1";
            mockStageElement.appendChild(moveElement);

            // 上位レイヤーに複数要素
            const upperElement1 = document.createElement("div");
            upperElement1.className = "layer-id-upper-layer";
            const upperElement2 = document.createElement("div");
            upperElement2.className = "layer-id-upper-layer";
            mockStageElement.appendChild(upperElement1);
            mockStageElement.appendChild(upperElement2);

            const mockUpperLayer = {
                id: "upper-layer",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char1" }])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            execute(mockLayer);

            // 最後の要素（upperElement2）の前に配置
            expect(upperElement2.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", moveElement);
            expect(upperElement1.insertAdjacentElement).not.toHaveBeenCalled();
        });
    });

    describe("上位レイヤー検索のスキップ条件", () => {
        beforeEach(() => {
            mockExternalLayerInstance.index = 3;
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);

            const moveElement = document.createElement("div");
            moveElement.className = "layer-id-layer-1";
            mockStageElement.appendChild(moveElement);
        });

        it("上位レイヤーが存在しない場合はスキップして次を検索", () => {
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 0 ? { 
                    id: "layer-0", 
                    getActiveCharacters: vi.fn().mockReturnValue([{ id: "char" }])
                } : null;
            });

            const layer0Element = document.createElement("div");
            layer0Element.className = "layer-id-layer-0";
            mockStageElement.appendChild(layer0Element);

            execute(mockLayer);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(2);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(1);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(layer0Element.insertAdjacentElement).toHaveBeenCalled();
        });

        it("上位レイヤーにアクティブキャラクターがない場合はスキップ", () => {
            const mockUpperLayer1 = {
                id: "upper-layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([]) // アクティブキャラクターなし
            };
            const mockUpperLayer2 = {
                id: "upper-layer-2",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char" }])
            };

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 2: return mockUpperLayer1;
                    case 1: return mockUpperLayer2;
                    default: return null;
                }
            });

            const layer2Element = document.createElement("div");
            layer2Element.className = "layer-id-upper-layer-2";
            mockStageElement.appendChild(layer2Element);

            execute(mockLayer);

            expect(mockUpperLayer1.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(mockUpperLayer2.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(layer2Element.insertAdjacentElement).toHaveBeenCalled();
        });

        it("上位レイヤーに対応するDOM要素がない場合はスキップ", () => {
            const mockUpperLayer1 = {
                id: "upper-layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char1" }])
            };
            const mockUpperLayer2 = {
                id: "upper-layer-2",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char2" }])
            };

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 2: return mockUpperLayer1;
                    case 1: return mockUpperLayer2;
                    default: return null;
                }
            });

            // upper-layer-1 に対応するDOM要素は作成しない
            // upper-layer-2 に対応するDOM要素のみ作成
            const layer2Element = document.createElement("div");
            layer2Element.className = "layer-id-upper-layer-2";
            mockStageElement.appendChild(layer2Element);

            execute(mockLayer);

            expect(layer2Element.insertAdjacentElement).toHaveBeenCalled();
        });
    });

    describe("移動要素の処理", () => {
        beforeEach(() => {
            mockExternalLayerInstance.index = 2;
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
        });

        it("移動要素がnullの場合はスキップする", () => {
            // null要素を含むquerySelectorAllの結果をモック
            const originalQuerySelectorAll = mockStageElement.querySelectorAll;
            mockStageElement.querySelectorAll = vi.fn().mockImplementation((selector) => {
                if (selector === ".layer-id-layer-1") {
                    return [null, document.createElement("div"), null] as any;
                }
                return originalQuerySelectorAll.call(mockStageElement, selector);
            });

            const mockUpperLayer = {
                id: "upper-layer",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char" }])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            const upperElement = document.createElement("div");
            upperElement.className = "layer-id-upper-layer";
            mockStageElement.appendChild(upperElement);

            execute(mockLayer);

            // null要素は除外され、有効な1要素のみ処理される
            expect(upperElement.insertAdjacentElement).toHaveBeenCalledTimes(1);
        });

        it("移動要素が複数ある場合、逆順で処理される", () => {
            const element1 = document.createElement("div");
            element1.id = "element-1";
            element1.className = "layer-id-layer-1";
            const element2 = document.createElement("div");
            element2.id = "element-2";
            element2.className = "layer-id-layer-1";
            const element3 = document.createElement("div");
            element3.id = "element-3";
            element3.className = "layer-id-layer-1";

            mockStageElement.appendChild(element1);
            mockStageElement.appendChild(element2);
            mockStageElement.appendChild(element3);

            const mockUpperLayer = {
                id: "upper-layer",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char" }])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            const upperElement = document.createElement("div");
            upperElement.className = "layer-id-upper-layer";
            mockStageElement.appendChild(upperElement);

            execute(mockLayer);

            // 逆順で処理される（index 2, 1, 0の順）
            expect(upperElement.insertAdjacentElement).toHaveBeenCalledTimes(3);
            expect(upperElement.insertAdjacentElement).toHaveBeenNthCalledWith(1, "beforebegin", element3);
            expect(upperElement.insertAdjacentElement).toHaveBeenNthCalledWith(2, "beforebegin", element2);
            expect(upperElement.insertAdjacentElement).toHaveBeenNthCalledWith(3, "beforebegin", element1);
        });
    });

    describe("currentFrameの使用", () => {
        it("異なるフレームでアクティブキャラクターを取得する", () => {
            mockMovieClip.currentFrame = 5;
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
            mockExternalLayerInstance.index = 0; // 最下位レイヤーパス

            const element = document.createElement("div");
            element.className = "layer-id-layer-1";
            mockStageElement.appendChild(element);

            execute(mockLayer);

            expect(mockLayer.getActiveCharacters).toHaveBeenCalledWith(5);
        });

        it("上位レイヤー検索時もcurrentFrameが使用される", () => {
            mockMovieClip.currentFrame = 3;
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
            mockExternalLayerInstance.index = 2;

            const element = document.createElement("div");
            element.className = "layer-id-layer-1";
            mockStageElement.appendChild(element);

            const mockUpperLayer = {
                id: "upper-layer",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char" }])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            const upperElement = document.createElement("div");
            upperElement.className = "layer-id-upper-layer";
            mockStageElement.appendChild(upperElement);

            execute(mockLayer);

            expect(mockUpperLayer.getActiveCharacters).toHaveBeenCalledWith(3);
        });
    });

    describe("エラーハンドリング", () => {
        it("getCurrentWorkSpaceで例外が発生した場合", () => {
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
            mockGetCurrentWorkSpace.mockImplementation(() => {
                throw new Error("getCurrentWorkSpace failed");
            });

            expect(() => execute(mockLayer)).toThrow("getCurrentWorkSpace failed");
        });

        it("ExternalLayerコンストラクタで例外が発生した場合", () => {
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
            mockExternalLayer.mockImplementation(() => {
                throw new Error("ExternalLayer failed");
            });

            expect(() => execute(mockLayer)).toThrow("ExternalLayer failed");
        });

        it("getLayerで例外が発生した場合", () => {
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
            mockExternalLayerInstance.index = 2;

            const element = document.createElement("div");
            element.className = "layer-id-layer-1";
            mockStageElement.appendChild(element);

            mockMovieClip.getLayer.mockImplementation(() => {
                throw new Error("getLayer failed");
            });

            expect(() => execute(mockLayer)).toThrow("getLayer failed");
        });

        it("insertAdjacentElementで例外が発生した場合", () => {
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
            mockExternalLayerInstance.index = 2;

            const element = document.createElement("div");
            element.className = "layer-id-layer-1";
            mockStageElement.appendChild(element);

            const mockUpperLayer = {
                id: "upper-layer",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char" }])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            const upperElement = document.createElement("div");
            upperElement.className = "layer-id-upper-layer";
            upperElement.insertAdjacentElement = vi.fn().mockImplementation(() => {
                throw new Error("insertAdjacentElement failed");
            });
            mockStageElement.appendChild(upperElement);

            expect(() => execute(mockLayer)).toThrow("insertAdjacentElement failed");
        });

        it("appendChildで例外が発生した場合", () => {
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
            mockExternalLayerInstance.index = 0; // 最下位レイヤーパス

            const element = document.createElement("div");
            element.className = "layer-id-layer-1";
            mockStageElement.appendChild(element);

            mockStageElement.appendChild = vi.fn().mockImplementation(() => {
                throw new Error("appendChild failed");
            });

            expect(() => execute(mockLayer)).toThrow("appendChild failed");
        });
    });

    describe("エッジケース", () => {
        it("layerがnullの場合", () => {
            expect(() => execute(null as any)).toThrow();
        });

        it("layerがundefinedの場合", () => {
            expect(() => execute(undefined as any)).toThrow();
        });

        it("layer.idがundefinedの場合", () => {
            mockLayer.id = undefined;
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);

            // undefinedの場合、クラス名は "layer-id-undefined" になる
            expect(() => execute(mockLayer)).not.toThrow();
        });

        it("ExternalLayerのindexが非常に大きい場合", () => {
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
            mockExternalLayerInstance.index = 1000;

            const element = document.createElement("div");
            element.className = "layer-id-layer-1";
            mockStageElement.appendChild(element);

            // 999から-1まで検索するが、該当レイヤーが見つからない
            mockMovieClip.getLayer.mockReturnValue(null);

            execute(mockLayer);

            // 最終的に配置されない
            expect(element.insertAdjacentElement).not.toHaveBeenCalled();
            expect(mockStageElement.appendChild).toHaveBeenCalledTimes(1); // 初期配置のみ
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量の移動要素でも効率的に処理する", () => {
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }]);
            mockExternalLayerInstance.index = 2;

            // 100個の移動要素を作成
            for (let i = 0; i < 100; i++) {
                const element = document.createElement("div");
                element.className = "layer-id-layer-1";
                element.id = `element-${i}`;
                mockStageElement.appendChild(element);
            }

            const mockUpperLayer = {
                id: "upper-layer",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char" }])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            const upperElement = document.createElement("div");
            upperElement.className = "layer-id-upper-layer";
            mockStageElement.appendChild(upperElement);

            const start = performance.now();
            execute(mockLayer);
            const end = performance.now();
            const duration = end - start;

            // 100要素の処理が50ms以内で完了することを期待
            expect(duration).toBeLessThan(50);
            expect(upperElement.insertAdjacentElement).toHaveBeenCalledTimes(100);
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際のレイヤー移動シナリオ：中間レイヤーから最下位への移動", () => {
            // シナリオ：レイヤーが中間位置から最下位に移動

            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char1" }, { id: "char2" }]);
            mockExternalLayerInstance.index = 0; // 最下位レイヤー

            // 移動対象の要素
            const element1 = document.createElement("div");
            element1.className = "layer-id-layer-1";
            element1.textContent = "Element 1";
            const element2 = document.createElement("div");
            element2.className = "layer-id-layer-1";
            element2.textContent = "Element 2";

            mockStageElement.appendChild(element1);
            mockStageElement.appendChild(element2);

            execute(mockLayer);

            // 最下位への移動なので appendChild が呼ばれる
            expect(mockStageElement.appendChild).toHaveBeenCalledWith(element1);
            expect(mockStageElement.appendChild).toHaveBeenCalledWith(element2);
            expect(mockStageElement.appendChild).toHaveBeenCalledTimes(4); // 初期2回 + 移動2回
        });

        it("複雑なレイヤー階層での移動処理", () => {
            // シナリオ：5層のレイヤー構造で3層目から1層目に移動

            mockLayer.id = "layer-3";
            mockLayer.getActiveCharacters.mockReturnValue([{ id: "char3" }]);
            mockExternalLayerInstance.index = 3; // 3層目、上位レイヤーは index 2, 1

            // 移動対象の要素
            const moveElement = document.createElement("div");
            moveElement.className = "layer-id-layer-3";
            mockStageElement.appendChild(moveElement);

            // 上位レイヤー（layer-1）に要素が存在
            const layer1Element = document.createElement("div");
            layer1Element.className = "layer-id-layer-1";
            mockStageElement.appendChild(layer1Element);

            // レイヤー構造の設定
            const mockLayer2 = {
                id: "layer-2",
                getActiveCharacters: vi.fn().mockReturnValue([]) // アクティブキャラクターなし
            };
            const mockLayer1 = {
                id: "layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char1" }])
            };

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 2: return mockLayer2;
                    case 1: return mockLayer1;
                    case 0: return null;
                    default: return null;
                }
            });

            execute(mockLayer);

            // layer-2 はアクティブキャラクターなしでスキップ
            // layer-1 で配置が決定
            expect(mockLayer2.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(mockLayer1.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(layer1Element.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", moveElement);
        });
    });
});
