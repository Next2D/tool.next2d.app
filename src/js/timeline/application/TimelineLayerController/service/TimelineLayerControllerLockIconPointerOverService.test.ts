import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// モック設定（vi.hoistedを使用）
const {
    mockGetCurrentWorkSpace,
    mockGetLayerFromElement,
    mockGetLockState,
    mockExternalLayer
} = vi.hoisted(() => {
    return {
        mockGetCurrentWorkSpace: vi.fn(),
        mockGetLayerFromElement: vi.fn(),
        mockGetLockState: vi.fn(),
        mockExternalLayer: vi.fn(function() { return {}; })
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("../../TimelineUtil", () => ({
    $getLayerFromElement: mockGetLayerFromElement,
    $getLockState: mockGetLockState
}));

vi.mock("@/external/core/domain/model/ExternalLayer", () => ({
    ExternalLayer: mockExternalLayer
}));

import { execute } from "./TimelineLayerControllerLockIconPointerOverService";

describe("TimelineLayerControllerLockIconPointerOverService", () => {
    let mockWorkSpace: any;
    let mockScene: any;
    let mockLayer: any;
    let mockElement: HTMLElement;
    let mockExternalLayerInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // HTML要素のモック
        mockElement = {
            id: "layer-1",
            dataset: { layerIndex: "0" }
        } as any;

        // Layer モック
        mockLayer = {
            lock: false,
            name: "test-layer",
            index: 0
        };

        // Scene モック
        mockScene = {
            id: "test-scene"
        };

        // WorkSpace モック
        mockWorkSpace = {
            scene: mockScene
        };

        // ExternalLayer インスタンスモック
        mockExternalLayerInstance = {
            setLock: vi.fn().mockResolvedValue(undefined)
        };

        // 関数モック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockGetLayerFromElement.mockReturnValue(mockLayer);
        mockGetLockState.mockReturnValue(true);
        mockExternalLayer.mockImplementation(function() { return mockExternalLayerInstance; });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const createMockEvent = (overrides: Partial<PointerEvent> = {}): PointerEvent => ({
        currentTarget: mockElement,
        ...overrides
    } as any);

    describe("正常系", () => {
        it("ロック状態がtrueでレイヤーが存在する場合、ロック状態をトグルする", async () => {
            mockLayer.lock = false; // 現在はアンロック状態
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // ロック状態の確認
            expect(mockGetLockState).toHaveBeenCalledOnce();

            // 要素からレイヤー取得の確認
            expect(mockGetLayerFromElement).toHaveBeenCalledWith(mockElement);

            // ワークスペース取得の確認
            expect(mockGetCurrentWorkSpace).toHaveBeenCalledOnce();

            // ExternalLayer インスタンス作成の確認
            expect(mockExternalLayer).toHaveBeenCalledWith(
                mockWorkSpace,
                mockWorkSpace.scene,
                mockLayer
            );

            // ロック状態のトグル確認（false → true）
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(true);
        });

        it("レイヤーがロック状態の場合、アンロックに変更する", async () => {
            mockLayer.lock = true; // 現在はロック状態
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // ロック状態のトグル確認（true → false）
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(false);
        });

        it("異なるレイヤーでも正常に動作する", async () => {
            const differentLayer = {
                lock: true,
                name: "different-layer",
                index: 1
            };
            mockGetLayerFromElement.mockReturnValue(differentLayer);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockExternalLayer).toHaveBeenCalledWith(
                mockWorkSpace,
                mockWorkSpace.scene,
                differentLayer
            );
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(false);
        });
    });

    describe("早期リターン条件", () => {
        it("ロック状態がfalseの場合は処理を実行しない", async () => {
            mockGetLockState.mockReturnValue(false);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockGetLockState).toHaveBeenCalledOnce();

            // 後続処理が実行されていないことを確認
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
            expect(mockExternalLayerInstance.setLock).not.toHaveBeenCalled();
        });

        it("event.currentTargetがnullの場合は処理を実行しない", async () => {
            const mockEvent = createMockEvent({ currentTarget: null });

            await execute(mockEvent);

            expect(mockGetLockState).toHaveBeenCalledOnce();

            // element取得後の処理が実行されていないことを確認
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
            expect(mockExternalLayerInstance.setLock).not.toHaveBeenCalled();
        });

        it("event.currentTargetがundefinedの場合は処理を実行しない", async () => {
            const mockEvent = createMockEvent({ currentTarget: undefined });

            await execute(mockEvent);

            expect(mockGetLockState).toHaveBeenCalledOnce();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
        });

        it("layerが存在しない場合は処理を実行しない", async () => {
            mockGetLayerFromElement.mockReturnValue(null);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockGetLockState).toHaveBeenCalledOnce();
            expect(mockGetLayerFromElement).toHaveBeenCalledWith(mockElement);

            // layer取得後の処理が実行されていないことを確認
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
            expect(mockExternalLayerInstance.setLock).not.toHaveBeenCalled();
        });

        it("layerがundefinedの場合は処理を実行しない", async () => {
            mockGetLayerFromElement.mockReturnValue(undefined);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockGetLayerFromElement).toHaveBeenCalledWith(mockElement);
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
        });
    });

    describe("複合条件のテスト", () => {
        it("ロック状態false かつ currentTargetがnullの場合", async () => {
            mockGetLockState.mockReturnValue(false);
            const mockEvent = createMockEvent({ currentTarget: null });

            await execute(mockEvent);

            // 最初のロック状態チェックで早期リターン
            expect(mockGetLockState).toHaveBeenCalledOnce();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
        });

        it("ロック状態true かつ layerがnullの場合", async () => {
            mockGetLayerFromElement.mockReturnValue(null);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockGetLockState).toHaveBeenCalledOnce();
            expect(mockGetLayerFromElement).toHaveBeenCalledWith(mockElement);
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
        });
    });

    describe("ExternalLayer処理の詳細確認", () => {
        it("ExternalLayerコンストラクタが正しい引数で呼ばれる", async () => {
            const customWorkSpace = {
                scene: { id: "custom-scene" }
            };
            const customLayer = {
                lock: false,
                name: "custom-layer",
                index: 2
            };

            mockGetCurrentWorkSpace.mockReturnValue(customWorkSpace);
            mockGetLayerFromElement.mockReturnValue(customLayer);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockExternalLayer).toHaveBeenCalledWith(
                customWorkSpace,
                customWorkSpace.scene,
                customLayer
            );
        });

        it("setLockメソッドが非同期で実行される", async () => {
            let setLockResolved = false;

            mockExternalLayerInstance.setLock.mockImplementation(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        setLockResolved = true;
                        resolve(undefined);
                    }, 10);
                });
            });

            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(setLockResolved).toBe(true);
        });

        it("setLockでエラーが発生した場合は例外が伝播する", async () => {
            const error = new Error("setLock failed");
            mockExternalLayerInstance.setLock.mockRejectedValue(error);
            const mockEvent = createMockEvent();

            await expect(execute(mockEvent)).rejects.toThrow("setLock failed");
        });
    });

    describe("ロック状態のトグル動作確認", () => {
        const lockStates = [
            { current: false, expected: true, description: "アンロック状態からロック状態へ" },
            { current: true, expected: false, description: "ロック状態からアンロック状態へ" }
        ];

        lockStates.forEach(({ current, expected, description }) => {
            it(`${description}`, async () => {
                mockLayer.lock = current;
                const mockEvent = createMockEvent();

                await execute(mockEvent);

                expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(expected);
            });
        });
    });

    describe("処理順序の確認", () => {
        it("処理が正しい順序で実行される", async () => {
            const executionOrder: string[] = [];

            mockGetLockState.mockImplementation(() => {
                executionOrder.push("getLockState");
                return true;
            });

            mockGetLayerFromElement.mockImplementation(() => {
                executionOrder.push("getLayerFromElement");
                return mockLayer;
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

            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(executionOrder).toEqual([
                "getLockState",
                "getLayerFromElement",
                "getCurrentWorkSpace",
                "ExternalLayer",
                "setLock"
            ]);
        });
    });

    describe("currentTargetとtargetの違い確認", () => {
        it("currentTargetを使用してイベント処理を行う", async () => {
            const targetElement = { id: "target" } as HTMLElement;
            const currentTargetElement = { id: "currentTarget" } as HTMLElement;

            const mockEvent = {
                target: targetElement,
                currentTarget: currentTargetElement
            } as any;

            await execute(mockEvent);

            // currentTargetが使用されることを確認
            expect(mockGetLayerFromElement).toHaveBeenCalledWith(currentTargetElement);
            expect(mockGetLayerFromElement).not.toHaveBeenCalledWith(targetElement);
        });
    });

    describe("エッジケース", () => {
        it("レイヤーのlock値がundefinedの場合", async () => {
            mockLayer.lock = undefined;
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // !layer.lock は true になるため、setLock(true) が呼ばれる
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(true);
        });

        it("レイヤーのlock値がnullの場合", async () => {
            mockLayer.lock = null;
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // !layer.lock は true になるため、setLock(true) が呼ばれる
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledWith(true);
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量の呼び出しでもパフォーマンスが安定している", async () => {
            const iterations = 100;
            const start = performance.now();

            const promises = [];
            for (let i = 0; i < iterations; i++) {
                const mockEvent = createMockEvent();
                promises.push(execute(mockEvent));
            }

            await Promise.all(promises);

            const end = performance.now();
            const duration = end - start;

            // 100回の呼び出しが500ms以内で完了することを期待
            expect(duration).toBeLessThan(500);

            // すべての呼び出しが実行されたことを確認
            expect(mockGetLockState).toHaveBeenCalledTimes(iterations);
            expect(mockExternalLayerInstance.setLock).toHaveBeenCalledTimes(iterations);
        });
    });
});
