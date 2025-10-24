import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// モック設定（vi.hoistedを使用）
const {
    mockGetCurrentWorkSpace,
    mockSetAllLockMode,
    mockTimelineToolLockAllGetCurrentModeService,
    mockExternalLayer,
    mockActiveTouchPointers
} = vi.hoisted(() => {
    return {
        mockGetCurrentWorkSpace: vi.fn(),
        mockSetAllLockMode: vi.fn(),
        mockTimelineToolLockAllGetCurrentModeService: vi.fn(),
        mockExternalLayer: vi.fn(function() { return {}; }),
        mockActiveTouchPointers: new Map()
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/timeline/application/TimelineUtil", () => ({
    $setAllLockMode: mockSetAllLockMode
}));

vi.mock("../service/TimelineToolLockAllGetCurrentModeService", () => ({
    execute: mockTimelineToolLockAllGetCurrentModeService
}));

vi.mock("@/external/core/domain/model/ExternalLayer", () => ({
    ExternalLayer: mockExternalLayer
}));

vi.mock("@/global/GlobalUtil", () => ({
    $activeTouchPointers: mockActiveTouchPointers
}));

import { execute } from "./TimelineToolLockAllUseCase";

describe("TimelineToolLockAllUseCase", () => {
    let mockWorkSpace: any;
    let mockScene: any;
    let mockLayers: any[];
    let mockExternalLayerInstance: any;
    let mockEvent: PointerEvent;

    beforeEach(() => {
        vi.clearAllMocks();
        mockActiveTouchPointers.clear();

        // Layer モック
        mockLayers = [
            { id: "layer1", lock: false, name: "Layer 1" },
            { id: "layer2", lock: true, name: "Layer 2" },
            { id: "layer3", lock: false, name: "Layer 3" }
        ];

        // Scene モック
        mockScene = {
            id: "test-scene",
            layers: mockLayers
        };

        // WorkSpace モック
        mockWorkSpace = {
            id: "test-workspace",
            scene: mockScene
        };

        // ExternalLayer インスタンスモック
        mockExternalLayerInstance = {
            setLock: vi.fn().mockResolvedValue(undefined)
        };

        // PointerEvent モック
        mockEvent = {
            button: 0,
            stopPropagation: vi.fn()
        } as any;

        // 関数モック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockTimelineToolLockAllGetCurrentModeService.mockReturnValue(true);
        mockExternalLayer.mockImplementation(function() { return mockExternalLayerInstance; });
    });

    afterEach(() => {
        vi.clearAllMocks();
        mockActiveTouchPointers.clear();
    });

    describe("正常系", () => {
        it("左クリック（button=0）で全レイヤーのロック状態を変更する", async () => {
            await execute(mockEvent);

            // イベント伝播の停止確認
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();

            // モード取得サービスの呼び出し確認
            expect(mockTimelineToolLockAllGetCurrentModeService).toHaveBeenCalledOnce();

            // ワークスペース取得の確認
            expect(mockGetCurrentWorkSpace).toHaveBeenCalledOnce();

            // 各レイヤーに対するExternalLayer作成確認
            expect(mockExternalLayer).toHaveBeenCalledTimes(3);
            expect(mockExternalLayer).toHaveBeenNthCalledWith(1, mockWorkSpace, mockScene, mockLayers[0]);
            expect(mockExternalLayer).toHaveBeenNthCalledWith(2, mockWorkSpace, mockScene, mockLayers[1]);
            expect(mockExternalLayer).toHaveBeenNthCalledWith(3, mockWorkSpace, mockScene, mockLayers[2]);

            // 各レイヤーのロック状態変更確認
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledTimes(3);
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(true);

            // モード更新の確認
            expect(mockSetAllLockMode).toHaveBeenCalledWith(true);
        });

        it("モードがfalseの場合、全レイヤーのロックを解除する", async () => {
            mockTimelineToolLockAllGetCurrentModeService.mockReturnValue(false);

            await execute(mockEvent);

            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(false);
            expect(mockSetAllLockMode).toHaveBeenCalledWith(false);
        });

        it("レイヤーが空の場合でも正常に処理される", async () => {
            mockScene.layers = [];

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockTimelineToolLockAllGetCurrentModeService).toHaveBeenCalledOnce();
            expect(mockExternalLayer).not.toHaveBeenCalled();
            expect(mockExternalLayerInstance.setLock).not.toHaveBeenCalled();
            expect(mockSetAllLockMode).toHaveBeenCalledWith(true);
        });

        it("レイヤーが1つだけの場合も正常に処理される", async () => {
            const singleLayer = { id: "single", lock: false, name: "Single Layer" };
            mockScene.layers = [singleLayer];

            await execute(mockEvent);

            expect(mockExternalLayer).toHaveBeenCalledTimes(1);
            expect(mockExternalLayer).toHaveBeenCalledWith(mockWorkSpace, mockScene, singleLayer);
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledTimes(1);
        });
    });

    describe("早期リターン条件", () => {
        it("右クリック（button=2）の場合は処理を実行しない", async () => {
            const rightClickEvent = {
                button: 2,
                stopPropagation: vi.fn()
            } as any;

            await execute(rightClickEvent);

            // 何も実行されていないことを確認
            expect(rightClickEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockTimelineToolLockAllGetCurrentModeService).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
            expect(mockSetAllLockMode).not.toHaveBeenCalled();
        });

        it("中クリック（button=1）の場合は処理を実行しない", async () => {
            const middleClickEvent = {
                button: 1,
                stopPropagation: vi.fn()
            } as any;

            await execute(middleClickEvent);

            expect(middleClickEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockTimelineToolLockAllGetCurrentModeService).not.toHaveBeenCalled();
        });

        it("アクティブタッチポインターが2つ以上の場合は処理を実行しない", async () => {
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockTimelineToolLockAllGetCurrentModeService).not.toHaveBeenCalled();
        });

        it("buttonが0でないかつタッチポインターが複数の場合", async () => {
            const invalidEvent = {
                button: 2,
                stopPropagation: vi.fn()
            } as any;
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});

            await execute(invalidEvent);

            expect(invalidEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("レイヤー処理の詳細確認", () => {
        it("undefinedレイヤーは無視される", async () => {
            mockScene.layers = [
                mockLayers[0],
                undefined,
                mockLayers[1],
                null,
                mockLayers[2]
            ];

            await execute(mockEvent);

            // undefined/null以外の3つのレイヤーのみ処理される
            expect(mockExternalLayer).toHaveBeenCalledTimes(3);
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledTimes(3);
        });

        it("レイヤーのインデックス順で処理される", async () => {
            const orderedLayers = [
                { id: "first", name: "First" },
                { id: "second", name: "Second" },
                { id: "third", name: "Third" }
            ];
            mockScene.layers = orderedLayers;

            await execute(mockEvent);

            // 順序通りに呼び出されることを確認
            expect(mockExternalLayer).toHaveBeenNthCalledWith(1, mockWorkSpace, mockScene, orderedLayers[0]);
            expect(mockExternalLayer).toHaveBeenNthCalledWith(2, mockWorkSpace, mockScene, orderedLayers[1]);
            expect(mockExternalLayer).toHaveBeenNthCalledWith(3, mockWorkSpace, mockScene, orderedLayers[2]);
        });

        it("大量のレイヤーでも正常に処理される", async () => {
            const manyLayers = Array.from({ length: 100 }, (_, i) => ({
                id: `layer${i}`,
                name: `Layer ${i}`,
                lock: i % 2 === 0
            }));
            mockScene.layers = manyLayers;

            await execute(mockEvent);

            expect(mockExternalLayer).toHaveBeenCalledTimes(100);
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledTimes(100);
        });
    });

    describe("非同期処理の確認", () => {
        it("setLockが非同期で実行され、全て完了するまで待機する", async () => {
            let resolveCount = 0;
            mockExternalLayerInstance.setLock.mockImplementation(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolveCount++;
                        resolve(undefined);
                    }, 10);
                });
            });

            await execute(mockEvent);

            expect(resolveCount).toBe(3);
            expect(mockSetAllLockMode).toHaveBeenCalledWith(true);
        });

        it("setLockでエラーが発生した場合は例外が伝播する", async () => {
            const error = new Error("setLock failed");
            mockExternalLayerInstance.setLock.mockRejectedValueOnce(error);

            await expect(execute(mockEvent)).rejects.toThrow("setLock failed");

            // エラー後はmockSetAllLockModeが呼ばれない
            expect(mockSetAllLockMode).not.toHaveBeenCalled();
        });

        it("複数のレイヤーで順次処理されエラーは最初の失敗で停止する", async () => {
            mockExternalLayerInstance.setLock
                .mockResolvedValueOnce(undefined) // 1回目成功
                .mockRejectedValueOnce(new Error("Second layer failed")) // 2回目失敗
                .mockResolvedValueOnce(undefined); // 3回目（実行されない）

            await expect(execute(mockEvent)).rejects.toThrow("Second layer failed");

            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledTimes(2);
            expect(mockSetAllLockMode).not.toHaveBeenCalled();
        });
    });

    describe("ExternalLayerインスタンス作成の確認", () => {
        it("各レイヤーに対して正しいパラメータでExternalLayerが作成される", async () => {
            await execute(mockEvent);

            mockLayers.forEach((layer, index) => {
                expect(mockExternalLayer).toHaveBeenNthCalledWith(
                    index + 1,
                    mockWorkSpace,
                    mockScene,
                    layer
                );
            });
        });

        it("ExternalLayerコンストラクタでエラーが発生した場合", async () => {
            mockExternalLayer.mockImplementationOnce(() => {
                throw new Error("ExternalLayer creation failed");
            });

            await expect(execute(mockEvent)).rejects.toThrow("ExternalLayer creation failed");
            expect(mockSetAllLockMode).not.toHaveBeenCalled();
        });
    });

    describe("モード管理の確認", () => {
        it("取得したモードが正しくsetLockとsetAllLockModeに渡される", async () => {
            const testMode = false;
            mockTimelineToolLockAllGetCurrentModeService.mockReturnValue(testMode);

            await execute(mockEvent);

            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(testMode);
            expect(mockSetAllLockMode).toHaveBeenCalledWith(testMode);
        });

        it("モード取得サービスでエラーが発生した場合", async () => {
            mockTimelineToolLockAllGetCurrentModeService.mockImplementation(() => {
                throw new Error("Mode service failed");
            });

            await expect(execute(mockEvent)).rejects.toThrow("Mode service failed");
            expect(mockExternalLayer).not.toHaveBeenCalled();
            expect(mockSetAllLockMode).not.toHaveBeenCalled();
        });
    });

    describe("タッチポインター管理の詳細確認", () => {
        it("タッチポインターが1つの場合は正常に処理される", async () => {
            mockActiveTouchPointers.set("pointer1", {});

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockTimelineToolLockAllGetCurrentModeService).toHaveBeenCalledOnce();
        });

        it("タッチポインターが0個の場合は正常に処理される", async () => {
            // mockActiveTouchPointers は空のまま

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockTimelineToolLockAllGetCurrentModeService).toHaveBeenCalledOnce();
        });

        it("タッチポインターがちょうど2個の場合は処理されない", async () => {
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("タッチポインターが3個以上の場合は処理されない", async () => {
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});
            mockActiveTouchPointers.set("pointer3", {});

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("処理順序の確認", () => {
        it("処理が正しい順序で実行される", async () => {
            const executionOrder: string[] = [];

            mockEvent.stopPropagation = vi.fn().mockImplementation(() => {
                executionOrder.push("stopPropagation");
            });

            mockTimelineToolLockAllGetCurrentModeService.mockImplementation(() => {
                executionOrder.push("getCurrentMode");
                return true;
            });

            mockGetCurrentWorkSpace.mockImplementation(() => {
                executionOrder.push("getCurrentWorkSpace");
                return mockWorkSpace;
            });

            mockExternalLayer.mockImplementation(function() {
                executionOrder.push("ExternalLayer");
                return mockExternalLayerInstance;
            });

            mockExternalLayerInstance.setLock.mockImplementation(async () => {
                executionOrder.push("setLock");
            });

            mockSetAllLockMode.mockImplementation(() => {
                executionOrder.push("setAllLockMode");
            });

            await execute(mockEvent);

            expect(executionOrder).toEqual([
                "stopPropagation",
                "getCurrentMode",
                "getCurrentWorkSpace",
                "ExternalLayer",
                "setLock",
                "ExternalLayer",
                "setLock",
                "ExternalLayer",
                "setLock",
                "setAllLockMode"
            ]);
        });
    });

    describe("エッジケース", () => {
        it("レイヤー配列がnullの場合", async () => {
            mockScene.layers = null;

            await expect(execute(mockEvent)).rejects.toThrow();
        });

        it("レイヤー配列がundefinedの場合", async () => {
            mockScene.layers = undefined;

            await expect(execute(mockEvent)).rejects.toThrow();
        });

        it("sceneがnullの場合", async () => {
            mockWorkSpace.scene = null;

            await expect(execute(mockEvent)).rejects.toThrow();
        });

        it("workSpaceがnullの場合", async () => {
            mockGetCurrentWorkSpace.mockReturnValue(null);

            await expect(execute(mockEvent)).rejects.toThrow();
        });

        it("buttonが負の値の場合", async () => {
            const negativeButtonEvent = {
                button: -1,
                stopPropagation: vi.fn()
            } as any;

            await execute(negativeButtonEvent);

            expect(negativeButtonEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("buttonが非常に大きな値の場合", async () => {
            const largeButtonEvent = {
                button: 999,
                stopPropagation: vi.fn()
            } as any;

            await execute(largeButtonEvent);

            expect(largeButtonEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量レイヤーでの処理時間が許容範囲内", async () => {
            const largeLayerCount = 1000;
            const largeLayers = Array.from({ length: largeLayerCount }, (_, i) => ({
                id: `layer${i}`,
                name: `Layer ${i}`,
                lock: false
            }));
            mockScene.layers = largeLayers;

            const start = performance.now();
            await execute(mockEvent);
            const end = performance.now();
            const duration = end - start;

            // 1000レイヤーの処理が1秒以内で完了することを期待
            expect(duration).toBeLessThan(1000);
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledTimes(largeLayerCount);
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際の使用シナリオ：全レイヤーロック→解除の流れ", async () => {
            // 1回目：全レイヤーをロック
            mockTimelineToolLockAllGetCurrentModeService.mockReturnValueOnce(true);
            await execute(mockEvent);

            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(true);
            expect(mockSetAllLockMode).toHaveBeenCalledWith(true);

            // モックをリセット
            vi.clearAllMocks();
            mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
            mockExternalLayer.mockImplementation(function() { return mockExternalLayerInstance; });

            // 2回目：全レイヤーをロック解除
            mockTimelineToolLockAllGetCurrentModeService.mockReturnValueOnce(false);
            await execute(mockEvent);

            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(false);
            expect(mockSetAllLockMode).toHaveBeenCalledWith(false);
        });
    });
});
