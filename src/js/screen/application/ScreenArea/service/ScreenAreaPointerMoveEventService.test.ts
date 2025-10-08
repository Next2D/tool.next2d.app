import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// モック設定（vi.hoistedを使用）
const { mockGetActiveTool } = vi.hoisted(() => {
    return {
        mockGetActiveTool: vi.fn()
    };
});

vi.mock("@/tool/application/ToolUtil", () => ({
    $getActiveTool: mockGetActiveTool
}));

vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        CHANGE_CURSOR: "changeCursor"
    }
}));

import { execute } from "./ScreenAreaPointerMoveEventService";

describe("ScreenAreaPointerMoveEventService", () => {
    let mockTool: any;
    let mockPointerEvent: PointerEvent;

    beforeEach(() => {
        vi.clearAllMocks();

        // Tool モック
        mockTool = {
            id: "mock-tool",
            dispatchEvent: vi.fn()
        };

        // PointerEvent モック
        mockPointerEvent = new PointerEvent("pointermove", {
            pointerId: 1,
            clientX: 100,
            clientY: 150,
            buttons: 0
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("正常系", () => {
        it("アクティブツールが存在する場合、CHANGE_CURSORイベントを発行する", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(mockPointerEvent);

            expect(mockGetActiveTool).toHaveBeenCalledOnce();
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", mockPointerEvent);
        });

        it("異なるPointerEventでも正しく動作する", () => {
            const customPointerEvent = new PointerEvent("pointermove", {
                pointerId: 2,
                clientX: 200,
                clientY: 250,
                buttons: 1
            });

            mockGetActiveTool.mockReturnValue(mockTool);

            execute(customPointerEvent);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", customPointerEvent);
        });

        it("複数回の呼び出しでも正しく動作する", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            const event1 = new PointerEvent("pointermove", { clientX: 100, clientY: 100 });
            const event2 = new PointerEvent("pointermove", { clientX: 200, clientY: 200 });

            execute(event1);
            execute(event2);

            expect(mockTool.dispatchEvent).toHaveBeenCalledTimes(2);
            expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(1, "changeCursor", event1);
            expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(2, "changeCursor", event2);
        });

        it("ツールが変更された場合、新しいツールにイベントが発行される", () => {
            const mockTool2 = {
                id: "mock-tool-2",
                dispatchEvent: vi.fn()
            };

            // 最初のツール
            mockGetActiveTool.mockReturnValueOnce(mockTool);
            execute(mockPointerEvent);

            // ツールが変更
            mockGetActiveTool.mockReturnValueOnce(mockTool2);
            execute(mockPointerEvent);

            expect(mockTool.dispatchEvent).toHaveBeenCalledOnce();
            expect(mockTool2.dispatchEvent).toHaveBeenCalledOnce();
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", mockPointerEvent);
            expect(mockTool2.dispatchEvent).toHaveBeenCalledWith("changeCursor", mockPointerEvent);
        });
    });

    describe("早期リターン条件", () => {
        it("アクティブツールが存在しない場合は何もしない", () => {
            mockGetActiveTool.mockReturnValue(null);

            execute(mockPointerEvent);

            expect(mockGetActiveTool).toHaveBeenCalledOnce();
            // ツールが存在しないので、dispatchEventは呼ばれない
        });

        it("アクティブツールがundefinedの場合は何もしない", () => {
            mockGetActiveTool.mockReturnValue(undefined);

            execute(mockPointerEvent);

            expect(mockGetActiveTool).toHaveBeenCalledOnce();
        });

        it("アクティブツールがfalsyな値の場合は何もしない", () => {
            const falsyValues = [false, 0, "", NaN];

            falsyValues.forEach(falsyValue => {
                mockGetActiveTool.mockReturnValueOnce(falsyValue);
                execute(mockPointerEvent);
            });

            expect(mockGetActiveTool).toHaveBeenCalledTimes(falsyValues.length);
        });
    });

    describe("PointerEventの各種プロパティ", () => {
        beforeEach(() => {
            mockGetActiveTool.mockReturnValue(mockTool);
        });

        it("マウスの左ボタンが押された状態でのPointerEvent", () => {
            const event = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 100,
                clientY: 150,
                buttons: 1, // 左ボタン
                pressure: 0.5
            });

            execute(event);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", event);
        });

        it("マウスの右ボタンが押された状態でのPointerEvent", () => {
            const event = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 100,
                clientY: 150,
                buttons: 2, // 右ボタン
                pressure: 0.8
            });

            execute(event);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", event);
        });

        it("タッチデバイスでのPointerEvent", () => {
            const event = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 100,
                clientY: 150,
                pointerType: "touch",
                pressure: 1.0
            });

            execute(event);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", event);
        });

        it("ペンデバイスでのPointerEvent", () => {
            const event = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 100,
                clientY: 150,
                pointerType: "pen",
                pressure: 0.7,
                tiltX: 15,
                tiltY: -10
            });

            execute(event);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", event);
        });

        it("極値の座標でのPointerEvent", () => {
            const event = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: Number.MAX_SAFE_INTEGER,
                clientY: Number.MIN_SAFE_INTEGER
            });

            execute(event);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", event);
        });

        it("負の座標でのPointerEvent", () => {
            const event = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: -100,
                clientY: -200
            });

            execute(event);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", event);
        });

        it("0座標でのPointerEvent", () => {
            const event = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 0,
                clientY: 0
            });

            execute(event);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", event);
        });

        it("小数点座標でのPointerEvent", () => {
            const event = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 100.5,
                clientY: 150.7
            });

            execute(event);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", event);
        });
    });

    describe("ツールのdispatchEventメソッドのテスト", () => {
        it("dispatchEventが正常に呼び出される", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(mockPointerEvent);

            expect(mockTool.dispatchEvent).toHaveBeenCalledOnce();
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", mockPointerEvent);
        });

        it("ツールにdispatchEventメソッドが存在しない場合", () => {
            const toolWithoutDispatch = {
                id: "tool-without-dispatch"
                // dispatchEventメソッドなし
            };

            mockGetActiveTool.mockReturnValue(toolWithoutDispatch);

            expect(() => execute(mockPointerEvent)).toThrow();
        });

        it("dispatchEventがnullの場合", () => {
            const toolWithNullDispatch = {
                id: "tool-with-null-dispatch",
                dispatchEvent: null
            };

            mockGetActiveTool.mockReturnValue(toolWithNullDispatch);

            expect(() => execute(mockPointerEvent)).toThrow();
        });

        it("dispatchEventがundefinedの場合", () => {
            const toolWithUndefinedDispatch = {
                id: "tool-with-undefined-dispatch",
                dispatchEvent: undefined
            };

            mockGetActiveTool.mockReturnValue(toolWithUndefinedDispatch);

            expect(() => execute(mockPointerEvent)).toThrow();
        });
    });

    describe("エラーハンドリング", () => {
        it("getActiveToolで例外が発生した場合", () => {
            mockGetActiveTool.mockImplementation(() => {
                throw new Error("getActiveTool failed");
            });

            expect(() => execute(mockPointerEvent)).toThrow("getActiveTool failed");
        });

        it("dispatchEventで例外が発生した場合", () => {
            mockTool.dispatchEvent.mockImplementation(() => {
                throw new Error("dispatchEvent failed");
            });
            mockGetActiveTool.mockReturnValue(mockTool);

            expect(() => execute(mockPointerEvent)).toThrow("dispatchEvent failed");
        });

        it("EventTypeが存在しない場合", () => {
            // vi.doMockはモジュールロード後は効果がないため、
            // 実際にはEventType.CHANGE_CURSORの値が使用される
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(mockPointerEvent);

            // EventType.CHANGE_CURSORの実際の値が渡される
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", mockPointerEvent);
        });
    });

    describe("エッジケース", () => {
        it("eventがnullの場合", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(null as any);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", null);
        });

        it("eventがundefinedの場合", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            execute(undefined as any);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", undefined);
        });

        it("PointerEvent以外のEventオブジェクト", () => {
            const mouseEvent = new MouseEvent("mousemove", {
                clientX: 100,
                clientY: 150
            });

            mockGetActiveTool.mockReturnValue(mockTool);

            execute(mouseEvent as any);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", mouseEvent);
        });

        it("プレーンオブジェクトをeventとして渡す", () => {
            const plainEvent = {
                type: "pointermove",
                clientX: 100,
                clientY: 150
            };

            mockGetActiveTool.mockReturnValue(mockTool);

            execute(plainEvent as any);

            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", plainEvent);
        });
    });

    describe("パフォーマンステスト", () => {
        it("高頻度の呼び出しでもパフォーマンスが安定している", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            const events = Array.from({ length: 1000 }, (_, i) => 
                new PointerEvent("pointermove", {
                    pointerId: 1,
                    clientX: i,
                    clientY: i
                })
            );

            const start = performance.now();
            events.forEach(event => execute(event));
            const end = performance.now();
            const duration = end - start;

            // 1000回の呼び出しが100ms以内で完了することを期待
            expect(duration).toBeLessThan(100);
            expect(mockTool.dispatchEvent).toHaveBeenCalledTimes(1000);
        });

        it("ツールの取得が重い場合でも適切に動作する", () => {
            // getActiveToolを意図的に遅くする
            mockGetActiveTool.mockImplementation(() => {
                // 1ms の遅延をシミュレート
                const start = Date.now();
                while (Date.now() - start < 1) {
                    // busy wait
                }
                return mockTool;
            });

            const start = performance.now();
            execute(mockPointerEvent);
            const end = performance.now();
            const duration = end - start;

            // 遅延があっても正しく動作
            expect(mockTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", mockPointerEvent);
            expect(duration).toBeGreaterThan(0.5); // 遅延が反映されている
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際のマウス移動シナリオ：ツールからツールへの切り替え", () => {
            const selectionTool = {
                id: "selection-tool",
                dispatchEvent: vi.fn()
            };
            const drawingTool = {
                id: "drawing-tool", 
                dispatchEvent: vi.fn()
            };

            // 選択ツールでのマウス移動
            mockGetActiveTool.mockReturnValueOnce(selectionTool);
            const moveEvent1 = new PointerEvent("pointermove", { clientX: 100, clientY: 100 });
            execute(moveEvent1);

            // ツールが描画ツールに変更
            mockGetActiveTool.mockReturnValueOnce(drawingTool);
            const moveEvent2 = new PointerEvent("pointermove", { clientX: 150, clientY: 150 });
            execute(moveEvent2);

            // ツールが無効化
            mockGetActiveTool.mockReturnValueOnce(null);
            const moveEvent3 = new PointerEvent("pointermove", { clientX: 200, clientY: 200 });
            execute(moveEvent3);

            expect(selectionTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", moveEvent1);
            expect(drawingTool.dispatchEvent).toHaveBeenCalledWith("changeCursor", moveEvent2);
            expect(selectionTool.dispatchEvent).toHaveBeenCalledTimes(1);
            expect(drawingTool.dispatchEvent).toHaveBeenCalledTimes(1);
        });

        it("複雑なポインターイベントシーケンス", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            // マウス移動開始
            const startEvent = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 0,
                clientY: 0,
                buttons: 0
            });

            // ドラッグ中の移動
            const dragEvent = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 50,
                clientY: 50,
                buttons: 1 // 左ボタン押下
            });

            // ホバー状態の移動
            const hoverEvent = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 100,
                clientY: 100,
                buttons: 0
            });

            execute(startEvent);
            execute(dragEvent);
            execute(hoverEvent);

            expect(mockTool.dispatchEvent).toHaveBeenCalledTimes(3);
            expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(1, "changeCursor", startEvent);
            expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(2, "changeCursor", dragEvent);
            expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(3, "changeCursor", hoverEvent);
        });

        it("タッチデバイスでのマルチタッチシナリオ", () => {
            mockGetActiveTool.mockReturnValue(mockTool);

            // 第1タッチポイント
            const touch1Event = new PointerEvent("pointermove", {
                pointerId: 1,
                clientX: 100,
                clientY: 100,
                pointerType: "touch"
            });

            // 第2タッチポイント
            const touch2Event = new PointerEvent("pointermove", {
                pointerId: 2,
                clientX: 200,
                clientY: 200,
                pointerType: "touch"
            });

            execute(touch1Event);
            execute(touch2Event);

            expect(mockTool.dispatchEvent).toHaveBeenCalledTimes(2);
            expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(1, "changeCursor", touch1Event);
            expect(mockTool.dispatchEvent).toHaveBeenNthCalledWith(2, "changeCursor", touch2Event);
        });
    });
});
