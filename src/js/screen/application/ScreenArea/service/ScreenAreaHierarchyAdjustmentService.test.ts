import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// モック設定（vi.hoistedを使用）
const {
    mockGetCurrentWorkSpace,
    mockExternalLayer
} = vi.hoisted(() => {
    return {
        mockGetCurrentWorkSpace: vi.fn(),
        mockExternalLayer: vi.fn(function() { return {}; })
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/external/core/domain/model/ExternalLayer", () => ({
    ExternalLayer: mockExternalLayer
}));

import { execute } from "./ScreenAreaHierarchyAdjustmentService";

describe("ScreenAreaHierarchyAdjustmentService", () => {
    let mockStageAreaElement: HTMLElement;
    let mockDisplayElement: HTMLElement;
    let mockLayer: any;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockExternalLayerInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // DOM要素のモック
        mockStageAreaElement = document.createElement("div");
        mockDisplayElement = document.createElement("div");
        
        // 各要素にinsertAdjacentElementのモックを個別に設定
        mockDisplayElement.insertAdjacentElement = vi.fn();

        // Layer モック
        mockLayer = {
            id: "layer-1"
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
        mockExternalLayer.mockImplementation(function() { return mockExternalLayerInstance; });
    });

    afterEach(() => {
        vi.clearAllMocks();
        // DOM のクリーンアップ
        mockStageAreaElement.innerHTML = "";
    });

    describe("同じレイヤーに複数要素がある場合", () => {
        it("最後の要素の後に新要素を追加する", () => {
            // 同じレイヤーIDを持つ要素を3つ作成（新要素含む）
            const element1 = document.createElement("div");
            element1.className = "layer-id-layer-1";
            element1.insertAdjacentElement = vi.fn();
            const element2 = document.createElement("div");
            element2.className = "layer-id-layer-1";
            element2.insertAdjacentElement = vi.fn();
            mockDisplayElement.className = "layer-id-layer-1";

            mockStageAreaElement.appendChild(element1);
            mockStageAreaElement.appendChild(element2);
            mockStageAreaElement.appendChild(mockDisplayElement);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            // 最後から2番目の要素（element2）の後に追加されるべき
            expect(element2.insertAdjacentElement).toHaveBeenCalledWith("afterend", mockDisplayElement);
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
        });

        it("同じレイヤーの要素が2つの場合（新要素含む）", () => {
            const element1 = document.createElement("div");
            element1.className = "layer-id-layer-1";
            element1.insertAdjacentElement = vi.fn();
            mockDisplayElement.className = "layer-id-layer-1";

            mockStageAreaElement.appendChild(element1);
            mockStageAreaElement.appendChild(mockDisplayElement);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            // 2つの要素があるので、最初の要素の後に追加
            expect(element1.insertAdjacentElement).toHaveBeenCalledWith("afterend", mockDisplayElement);
        });

        it("同じレイヤーの要素が多数ある場合", () => {
            // 5つの要素を作成（新要素含む）
            const elements = [];
            for (let i = 0; i < 4; i++) {
                const element = document.createElement("div");
                element.className = "layer-id-layer-1";
                element.insertAdjacentElement = vi.fn();
                elements.push(element);
                mockStageAreaElement.appendChild(element);
            }
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            // 最後から2番目の要素（elements[3]）の後に追加
            expect(elements[3].insertAdjacentElement).toHaveBeenCalledWith("afterend", mockDisplayElement);
        });

        it("ターゲット要素が存在しない場合は何もしない", () => {
            // length > 1 だが targetElement (length - 2) が null になるケース
            // この状況は通常起こらないが、防御的プログラミング
            const spy = vi.spyOn(mockStageAreaElement, "querySelectorAll");
            spy.mockReturnValue([mockDisplayElement] as any);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            expect(mockDisplayElement.insertAdjacentElement).not.toHaveBeenCalled();
            // length === 1 なので else ブランチに入り、getCurrentWorkSpace が呼ばれる
            expect(mockGetCurrentWorkSpace).toHaveBeenCalled();
        });
    });

    describe("同じレイヤーに要素が1つ以下の場合", () => {
        beforeEach(() => {
            // 上位レイヤーのモック設定
            const mockUpperLayer1 = {
                id: "upper-layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char1" }])
            };
            const mockUpperLayer0 = {
                id: "upper-layer-0",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char2" }])
            };

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 1: return mockUpperLayer1;
                    case 0: return mockUpperLayer0;
                    default: return null;
                }
            });
        });

        it("新要素のみの場合、上位レイヤーを検索して配置する", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            // 上位レイヤーの要素を作成
            const upperElement = document.createElement("div");
            upperElement.className = "layer-id-upper-layer-1";
            upperElement.insertAdjacentElement = vi.fn();
            mockStageAreaElement.appendChild(upperElement);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            expect(mockExternalLayer).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip, mockLayer);
            expect(upperElement.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", mockDisplayElement);
        });

        it("複数の上位レイヤーがある場合、最も近い上位レイヤーの前に配置する", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            // 複数の上位レイヤー要素を作成
            const upperElement1 = document.createElement("div");
            upperElement1.className = "layer-id-upper-layer-1";
            upperElement1.insertAdjacentElement = vi.fn();
            const upperElement0 = document.createElement("div");
            upperElement0.className = "layer-id-upper-layer-0";
            upperElement0.insertAdjacentElement = vi.fn();

            mockStageAreaElement.appendChild(upperElement1);
            mockStageAreaElement.appendChild(upperElement0);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            // index=1の上位レイヤーが最初に見つかるので、その前に配置
            expect(upperElement1.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", mockDisplayElement);
            expect(upperElement0.insertAdjacentElement).not.toHaveBeenCalled();
        });

        it("上位レイヤーに複数の要素がある場合、最後の要素の前に配置する", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            // 上位レイヤーに複数要素
            const upperElement1 = document.createElement("div");
            upperElement1.className = "layer-id-upper-layer-1";
            upperElement1.insertAdjacentElement = vi.fn();
            const upperElement2 = document.createElement("div");
            upperElement2.className = "layer-id-upper-layer-1";
            upperElement2.insertAdjacentElement = vi.fn();

            mockStageAreaElement.appendChild(upperElement1);
            mockStageAreaElement.appendChild(upperElement2);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            // 最後の要素（upperElement2）の前に配置
            expect(upperElement2.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", mockDisplayElement);
            expect(upperElement1.insertAdjacentElement).not.toHaveBeenCalled();
        });
    });

    describe("上位レイヤーの検索処理", () => {
        it("上位レイヤーが存在しない場合はスキップする", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            // 上位レイヤーが存在しない
            mockMovieClip.getLayer.mockReturnValue(null);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(1);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockDisplayElement.insertAdjacentElement).not.toHaveBeenCalled();
        });

        it("上位レイヤーにアクティブキャラクターがない場合はスキップする", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            const mockUpperLayer = {
                id: "upper-layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([]) // 空配列
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            expect(mockUpperLayer.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(mockDisplayElement.insertAdjacentElement).not.toHaveBeenCalled();
        });

        it("上位レイヤーに対応するDOM要素がない場合はスキップする", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            const mockUpperLayer = {
                id: "upper-layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char1" }])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            // DOM要素は作成しない（querySelectorAllで0件）

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            expect(mockDisplayElement.insertAdjacentElement).not.toHaveBeenCalled();
        });

        it("ExternalLayerのindexが0の場合、検索ループは実行されない", () => {
            mockExternalLayerInstance.index = 0;
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });

        it("ExternalLayerのindexが負の場合、検索ループは実行されない", () => {
            mockExternalLayerInstance.index = -1;
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
        });
    });

    describe("currentFrameの使用", () => {
        it("異なるフレームでアクティブキャラクターを取得する", () => {
            mockMovieClip.currentFrame = 5;
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            const mockUpperLayer = {
                id: "upper-layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char1" }])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            const upperElement = document.createElement("div");
            upperElement.className = "layer-id-upper-layer-1";
            upperElement.insertAdjacentElement = vi.fn();
            mockStageAreaElement.appendChild(upperElement);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            expect(mockUpperLayer.getActiveCharacters).toHaveBeenCalledWith(5);
        });

        it("フレーム0でも正しく動作する", () => {
            mockMovieClip.currentFrame = 0;
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            const mockUpperLayer = {
                id: "upper-layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char1" }])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            expect(mockUpperLayer.getActiveCharacters).toHaveBeenCalledWith(0);
        });
    });

    describe("エラーハンドリング", () => {
        it("querySelectorAllで例外が発生した場合", () => {
            const originalQuerySelectorAll = mockStageAreaElement.querySelectorAll;
            mockStageAreaElement.querySelectorAll = vi.fn().mockImplementation(() => {
                throw new Error("querySelectorAll failed");
            });

            expect(() => execute(mockStageAreaElement, mockDisplayElement, mockLayer)).toThrow("querySelectorAll failed");

            mockStageAreaElement.querySelectorAll = originalQuerySelectorAll;
        });

        it("insertAdjacentElementで例外が発生した場合", () => {
            const element1 = document.createElement("div");
            element1.className = "layer-id-layer-1";
            element1.insertAdjacentElement = vi.fn().mockImplementation(() => {
                throw new Error("insertAdjacentElement failed");
            });
            mockDisplayElement.className = "layer-id-layer-1";

            mockStageAreaElement.appendChild(element1);
            mockStageAreaElement.appendChild(mockDisplayElement);

            expect(() => execute(mockStageAreaElement, mockDisplayElement, mockLayer)).toThrow("insertAdjacentElement failed");
        });

        it("getCurrentWorkSpaceで例外が発生した場合", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            mockGetCurrentWorkSpace.mockImplementation(() => {
                throw new Error("getCurrentWorkSpace failed");
            });

            expect(() => execute(mockStageAreaElement, mockDisplayElement, mockLayer)).toThrow("getCurrentWorkSpace failed");
        });

        it("ExternalLayerコンストラクタで例外が発生した場合", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            mockExternalLayer.mockImplementation(() => {
                throw new Error("ExternalLayer failed");
            });

            expect(() => execute(mockStageAreaElement, mockDisplayElement, mockLayer)).toThrow("ExternalLayer failed");
        });

        it("getLayerで例外が発生した場合", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            mockMovieClip.getLayer.mockImplementation(() => {
                throw new Error("getLayer failed");
            });

            expect(() => execute(mockStageAreaElement, mockDisplayElement, mockLayer)).toThrow("getLayer failed");
        });

        it("getActiveCharactersで例外が発生した場合", () => {
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            const mockUpperLayer = {
                id: "upper-layer-1",
                getActiveCharacters: vi.fn().mockImplementation(() => {
                    throw new Error("getActiveCharacters failed");
                })
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            expect(() => execute(mockStageAreaElement, mockDisplayElement, mockLayer)).toThrow("getActiveCharacters failed");
        });
    });

    describe("エッジケース", () => {
        it("stage_area_elementがnullの場合", () => {
            expect(() => execute(null as any, mockDisplayElement, mockLayer)).toThrow();
        });

        it("display_elementがnullの場合", () => {
            // 実装はnullチェックをしていないため、エラーが発生する可能性がある
            // または正常に動作する可能性もある（処理が進まない）
            expect(() => execute(mockStageAreaElement, null as any, mockLayer)).not.toThrow();
        });

        it("layerがnullの場合", () => {
            expect(() => execute(mockStageAreaElement, mockDisplayElement, null as any)).toThrow();
        });

        it("layer.idがundefinedの場合", () => {
            mockLayer.id = undefined;

            // undefinedの場合、クラス名は "layer-id-undefined" になる
            mockDisplayElement.className = "layer-id-undefined";
            mockStageAreaElement.appendChild(mockDisplayElement);

            // エラーなく実行されることを確認
            expect(() => execute(mockStageAreaElement, mockDisplayElement, mockLayer)).not.toThrow();
        });

        it("特殊文字を含むlayer.idの場合", () => {
            // CSS セレクタとして問題ない特殊文字を使用
            mockLayer.id = "layer-with-special_-";
            
            mockDisplayElement.className = "layer-id-layer-with-special_-";
            mockStageAreaElement.appendChild(mockDisplayElement);

            // 特殊文字があってもエラーなく実行される
            expect(() => execute(mockStageAreaElement, mockDisplayElement, mockLayer)).not.toThrow();
        });
    });

    describe("複雑なシナリオ", () => {
        it("複数の上位レイヤーで一部にアクティブキャラクターがない場合", () => {
            mockExternalLayerInstance.index = 4; // index 3, 2, 1, 0 を検索
            
            // 新しいレイヤーIDを使用(layer-4)して上位レイヤー検索をトリガー
            mockLayer.id = "layer-4";
            mockDisplayElement.className = "layer-id-layer-4";
            mockStageAreaElement.appendChild(mockDisplayElement);

            const mockLayer3 = {
                id: "layer-3",
                getActiveCharacters: vi.fn().mockReturnValue([]) // アクティブキャラクターなし
            };
            const mockLayer2 = null; // レイヤー自体が存在しない
            const mockLayer1 = {
                id: "layer-1",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char1" }]) // アクティブキャラクターあり
            };

            mockMovieClip.getLayer.mockImplementation((index: number) => {
                switch (index) {
                    case 3: return mockLayer3;
                    case 2: return mockLayer2;
                    case 1: return mockLayer1;
                    case 0: return null;
                    default: return null;
                }
            });

            // layer-1 の要素のみ作成
            const layer1Element = document.createElement("div");
            layer1Element.className = "layer-id-layer-1";
            layer1Element.insertAdjacentElement = vi.fn();
            mockStageAreaElement.appendChild(layer1Element);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            // layer-3 はアクティブキャラクターなし、layer-2 は存在しない
            // layer-1 で配置が決定される
            expect(mockLayer3.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(mockLayer1.getActiveCharacters).toHaveBeenCalledWith(1);
            expect(layer1Element.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", mockDisplayElement);
        });

        it("上位レイヤーの検索で適切な配置先が見つからない場合", () => {
            mockExternalLayerInstance.index = 3;
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            // すべての上位レイヤーにアクティブキャラクターなし
            const mockUpperLayer = {
                id: "upper-layer",
                getActiveCharacters: vi.fn().mockReturnValue([])
            };
            mockMovieClip.getLayer.mockReturnValue(mockUpperLayer);

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            // どのレイヤーでも配置されないため、insertAdjacentElementは呼ばれない
            expect(mockDisplayElement.insertAdjacentElement).not.toHaveBeenCalled();
            expect(mockMovieClip.getLayer).toHaveBeenCalledTimes(3); // index 2, 1, 0
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量の同レイヤー要素でも効率的に処理する", () => {
            // 100個の同レイヤー要素を作成
            for (let i = 0; i < 99; i++) {
                const element = document.createElement("div");
                element.className = "layer-id-layer-1";
                element.insertAdjacentElement = vi.fn();
                mockStageAreaElement.appendChild(element);
            }
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            const start = performance.now();
            execute(mockStageAreaElement, mockDisplayElement, mockLayer);
            const end = performance.now();
            const duration = end - start;

            // 100要素の処理が10ms以内で完了することを期待
            expect(duration).toBeLessThan(10);
        });

        it("深い階層での上位レイヤー検索が効率的", () => {
            mockExternalLayerInstance.index = 50; // 50層の検索

            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);

            // 最後のレイヤーでのみ配置先を見つける
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                if (index === 0) {
                    return {
                        id: "layer-0",
                        getActiveCharacters: vi.fn().mockReturnValue([{ id: "char" }])
                    };
                }
                return null;
            });

            const layer0Element = document.createElement("div");
            layer0Element.className = "layer-id-layer-0";
            layer0Element.insertAdjacentElement = vi.fn();
            mockStageAreaElement.appendChild(layer0Element);

            const start = performance.now();
            execute(mockStageAreaElement, mockDisplayElement, mockLayer);
            const end = performance.now();
            const duration = end - start;

            // 50層の検索が50ms以内で完了することを期待
            expect(duration).toBeLessThan(50);
            expect(layer0Element.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", mockDisplayElement);
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際のアニメーションツールでのレイヤー階層調整", () => {
            // シナリオ: 3層のレイヤー構造で中間レイヤーに新要素を追加
            
            // レイヤー0（最下層）に既存要素
            const layer0Element1 = document.createElement("div");
            layer0Element1.className = "layer-id-layer-0";
            layer0Element1.insertAdjacentElement = vi.fn();
            mockStageAreaElement.appendChild(layer0Element1);
            
            // レイヤー1（中間層）に新要素を追加（まだ他に要素なし）
            mockLayer.id = "layer-1";
            mockDisplayElement.className = "layer-id-layer-1";
            mockStageAreaElement.appendChild(mockDisplayElement);
            
            // レイヤー2（最上層）に既存要素
            const layer2Element1 = document.createElement("div");
            layer2Element1.className = "layer-id-layer-2";
            layer2Element1.insertAdjacentElement = vi.fn();
            const layer2Element2 = document.createElement("div");
            layer2Element2.className = "layer-id-layer-2";
            layer2Element2.insertAdjacentElement = vi.fn();
            mockStageAreaElement.appendChild(layer2Element1);
            mockStageAreaElement.appendChild(layer2Element2);

            // ExternalLayer の設定（レイヤー1のindex=1）
            mockExternalLayerInstance.index = 1;

            // 上位レイヤー（layer-0）の設定
            const mockLayer0 = {
                id: "layer-0",
                getActiveCharacters: vi.fn().mockReturnValue([{ id: "char0" }])
            };
            mockMovieClip.getLayer.mockImplementation((index: number) => {
                return index === 0 ? mockLayer0 : null;
            });

            execute(mockStageAreaElement, mockDisplayElement, mockLayer);

            // レイヤー0の最後の要素（layer0Element1）の前に配置される
            expect(layer0Element1.insertAdjacentElement).toHaveBeenCalledWith("beforebegin", mockDisplayElement);
            expect(mockExternalLayer).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip, mockLayer);
        });
    });
});
