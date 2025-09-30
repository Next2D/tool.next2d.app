import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ScreenAreaPointerOutEventService";

// モック設定
const mockGetActiveTool = vi.fn();
const mockScreenArea = {
    active: true
};

vi.mock("@/tool/application/ToolUtil", () => ({
    $getActiveTool: mockGetActiveTool
}));

vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        POINTER_OUT: "pointerOut"
    }
}));

vi.mock("@/screen/domain/model/ScreenArea", () => ({
    screenArea: mockScreenArea
}));

describe("ScreenAreaPointerOutEventService", () => {
    let mockTool: any;
    let mockPointerEvent: PointerEvent;

    beforeEach(() => {
        vi.clearAllMocks();

        // screenArea の初期状態をリセット
        mockScreenArea.active = true;

        // Tool モック
        mockTool = {
            id: "mock-tool",
            dispatchEvent: vi.fn()
        };

        // PointerEvent モック
        mockPointerEvent = new PointerEvent("pointerout", {
            pointerId: 1,
            clientX: 100,
            clientY: 150,
            buttons: 0
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
        // screenArea の状態をリセット
        mockScreenArea.active = true;
    });

    describe("正常系", () => {
        it("screenArea.activeをfalseに設定し、アクティブツールにPOINTER_OUTイベントを発行する", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(mockPointerEvent);

            expect(mockScreenArea.active).toBe(false);
            expect(mockGetActiveTool).toHaveBeenCalledOnce();
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", mockPointerEvent);
        });

        it("screenArea.activeが既にfalseの場合でも正しく動作する", () => {
            mockScreenArea.active = false;
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(mockPointerEvent);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", mockPointerEvent);
        });

        it("異なるPointerEventでも正しく動作する", () => {
            const customPointerEvent = new PointerEvent("pointerout", {
                pointerId: 2,
                clientX: 200,
                clientY: 250,
                buttons: 1
            });

            mockGetActiveTool.mockReturnValue(mockTool);

            execute(customPointerEvent);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", customPointerEvent);
        });

        it("複数回の呼び出しでも正しく動作する", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            const event1 = new PointerEvent("pointerout", { clientX: 100, clientY: 100 });
            const event2 = new PointerEvent("pointerout", { clientX: 200, clientY: 200 });

            execute(event1);
            execute(event2);

            // screenArea.activeは複数回falseに設定される
            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledTimes(2);
            expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(1, "pointerOut", event1);
            expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(2, "pointerOut", event2);
        });

        it("ツールが変更された場合、新しいツールにイベントが発行される", () => {
            const mockTool2 = {
                id: "mock-tool-2",
                dispatchEvent: vi.fn()
            };

            // 最初のツール
            mockGetActiveTool.mockReturnValueOnce(mockTool);
            execute(mockPointerEvent);

            // screenArea.activeを一旦trueに戻す（シミュレーション）
            mockScreenArea.active = true;

            // ツールが変更
            mockGetActiveTool.mockReturnValueOnce(mockTool2);
            execute(mockPointerEvent);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", mockPointerEvent);
            expect(mockTool2.dispatchEvent).toHaveBeenCalledWith("pointerOut", mockPointerEvent);
        });
    });

    describe("screenArea.activeの状態管理", () => {
        it("screenArea.activeが常にfalseに設定される", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            // 初期状態がtrueの場合
            expect(mockScreenArea.active).toBe(true);
            execute(mockPointerEvent);
            expect(mockScreenArea.active).toBe(false);
        });

        it("ツールが存在しない場合でもscreenArea.activeはfalseに設定される", () => {
            mockGetActiveTool.mockReturnValue(null);

            expect(mockScreenArea.active).toBe(true);
            execute(mockPointerEvent);
            expect(mockScreenArea.active).toBe(false);
        });

        it("例外が発生した場合でもscreenArea.activeはfalseに設定される", () => {
            mockGetActiveTool.mockImplementation(() => {
                throw new Error("getActiveTool failed");
            });

            expect(mockScreenArea.active).toBe(true);
            
            expect(() => execute(mockPointerEvent)).toThrow("getActiveTool failed");
            expect(mockScreenArea.active).toBe(false);
        });
    });

    describe("早期リターン条件", () => {
        it("アクティブツールが存在しない場合、screenArea.activeをfalseに設定後に終了する", () => {
            mockGetActiveTool.mockReturnValue(null);

            execute(mockPointerEvent);

            expect(mockScreenArea.active).toBe(false);
            expect(mockGetActiveTool).toHaveBeenCalledOnce();
            // ツールが存在しないので、dispatchEventは呼ばれない
        });

        it("アクティブツールがundefinedの場合は何もしない", () => {
            mockGetActiveTool.mockReturnValue(undefined);

            execute(mockPointerEvent);

            expect(mockScreenArea.active).toBe(false);
            expect(mockGetActiveTool).toHaveBeenCalledOnce();
        });

        it("アクティブツールがfalsyな値の場合は何もしない", () => {
            const falsyValues = [false, 0, "", NaN];

            falsyValues.forEach((falsyValue, index) => {
                // screenArea.activeを一旦trueに戻す
                mockScreenArea.active = true;
                
                mockGetActiveTool.mockReturnValueOnce(falsyValue);
                execute(mockPointerEvent);
                
                expect(mockScreenArea.active).toBe(false);
            });

            expect(mockGetActiveTool).toHaveBeenCalledTimes(falsyValues.length);
        });
    });

    describe("PointerEventの各種プロパティ", () => {
        beforeEach(() => {
            mockGetActiveTool.mockReturnValue(mockTool);
        });

        it("マウスの左ボタンが押された状態でのPointerEvent", () => {
            const event = new PointerEvent("pointerout", {
                pointerId: 1,
                clientX: 100,
                clientY: 150,
                buttons: 1, // 左ボタン
                pressure: 0.5
            });

            execute(event);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", event);
        });

        it("マウスの右ボタンが押された状態でのPointerEvent", () => {
            const event = new PointerEvent("pointerout", {
                pointerId: 1,
                clientX: 100,
                clientY: 150,
                buttons: 2, // 右ボタン
                pressure: 0.8
            });

            execute(event);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", event);
        });

        it("タッチデバイスでのPointerEvent", () => {
            const event = new PointerEvent("pointerout", {
                pointerId: 1,
                clientX: 100,
                clientY: 150,
                pointerType: "touch",
                pressure: 1.0
            });

            execute(event);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", event);
        });

        it("ペンデバイスでのPointerEvent", () => {
            const event = new PointerEvent("pointerout", {
                pointerId: 1,
                clientX: 100,
                clientY: 150,
                pointerType: "pen",
                pressure: 0.7,
                tiltX: 15,
                tiltY: -10
            });

            execute(event);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", event);
        });

        it("極値の座標でのPointerEvent", () => {
            const event = new PointerEvent("pointerout", {
                pointerId: 1,
                clientX: Number.MAX_SAFE_INTEGER,
                clientY: Number.MIN_SAFE_INTEGER
            });

            execute(event);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", event);
        });

        it("負の座標でのPointerEvent", () => {
            const event = new PointerEvent("pointerout", {
                pointerId: 1,
                clientX: -100,
                clientY: -200
            });

            execute(event);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", event);
        });

        it("0座標でのPointerEvent", () => {
            const event = new PointerEvent("pointerout", {
                pointerId: 1,
                clientX: 0,
                clientY: 0
            });

            execute(event);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", event);
        });

        it("小数点座標でのPointerEvent", () => {
            const event = new PointerEvent("pointerout", {
                pointerId: 1,
                clientX: 100.5,
                clientY: 150.7
            });

            execute(event);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", event);
        });
    });

    describe("ツールのdispatchEventメソッドのテスト", () => {
        it("dispatchEventが正常に呼び出される", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(mockPointerEvent);

            expect(mockTool.dispatchEvent).toHaveBeenCalledOnce();
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", mockPointerEvent);
        });

        it("ツールにdispatchEventメソッドが存在しない場合", () => {
            const toolWithoutDispatch = {
                id: "tool-without-dispatch"
                // dispatchEventメソッドなし
            };

            mockGetActiveTool.mockReturnValue(toolWithoutDispatch);

            expect(() => execute(mockPointerEvent)).toThrow();
            expect(mockScreenArea.active).toBe(false); // activeは設定される
        });

        it("dispatchEventがnullの場合", () => {
            const toolWithNullDispatch = {
                id: "tool-with-null-dispatch",
                dispatchEvent: null
            };

            mockGetActiveTool.mockReturnValue(toolWithNullDispatch);

            expect(() => execute(mockPointerEvent)).toThrow();
            expect(mockScreenArea.active).toBe(false);
        });

        it("dispatchEventがundefinedの場合", () => {
            const toolWithUndefinedDispatch = {
                id: "tool-with-undefined-dispatch",
                dispatchEvent: undefined
            };

            mockGetActiveTool.mockReturnValue(toolWithUndefinedDispatch);

            expect(() => execute(mockPointerEvent)).toThrow();
            expect(mockScreenArea.active).toBe(false);
        });
    });

    describe("エラーハンドリング", () => {
        it("getActiveToolで例外が発生した場合", () => {
            mockGetActiveTool.mockImplementation(() => {
                throw new Error("getActiveTool failed");
            });

            expect(() => execute(mockPointerEvent)).toThrow("getActiveTool failed");
            expect(mockScreenArea.active).toBe(false); // activeは設定される
        });

        it("dispatchEventで例外が発生した場合", () => {
            mockTool.dispatchEvent.mockImplementation(() => {
                throw new Error("dispatchEvent failed");
            });
            mockGetActiveTool.mockReturnValue(mockTool);

            expect(() => execute(mockPointerEvent)).toThrow("dispatchEvent failed");
            expect(mockScreenArea.active).toBe(false);
        });

        it("EventTypeが存在しない場合", () => {
            // EventTypeのモックを一時的に変更
            vi.doMock("@/tool/domain/event/EventType", () => ({
                EventType: {}
            }));

            mockGetActiveTool.mockReturnValue(mockTool);

            execute(mockPointerEvent);

            expect(mockScreenArea.active).toBe(false);
            // POINTER_OUTが存在しないのでundefinedが渡される
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith(undefined, mockPointerEvent);
        });

        it("screenAreaオブジェクトのactiveプロパティが読み取り専用の場合", () => {
            // activeプロパティを読み取り専用に設定
            Object.defineProperty(mockScreenArea, "active", {
                value: true,
                writable: false,
                configurable: true
            });

            mockGetActiveTool.mockReturnValue(mockTool);

            expect(() => execute(mockPointerEvent)).toThrow();
        });
    });

    describe("エッジケース", () => {
        it("eventがnullの場合", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(null as any);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", null);
        });

        it("eventがundefinedの場合", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(undefined as any);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", undefined);
        });

        it("PointerEvent以外のEventオブジェクト", () => {
            const mouseEvent = new MouseEvent("mouseout", {
                clientX: 100,
                clientY: 150
            });

            mockGetActiveTool.mockReturnValue(mockTool);

            execute(mouseEvent as any);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", mouseEvent);
        });

        it("プレーンオブジェクトをeventとして渡す", () => {
            const plainEvent = {
                type: "pointerout",
                clientX: 100,
                clientY: 150
            };

            mockGetActiveTool.mockReturnValue(mockTool);

            execute(plainEvent as any);

            expect(mockScreenArea.active).toBe(false);
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", plainEvent);
        });
    });

    describe("実行順序の確認", () => {
        it("screenArea.activeの設定がgetActiveToolより先に実行される", () => {
            const executionOrder: string[] = [];

            // getActiveToolの実行をトラッキング
            mockGetActiveTool.mockImplementation(() => {
                executionOrder.push("getActiveTool");
                return mockTool;
            });

            // screenArea.activeのセッターをモック
            let originalActive = mockScreenArea.active;
            Object.defineProperty(mockScreenArea, "active", {
                get: () => originalActive,
                set: (value) => {
                    executionOrder.push("setActive");
                    originalActive = value;
                },
                configurable: true
            });

            execute(mockPointerEvent);

            expect(executionOrder).toEqual(["setActive", "getActiveTool"]);
        });

        it("getActiveToolが失敗してもscreenArea.activeは設定済みである", () => {
            mockGetActiveTool.mockImplementation(() => {
                // この時点で既にactiveがfalseになっているべき
                expect(mockScreenArea.active).toBe(false);
                throw new Error("getActiveTool failed");
            });

            expect(() => execute(mockPointerEvent)).toThrow("getActiveTool failed");
        });
    });

    describe("パフォーマンステスト", () => {
        it("高頻度の呼び出しでもパフォーマンスが安定している", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            const events = Array.from({ length: 1000 }, (_, i) => 
                new PointerEvent("pointerout", {
                    pointerId: 1,
                    clientX: i,
                    clientY: i
                })
            );

            const start = performance.now();
            events.forEach(event => {
                // activeを一旦trueに戻してから実行
                mockScreenArea.active = true;
                execute(event);
            });
            const end = performance.now();
            const duration = end - start;

            // 1000回の呼び出しが100ms以内で完了することを期待
            expect(duration).toBeLessThan(100);
            expect(mockTool.dispatchEvent).toHaveBeenCalledTimes(1000);
            expect(mockScreenArea.active).toBe(false);
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際のマウスアウトシナリオ：アクティブエリアの状態管理", () => {
            const selectionTool = {
                id: "selection-tool",
                dispatchEvent: vi.fn()
            };

            // 初期状態：スクリーンエリアがアクティブ
            expect(mockScreenArea.active).toBe(true);

            // マウスアウトイベント発生
            mockGetActiveTool.mockReturnValue(selectionTool);
            const outEvent = new PointerEvent("pointerout", { clientX: 300, clientY: 300 });
            execute(outEvent);

            // スクリーンエリアが非アクティブになり、ツールにイベントが送信
            expect(mockScreenArea.active).toBe(false);
            expect(selectionTool.dispatchEvent).toHaveBeenCalledWith("pointerOut", outEvent);
        });

        it("ツール切り替え中のマウスアウト", () => {
            const tool1 = { id: "tool1", dispatchEvent: vi.fn() };
            const tool2 = { id: "tool2", dispatchEvent: vi.fn() };

            // tool1でマウスアウト
            mockGetActiveTool.mockReturnValueOnce(tool1);
            execute(mockPointerEvent);

            expect(mockScreenArea.active).toBe(false);
            expect(tool1.dispatchEvent).toHaveBeenCalledWith("pointerOut", mockPointerEvent);

            // アクティブ状態をリセット
            mockScreenArea.active = true;

            // tool2でマウスアウト
            mockGetActiveTool.mockReturnValueOnce(tool2);
            execute(mockPointerEvent);

            expect(mockScreenArea.active).toBe(false);
            expect(tool2.dispatchEvent).toHaveBeenCalledWith("pointerOut", mockPointerEvent);
        });

        it("ツールなし状態でのマウスアウト", () => {
            // ツールが無効な状態
            mockGetActiveTool.mockReturnValue(null);

            // マウスアウトイベント発生
            execute(mockPointerEvent);

            // スクリーンエリアは非アクティブになるが、ツールイベントは発行されない
            expect(mockScreenArea.active).toBe(false);
            expect(mockGetActiveTool).toHaveBeenCalledOnce();
        });

        it("連続的なマウスアウトイベント", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            const events = [
                new PointerEvent("pointerout", { clientX: 100, clientY: 100 }),
                new PointerEvent("pointerout", { clientX: 101, clientY: 101 }),
                new PointerEvent("pointerout", { clientX: 102, clientY: 102 })
            ];

            events.forEach((event, index) => {
                // 各イベントの前にactiveをtrueに戻す（実際のUIでの状態変化をシミュレート）
                if (index > 0) mockScreenArea.active = true;
                execute(event);
                expect(mockScreenArea.active).toBe(false);
            });

            expect(mockTool.dispatchEvent).toHaveBeenCalledTimes(3);
            events.forEach((event, index) => {
                expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(index + 1, "pointerOut", event);
            });
        });
    });
});
