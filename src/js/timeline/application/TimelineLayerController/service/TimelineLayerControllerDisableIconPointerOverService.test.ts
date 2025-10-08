import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// モック設定（vi.hoistedを使用）
const {
    mockGetCurrentWorkSpace,
    mockGetDisableState,
    mockGetLayerFromElement,
    mockExternalLayer
} = vi.hoisted(() => {
    return {
        mockGetCurrentWorkSpace: vi.fn(),
        mockGetDisableState: vi.fn(),
        mockGetLayerFromElement: vi.fn(),
        mockExternalLayer: vi.fn()
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("../../TimelineUtil", () => ({
    $getDisableState: mockGetDisableState,
    $getLayerFromElement: mockGetLayerFromElement
}));

vi.mock("@/external/core/domain/model/ExternalLayer", () => ({
    ExternalLayer: mockExternalLayer
}));

import { execute } from "./TimelineLayerControllerDisableIconPointerOverService";

describe("TimelineLayerControllerDisableIconPointerOverService", () => {
    let mockWorkSpace: any;
    let mockScene: any;
    let mockLayer: any;
    let mockElement: HTMLElement;
    let mockExternalLayerInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // HTML要素のモック
        mockElement = {
            id: "disable-icon-1",
            dataset: { layerIndex: "0" }
        } as any;

        // Layer モック
        mockLayer = {
            disable: false,
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
            setDisable: vi.fn().mockResolvedValue(undefined)
        };

        // 関数モック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockGetLayerFromElement.mockReturnValue(mockLayer);
        mockGetDisableState.mockReturnValue(true);
        mockExternalLayer.mockReturnValue(mockExternalLayerInstance);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const createMockEvent = (overrides: Partial<PointerEvent> = {}): PointerEvent => ({
        currentTarget: mockElement,
        ...overrides
    } as any);

    describe("正常系", () => {
        it("無効化状態がtrueでレイヤーが存在する場合、無効化状態をトグルする", async () => {
            mockLayer.disable = false; // 現在は有効状態
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // 無効化状態の確認
            expect(mockGetDisableState).toHaveBeenCalledOnce();

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

            // 無効化状態のトグル確認（false → true）
            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledWith(true);
        });

        it("レイヤーが無効状態の場合、有効に変更する", async () => {
            mockLayer.disable = true; // 現在は無効状態
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // 無効化状態のトグル確認（true → false）
            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledWith(false);
        });

        it("異なるレイヤーでも正常に動作する", async () => {
            const differentLayer = {
                disable: true,
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
            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledWith(false);
        });
    });

    describe("早期リターン条件", () => {
        it("無効化状態がfalseの場合は処理を実行しない", async () => {
            mockGetDisableState.mockReturnValue(false);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockGetDisableState).toHaveBeenCalledOnce();

            // 後続処理が実行されていないことを確認
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
            expect(mockExternalLayerInstance.setDisable).not.toHaveBeenCalled();
        });

        it("event.currentTargetがnullの場合は処理を実行しない", async () => {
            const mockEvent = createMockEvent({ currentTarget: null });

            await execute(mockEvent);

            expect(mockGetDisableState).toHaveBeenCalledOnce();

            // element取得後の処理が実行されていないことを確認
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
            expect(mockExternalLayerInstance.setDisable).not.toHaveBeenCalled();
        });

        it("event.currentTargetがundefinedの場合は処理を実行しない", async () => {
            const mockEvent = createMockEvent({ currentTarget: undefined });

            await execute(mockEvent);

            expect(mockGetDisableState).toHaveBeenCalledOnce();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
        });

        it("layerが存在しない場合は処理を実行しない", async () => {
            mockGetLayerFromElement.mockReturnValue(null);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockGetDisableState).toHaveBeenCalledOnce();
            expect(mockGetLayerFromElement).toHaveBeenCalledWith(mockElement);

            // layer取得後の処理が実行されていないことを確認
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
            expect(mockExternalLayerInstance.setDisable).not.toHaveBeenCalled();
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
        it("無効化状態false かつ currentTargetがnullの場合", async () => {
            mockGetDisableState.mockReturnValue(false);
            const mockEvent = createMockEvent({ currentTarget: null });

            await execute(mockEvent);

            // 最初の無効化状態チェックで早期リターン
            expect(mockGetDisableState).toHaveBeenCalledOnce();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
        });

        it("無効化状態true かつ layerがnullの場合", async () => {
            mockGetLayerFromElement.mockReturnValue(null);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockGetDisableState).toHaveBeenCalledOnce();
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
                disable: false,
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

        it("setDisableメソッドが非同期で実行される", async () => {
            let setDisableResolved = false;

            mockExternalLayerInstance.setDisable.mockImplementation(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        setDisableResolved = true;
                        resolve(undefined);
                    }, 10);
                });
            });

            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(setDisableResolved).toBe(true);
        });

        it("setDisableでエラーが発生した場合は例外が伝播する", async () => {
            const error = new Error("setDisable failed");
            mockExternalLayerInstance.setDisable.mockRejectedValue(error);
            const mockEvent = createMockEvent();

            await expect(execute(mockEvent)).rejects.toThrow("setDisable failed");
        });
    });

    describe("無効化状態のトグル動作確認", () => {
        const disableStates = [
            { current: false, expected: true, description: "有効状態から無効状態へ" },
            { current: true, expected: false, description: "無効状態から有効状態へ" }
        ];

        disableStates.forEach(({ current, expected, description }) => {
            it(`${description}`, async () => {
                mockLayer.disable = current;
                const mockEvent = createMockEvent();

                await execute(mockEvent);

                expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledWith(expected);
            });
        });
    });

    describe("処理順序の確認", () => {
        it("処理が正しい順序で実行される", async () => {
            const executionOrder: string[] = [];

            mockGetDisableState.mockImplementation(() => {
                executionOrder.push("getDisableState");
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

            mockExternalLayer.mockImplementation(() => {
                executionOrder.push("ExternalLayer");
                return mockExternalLayerInstance;
            });

            mockExternalLayerInstance.setDisable.mockImplementation(async () => {
                executionOrder.push("setDisable");
            });

            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(executionOrder).toEqual([
                "getDisableState",
                "getLayerFromElement",
                "getCurrentWorkSpace",
                "ExternalLayer",
                "setDisable"
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
        it("レイヤーのdisable値がundefinedの場合", async () => {
            mockLayer.disable = undefined;
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // !layer.disable は true になるため、setDisable(true) が呼ばれる
            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledWith(true);
        });

        it("レイヤーのdisable値がnullの場合", async () => {
            mockLayer.disable = null;
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // !layer.disable は true になるため、setDisable(true) が呼ばれる
            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledWith(true);
        });

        it("レイヤーのdisable値が数値の場合", async () => {
            mockLayer.disable = 1; // truthy値
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // !layer.disable は false になるため、setDisable(false) が呼ばれる
            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledWith(false);
        });

        it("レイヤーのdisable値が空文字の場合", async () => {
            mockLayer.disable = ""; // falsy値
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // !layer.disable は true になるため、setDisable(true) が呼ばれる
            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledWith(true);
        });
    });

    describe("非同期処理の一貫性確認", () => {
        it("Promiseチェーンが正しく処理される", async () => {
            const promise1 = execute(createMockEvent());
            const promise2 = execute(createMockEvent());

            // 並行実行されても問題ないことを確認
            await Promise.all([promise1, promise2]);

            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledTimes(2);
        });

        it("エラー後でも次の呼び出しは正常に処理される", async () => {
            // 最初の呼び出しでエラー
            mockExternalLayerInstance.setDisable.mockRejectedValueOnce(new Error("First call failed"));
            
            try {
                await execute(createMockEvent());
            } catch (error) {
                // エラーを無視
            }

            // 2回目の呼び出しは正常
            mockExternalLayerInstance.setDisable.mockResolvedValueOnce(undefined);
            
            await expect(execute(createMockEvent())).resolves.not.toThrow();
            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledTimes(2);
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
            expect(mockGetDisableState).toHaveBeenCalledTimes(iterations);
            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledTimes(iterations);
        });
    });

    describe("連続表示機能の特性確認", () => {
        it("複数回の連続実行で状態が適切にトグルされる", async () => {
            // 初期状態：false（有効）
            mockLayer.disable = false;

            // 1回目：false → true
            await execute(createMockEvent());
            expect(mockExternalLayerInstance.setDisable).toHaveBeenLastCalledWith(true);

            // 状態を更新
            mockLayer.disable = true;

            // 2回目：true → false
            await execute(createMockEvent());
            expect(mockExternalLayerInstance.setDisable).toHaveBeenLastCalledWith(false);

            expect(mockExternalLayerInstance.setDisable).toHaveBeenCalledTimes(2);
        });
    });
});
