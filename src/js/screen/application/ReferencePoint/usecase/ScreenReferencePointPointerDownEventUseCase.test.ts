import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ScreenReferencePointPointerDownEventUseCase";

// モック設定
const mockActiveTouchPointers = { size: 1 };
const mockScreenReferencePointPointerMoveEventUseCase = vi.fn();
const mockScreenReferencePointPointerUpEventUseCase = vi.fn();

vi.mock("@/global/GlobalUtil", () => ({
    $activeTouchPointers: mockActiveTouchPointers
}));

vi.mock("./ScreenReferencePointPointerMoveEventUseCase", () => ({
    execute: mockScreenReferencePointPointerMoveEventUseCase
}));

vi.mock("./ScreenReferencePointPointerUpEventUseCase", () => ({
    execute: mockScreenReferencePointPointerUpEventUseCase
}));

vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        POINTER_MOVE: "pointermove",
        POINTER_UP: "pointerup",
        POINTER_LEAVE: "pointerleave",
        POINTER_CANCEL: "pointercancel"
    }
}));

describe("ScreenReferencePointPointerDownEventUseCase", () => {
    let mockElement: HTMLElement;
    let mockEvent: PointerEvent;

    beforeEach(() => {
        vi.clearAllMocks();

        // HTML要素のモック作成
        mockElement = {
            style: { cursor: "" },
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            setPointerCapture: vi.fn(),
            releasePointerCapture: vi.fn()
        } as any;

        // PointerEvent のモック作成
        mockEvent = {
            button: 0,
            target: mockElement,
            pointerId: 123,
            stopPropagation: vi.fn()
        } as any;

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
        pointerId: 123,
        stopPropagation: vi.fn(),
        ...overrides
    } as any);

    describe("正常系", () => {
        it("有効なポインターダウンイベントで完全な初期化処理が実行される", () => {
            execute(mockEvent);

            // イベント伝播の停止確認
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();

            // カーソルスタイルの変更確認
            expect(mockElement.style.cursor).toBe("grabbing");

            // ポインターキャプチャの設定確認
            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(123);

            // 4つのイベントリスナーが登録されることを確認
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(4);

            // POINTER_MOVE イベント（passive: false オプション付き）
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointermove",
                mockScreenReferencePointPointerMoveEventUseCase,
                { "passive": false }
            );

            // POINTER_UP イベント
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerup",
                mockScreenReferencePointPointerUpEventUseCase
            );

            // POINTER_LEAVE イベント
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerleave",
                mockScreenReferencePointPointerUpEventUseCase
            );

            // POINTER_CANCEL イベント
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointercancel",
                mockScreenReferencePointPointerUpEventUseCase
            );
        });

        it("異なるpointerIdでも正常に動作する", () => {
            const customEvent = createMockEvent({ pointerId: 456 });

            execute(customEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(456);
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(4);
        });

        it("カーソルスタイルが既に設定されている場合も上書きされる", () => {
            mockElement.style.cursor = "pointer";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("grabbing");
        });
    });

    describe("早期リターン条件", () => {
        it("button が 0 以外の場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ button: 1 });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
            expect(mockElement.style.cursor).toBe(""); // 変更されない
        });

        it("右クリック（button = 2）の場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ button: 2 });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });

        it("アクティブタッチポインターが2個以上の場合は処理を実行しない", () => {
            Object.defineProperty(mockActiveTouchPointers, 'size', {
                value: 2,
                writable: true,
                configurable: true
            });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });

        it("アクティブタッチポインターが3個の場合は処理を実行しない", () => {
            Object.defineProperty(mockActiveTouchPointers, 'size', {
                value: 3,
                writable: true,
                configurable: true
            });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });

        it("event.target が null の場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ target: null });

            execute(mockEvent);

            // stopPropagation は呼ばれない（target チェック後の処理のため）
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("event.target が undefined の場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ target: undefined });

            execute(mockEvent);

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
            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });
    });

    describe("イベント処理の詳細確認", () => {
        it("stopPropagationが適切なタイミングで呼ばれる", () => {
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
        });

        it("ポインターキャプチャが正しいポインターIDで設定される", () => {
            const mockEvent1 = createMockEvent({ pointerId: 100 });
            const mockEvent2 = createMockEvent({ pointerId: 200 });

            execute(mockEvent1);
            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(100);

            vi.clearAllMocks();

            execute(mockEvent2);
            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(200);
        });
    });

    describe("イベントリスナー登録の詳細確認", () => {
        it("POINTER_MOVE イベントにpassive:falseオプションが設定される", () => {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointermove",
                mockScreenReferencePointPointerMoveEventUseCase,
                { "passive": false }
            );
        });

        it("UP/LEAVE/CANCEL イベントにはオプションが設定されない", () => {
            execute(mockEvent);

            const calls = (mockElement.addEventListener as any).mock.calls;

            // POINTER_UP (2番目の呼び出し)
            expect(calls[1]).toEqual([
                "pointerup",
                mockScreenReferencePointPointerUpEventUseCase
            ]);

            // POINTER_LEAVE (3番目の呼び出し)
            expect(calls[2]).toEqual([
                "pointerleave",
                mockScreenReferencePointPointerUpEventUseCase
            ]);

            // POINTER_CANCEL (4番目の呼び出し)
            expect(calls[3]).toEqual([
                "pointercancel",
                mockScreenReferencePointPointerUpEventUseCase
            ]);
        });

        it("UP/LEAVE/CANCEL イベントは同じハンドラーを使用する", () => {
            execute(mockEvent);

            // 後の3つのイベントは同じハンドラーを使用
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerup",
                mockScreenReferencePointPointerUpEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerleave",
                mockScreenReferencePointPointerUpEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointercancel",
                mockScreenReferencePointPointerUpEventUseCase
            );
        });
    });

    describe("カーソル管理", () => {
        it("カーソルが grabbing に設定される", () => {
            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("grabbing");
        });

        it("既存のカーソルスタイルが上書きされる", () => {
            mockElement.style.cursor = "default";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("grabbing");
        });
    });

    describe("処理順序の確認", () => {
        it("処理が正しい順序で実行される", () => {
            const executionOrder: string[] = [];

            const originalStopPropagation = mockEvent.stopPropagation;
            mockEvent.stopPropagation = vi.fn().mockImplementation(() => {
                executionOrder.push("stopPropagation");
                originalStopPropagation.call(mockEvent);
            });

            const originalSetPointerCapture = mockElement.setPointerCapture;
            mockElement.setPointerCapture = vi.fn().mockImplementation((pointerId) => {
                executionOrder.push("setPointerCapture");
                originalSetPointerCapture.call(mockElement, pointerId);
            });

            const originalAddEventListener = mockElement.addEventListener;
            mockElement.addEventListener = vi.fn().mockImplementation((type, handler, options) => {
                executionOrder.push(`addEventListener_${type}`);
                originalAddEventListener.call(mockElement, type, handler, options);
            });

            execute(mockEvent);

            expect(executionOrder).toEqual([
                "stopPropagation",
                "setPointerCapture",
                "addEventListener_pointermove",
                "addEventListener_pointerup",
                "addEventListener_pointerleave",
                "addEventListener_pointercancel"
            ]);
        });
    });

    describe("エラーハンドリング", () => {
        it("setPointerCaptureでエラーが発生した場合", () => {
            mockElement.setPointerCapture = vi.fn().mockImplementation(() => {
                throw new Error("setPointerCapture failed");
            });

            expect(() => execute(mockEvent)).toThrow("setPointerCapture failed");
        });

        it("addEventListenerでエラーが発生した場合", () => {
            mockElement.addEventListener = vi.fn().mockImplementation(() => {
                throw new Error("addEventListener failed");
            });

            expect(() => execute(mockEvent)).toThrow("addEventListener failed");
        });
    });

    describe("エッジケースの処理", () => {
        it("pointerIdが0の場合でも正常に動作する", () => {
            const mockEvent = createMockEvent({ pointerId: 0 });

            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(0);
        });

        it("pointerIdが負の値の場合でも正常に動作する", () => {
            const mockEvent = createMockEvent({ pointerId: -1 });

            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(-1);
        });
    });
});
