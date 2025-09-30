import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./TimelineLayerControllerLightIconPointerDownEventService";

// モック設定
const mockAllHideMenu = vi.fn();
const mockGetLayerFromElement = vi.fn();
const mockGetCurrentWorkSpace = vi.fn();
const mockActiveTouchPointers = { size: 1 };
const mockSetEditingElement = vi.fn();
const mockExternalLayer = vi.fn();

vi.mock("@/menu/application/MenuUtil", () => ({
    $allHideMenu: mockAllHideMenu
}));

vi.mock("../../TimelineUtil", () => ({
    $getLayerFromElement: mockGetLayerFromElement
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/global/GlobalUtil", () => ({
    $activeTouchPointers: mockActiveTouchPointers,
    $setEditingElement: mockSetEditingElement
}));

vi.mock("@/external/core/domain/model/ExternalLayer", () => ({
    ExternalLayer: mockExternalLayer
}));

describe("TimelineLayerControllerLightIconPointerDownEventService", () => {
    let mockWorkSpace: any;
    let mockScene: any;
    let mockLayer: any;
    let mockElement: HTMLElement;
    let mockExternalLayerInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // HTML要素のモック
        mockElement = {
            id: "light-icon-1",
            dataset: { layerIndex: "0" }
        } as any;

        // Layer モック
        mockLayer = {
            light: false,
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
            setLight: vi.fn()
        };

        // 関数モック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockGetLayerFromElement.mockReturnValue(mockLayer);
        mockExternalLayer.mockReturnValue(mockExternalLayerInstance);

        // activeTouchPointers のサイズをリセット
        Object.defineProperty(mockActiveTouchPointers, 'size', {
            value: 1,
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const createMockEvent = (overrides: Partial<PointerEvent> = {}): PointerEvent => ({
        button: 0,
        target: mockElement,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
        ...overrides
    } as any);

    describe("正常系", () => {
        it("有効なポインターダウンイベントで完全な処理フローが実行される", () => {
            mockLayer.light = false; // 現在はライトオフ状態
            const mockEvent = createMockEvent();

            execute(mockEvent);

            // レイヤー取得の確認
            expect(mockGetLayerFromElement).toHaveBeenCalledWith(mockElement);

            // イベント処理の確認
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockEvent.preventDefault).toHaveBeenCalledOnce();

            // メニュー非表示化の確認
            expect(mockAllHideMenu).toHaveBeenCalledOnce();

            // 編集中要素の初期化確認
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);

            // ワークスペース取得の確認
            expect(mockGetCurrentWorkSpace).toHaveBeenCalledOnce();

            // ExternalLayer インスタンス作成の確認
            expect(mockExternalLayer).toHaveBeenCalledWith(
                mockWorkSpace,
                mockWorkSpace.scene,
                mockLayer
            );

            // ライト状態のトグル確認（false → true）
            expect(mockExternalLayerInstance.setLight).toHaveBeenCalledWith(true);
        });

        it("レイヤーがライト状態の場合、オフに変更する", () => {
            mockLayer.light = true; // 現在はライト状態
            const mockEvent = createMockEvent();

            execute(mockEvent);

            // ライト状態のトグル確認（true → false）
            expect(mockExternalLayerInstance.setLight).toHaveBeenCalledWith(false);
        });

        it("異なるレイヤーでも正常に動作する", () => {
            const differentLayer = {
                light: true,
                name: "different-layer",
                index: 1
            };
            mockGetLayerFromElement.mockReturnValue(differentLayer);
            const mockEvent = createMockEvent();

            execute(mockEvent);

            expect(mockExternalLayer).toHaveBeenCalledWith(
                mockWorkSpace,
                mockWorkSpace.scene,
                differentLayer
            );
            expect(mockExternalLayerInstance.setLight).toHaveBeenCalledWith(false);
        });
    });

    describe("早期リターン条件", () => {
        it("button が 0 以外の場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ button: 1 });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
            expect(mockAllHideMenu).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
        });

        it("右クリック（button = 2）の場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ button: 2 });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
        });

        it("アクティブタッチポインターが2個以上の場合は処理を実行しない", () => {
            Object.defineProperty(mockActiveTouchPointers, 'size', {
                value: 2,
                writable: true,
                configurable: true
            });

            const mockEvent = createMockEvent();
            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
            expect(mockAllHideMenu).not.toHaveBeenCalled();
        });

        it("アクティブタッチポインターが3個の場合は処理を実行しない", () => {
            Object.defineProperty(mockActiveTouchPointers, 'size', {
                value: 3,
                writable: true,
                configurable: true
            });

            const mockEvent = createMockEvent();
            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
        });

        it("event.target が null の場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ target: null });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
            expect(mockAllHideMenu).not.toHaveBeenCalled();
        });

        it("event.target が undefined の場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ target: undefined });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
        });

        it("layerが存在しない場合は処理を実行しない", () => {
            mockGetLayerFromElement.mockReturnValue(null);
            const mockEvent = createMockEvent();

            execute(mockEvent);

            expect(mockGetLayerFromElement).toHaveBeenCalledWith(mockElement);

            // layer取得後の処理が実行されていないことを確認
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
            expect(mockAllHideMenu).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalLayer).not.toHaveBeenCalled();
        });

        it("layerがundefinedの場合は処理を実行しない", () => {
            mockGetLayerFromElement.mockReturnValue(undefined);
            const mockEvent = createMockEvent();

            execute(mockEvent);

            expect(mockGetLayerFromElement).toHaveBeenCalledWith(mockElement);
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("複合条件のテスト", () => {
        it("button != 0 かつ アクティブタッチポインターが複数の場合", () => {
            Object.defineProperty(mockActiveTouchPointers, 'size', {
                value: 2,
                writable: true,
                configurable: true
            });

            const mockEvent = createMockEvent({ button: 1 });
            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetLayerFromElement).not.toHaveBeenCalled();
        });

        it("有効なイベント かつ layerがnullの場合", () => {
            mockGetLayerFromElement.mockReturnValue(null);
            const mockEvent = createMockEvent();

            execute(mockEvent);

            expect(mockGetLayerFromElement).toHaveBeenCalledWith(mockElement);
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("イベント処理の詳細確認", () => {
        it("stopPropagationとpreventDefaultが適切に呼ばれる", () => {
            const mockEvent = createMockEvent();

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockEvent.preventDefault).toHaveBeenCalledOnce();
        });
    });

    describe("ExternalLayer処理の詳細確認", () => {
        it("ExternalLayerコンストラクタが正しい引数で呼ばれる", () => {
            const customWorkSpace = {
                scene: { id: "custom-scene" }
            };
            const customLayer = {
                light: false,
                name: "custom-layer",
                index: 2
            };

            mockGetCurrentWorkSpace.mockReturnValue(customWorkSpace);
            mockGetLayerFromElement.mockReturnValue(customLayer);
            const mockEvent = createMockEvent();

            execute(mockEvent);

            expect(mockExternalLayer).toHaveBeenCalledWith(
                customWorkSpace,
                customWorkSpace.scene,
                customLayer
            );
        });

        it("setLightメソッドが正しい値で呼ばれる", () => {
            const mockEvent = createMockEvent();

            execute(mockEvent);

            expect(mockExternalLayerInstance.setLight).toHaveBeenCalledWith(true);
            expect(mockExternalLayerInstance.setLight).toHaveBeenCalledTimes(1);
        });
    });

    describe("ライト状態のトグル動作確認", () => {
        const lightStates = [
            { current: false, expected: true, description: "オフ状態からオン状態へ" },
            { current: true, expected: false, description: "オン状態からオフ状態へ" }
        ];

        lightStates.forEach(({ current, expected, description }) => {
            it(`${description}`, () => {
                mockLayer.light = current;
                const mockEvent = createMockEvent();

                execute(mockEvent);

                expect(mockExternalLayerInstance.setLight).toHaveBeenCalledWith(expected);
            });
        });
    });

    describe("処理順序の確認", () => {
        it("処理が正しい順序で実行される", () => {
            const executionOrder: string[] = [];

            mockGetLayerFromElement.mockImplementation(() => {
                executionOrder.push("getLayerFromElement");
                return mockLayer;
            });

            const mockEvent = createMockEvent();
            const originalStopPropagation = mockEvent.stopPropagation;
            const originalPreventDefault = mockEvent.preventDefault;

            mockEvent.stopPropagation = vi.fn().mockImplementation(() => {
                executionOrder.push("stopPropagation");
                originalStopPropagation.call(mockEvent);
            });

            mockEvent.preventDefault = vi.fn().mockImplementation(() => {
                executionOrder.push("preventDefault");
                originalPreventDefault.call(mockEvent);
            });

            mockAllHideMenu.mockImplementation(() => {
                executionOrder.push("allHideMenu");
            });

            mockSetEditingElement.mockImplementation(() => {
                executionOrder.push("setEditingElement");
            });

            mockGetCurrentWorkSpace.mockImplementation(() => {
                executionOrder.push("getCurrentWorkSpace");
                return mockWorkSpace;
            });

            mockExternalLayer.mockImplementation(() => {
                executionOrder.push("ExternalLayer");
                return mockExternalLayerInstance;
            });

            mockExternalLayerInstance.setLight.mockImplementation(() => {
                executionOrder.push("setLight");
            });

            execute(mockEvent);

            expect(executionOrder).toEqual([
                "getLayerFromElement",
                "stopPropagation",
                "preventDefault",
                "allHideMenu",
                "setEditingElement",
                "getCurrentWorkSpace",
                "ExternalLayer",
                "setLight"
            ]);
        });
    });

    describe("グローバル状態管理の確認", () => {
        it("メニューが非表示化される", () => {
            const mockEvent = createMockEvent();

            execute(mockEvent);

            expect(mockAllHideMenu).toHaveBeenCalledOnce();
        });

        it("編集中要素がnullで初期化される", () => {
            const mockEvent = createMockEvent();

            execute(mockEvent);

            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
        });
    });

    describe("エッジケース", () => {
        it("レイヤーのlight値がundefinedの場合", () => {
            mockLayer.light = undefined;
            const mockEvent = createMockEvent();

            execute(mockEvent);

            // !layer.light は true になるため、setLight(true) が呼ばれる
            expect(mockExternalLayerInstance.setLight).toHaveBeenCalledWith(true);
        });

        it("レイヤーのlight値がnullの場合", () => {
            mockLayer.light = null;
            const mockEvent = createMockEvent();

            execute(mockEvent);

            // !layer.light は true になるため、setLight(true) が呼ばれる
            expect(mockExternalLayerInstance.setLight).toHaveBeenCalledWith(true);
        });

        it("レイヤーのlight値が数値の場合", () => {
            mockLayer.light = 1; // truthy値
            const mockEvent = createMockEvent();

            execute(mockEvent);

            // !layer.light は false になるため、setLight(false) が呼ばれる
            expect(mockExternalLayerInstance.setLight).toHaveBeenCalledWith(false);
        });
    });

    describe("targetとcurrentTargetの使い分け確認", () => {
        it("event.targetを使用してレイヤー取得を行う", () => {
            const targetElement = { id: "target" } as HTMLElement;
            const currentTargetElement = { id: "currentTarget" } as HTMLElement;

            const mockEvent = {
                button: 0,
                target: targetElement,
                currentTarget: currentTargetElement,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            } as any;

            execute(mockEvent);

            // targetが使用されることを確認
            expect(mockGetLayerFromElement).toHaveBeenCalledWith(targetElement);
            expect(mockGetLayerFromElement).not.toHaveBeenCalledWith(currentTargetElement);
        });
    });

    describe("同期処理の確認", () => {
        it("すべての処理が同期的に実行される", () => {
            const mockEvent = createMockEvent();

            // 同期的に実行されることを確認
            expect(() => execute(mockEvent)).not.toThrow();

            // すべての処理が即座に完了している
            expect(mockGetLayerFromElement).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockAllHideMenu).toHaveBeenCalled();
            expect(mockExternalLayerInstance.setLight).toHaveBeenCalled();
        });
    });
});
