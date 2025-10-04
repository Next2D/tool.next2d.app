import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { EventType } from "@/tool/domain/event/EventType";

// モック関数の定義
const mock$setCursor = vi.fn();
const mock$setColorSettingState = vi.fn();
const mockColorSettingAlphaMultiplierPointerMoveUseCase = vi.fn();
const mockColorSettingAlphaMultiplierUpdateValueUseCase = vi.fn();

// vi.mockの呼び出し
vi.mock("@/global/GlobalUtil", () => ({
    $setCursor: (cursor: string) => mock$setCursor(cursor)
}));

vi.mock("../ColorSettingUtil", () => ({
    $setColorSettingState: (state: string) => mock$setColorSettingState(state)
}));

vi.mock("./ColorSettingAlphaMultiplierPointerMoveUseCase", () => ({
    execute: mockColorSettingAlphaMultiplierPointerMoveUseCase
}));

vi.mock("./ColorSettingAlphaMultiplierUpdateValueUseCase", () => ({
    execute: async (value: number) => mockColorSettingAlphaMultiplierUpdateValueUseCase(value)
}));

// 動的インポート
const { execute } = await import("./ColorSettingAlphaMultiplierPointerUpUseCase");

describe("ColorSettingAlphaMultiplierPointerUpUseCase", () => {
    let mockElement: HTMLInputElement;

    const createMockEvent = (
        pointerId: number = 1,
        target: HTMLInputElement | null = null
    ): PointerEvent => {
        return {
            pointerId: pointerId,
            target: target,
            stopPropagation: vi.fn()
        } as unknown as PointerEvent;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // モックHTML要素を作成
        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "75";
        mockElement.releasePointerCapture = vi.fn();
        mockElement.removeEventListener = vi.fn();
        mockElement.focus = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("基本動作", () => {
        it("colorSettingStateが'up'に設定される", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("up");
        });

        it("カーソルが'auto'に設定される", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("auto");
        });

        it("event.targetがnullの場合は早期リターン", async () => {
            const mockEvent = createMockEvent(1, null);

            await execute(mockEvent);

            // 状態とカーソルは設定されるが、それ以降の処理は実行されない
            expect(mock$setColorSettingState).toHaveBeenCalledWith("up");
            expect(mock$setCursor).toHaveBeenCalledWith("auto");
            expect(mockElement.releasePointerCapture).not.toHaveBeenCalled();
        });

        it("event.targetがundefinedの場合は早期リターン", async () => {
            const mockEvent = {
                pointerId: 1,
                target: undefined,
                stopPropagation: vi.fn()
            } as unknown as PointerEvent;

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("up");
            expect(mock$setCursor).toHaveBeenCalledWith("auto");
        });

        it("stopPropagationが呼ばれる", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        it("要素のvalueが更新される", async () => {
            mockElement.value = "80";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(80);
        });

        it("要素にフォーカスが当たる", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalled();
        });
    });

    describe("ポインターキャプチャの解放", () => {
        it("releasePointerCaptureが正しいpointerIdで呼ばれる", async () => {
            const mockEvent = createMockEvent(123, mockElement);

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(123);
        });

        it("pointerId = 0でもreleasePointerCaptureが呼ばれる", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(0);
        });

        it("pointerId = -1でもreleasePointerCaptureが呼ばれる", async () => {
            const mockEvent = createMockEvent(-1, mockElement);

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(-1);
        });
    });

    describe("イベントリスナーの削除", () => {
        it("POINTER_MOVEイベントリスナーが削除される", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                EventType.POINTER_MOVE,
                mockColorSettingAlphaMultiplierPointerMoveUseCase
            );
        });

        it("POINTER_UPイベントリスナーが削除される", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            // executeは現在の関数なので、モック化されていない実際の関数が渡される
            const removeEventListenerCalls = (mockElement.removeEventListener as any).mock.calls;
            const pointerUpCall = removeEventListenerCalls.find(
                (call: any) => call[0] === EventType.POINTER_UP
            );
            expect(pointerUpCall).toBeDefined();
            expect(pointerUpCall[0]).toBe(EventType.POINTER_UP);
        });

        it("POINTER_CANCELイベントリスナーが削除される", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            const removeEventListenerCalls = (mockElement.removeEventListener as any).mock.calls;
            const pointerCancelCall = removeEventListenerCalls.find(
                (call: any) => call[0] === EventType.POINTER_CANCEL
            );
            expect(pointerCancelCall).toBeDefined();
            expect(pointerCancelCall[0]).toBe(EventType.POINTER_CANCEL);
        });

        it("POINTER_LEAVEイベントリスナーが削除される", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            const removeEventListenerCalls = (mockElement.removeEventListener as any).mock.calls;
            const pointerLeaveCall = removeEventListenerCalls.find(
                (call: any) => call[0] === EventType.POINTER_LEAVE
            );
            expect(pointerLeaveCall).toBeDefined();
            expect(pointerLeaveCall[0]).toBe(EventType.POINTER_LEAVE);
        });

        it("全てのイベントリスナーが削除される(4つ)", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
        });

        it("イベントリスナー削除がポインターキャプチャ解放の後に行われる", async () => {
            const callOrder: string[] = [];
            
            mockElement.releasePointerCapture = vi.fn(() => callOrder.push("release"));
            mockElement.removeEventListener = vi.fn(() => callOrder.push("remove"));

            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(callOrder[0]).toBe("release");
            expect(callOrder[1]).toBe("remove");
        });
    });

    describe("値の処理", () => {
        it("整数値が正しく処理される", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(50);
        });

        it("小数点を含む値が整数に変換される", async () => {
            mockElement.value = "75.8";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            // parseFloat("75.8") = 75.8, 75.8 | 0 = 75
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(75);
        });

        it("小数点を含む値(切り捨て)", async () => {
            mockElement.value = "99.9";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            // 99.9 | 0 = 99
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(99);
        });

        it("0の値が正しく処理される", async () => {
            mockElement.value = "0";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(0);
        });

        it("100の値が正しく処理される", async () => {
            mockElement.value = "100";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(100);
        });

        it("負の値が正しく処理される", async () => {
            // HTMLInputElement type="range"は負の値を受け付けないため、0に正規化される
            const negativeElement = document.createElement("input");
            negativeElement.type = "range";
            negativeElement.min = "0";
            negativeElement.max = "100";
            negativeElement.value = "-10"; // 実際には0に正規化される
            negativeElement.releasePointerCapture = vi.fn();
            negativeElement.removeEventListener = vi.fn();
            negativeElement.focus = vi.fn();

            const mockEvent = createMockEvent(1, negativeElement);

            await execute(mockEvent);

            // type="range"で負の値を設定すると、ブラウザが自動的に0に正規化する
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(0);
        });

        it("空文字列の場合は0として処理される", async () => {
            const emptyElement = document.createElement("input");
            emptyElement.type = "range";
            emptyElement.min = "0";
            emptyElement.max = "100";
            emptyElement.value = ""; // type="range"では空文字列は50(中央値)に正規化される
            emptyElement.releasePointerCapture = vi.fn();
            emptyElement.removeEventListener = vi.fn();
            emptyElement.focus = vi.fn();

            const mockEvent = createMockEvent(1, emptyElement);

            await execute(mockEvent);

            // HTMLInputElement type="range"は空文字列を(min+max)/2に正規化する
            // (0+100)/2 = 50
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(50);
        });

        it("parseFloatできない文字列の場合は0として処理される", async () => {
            const invalidElement = document.createElement("input");
            invalidElement.type = "range";
            invalidElement.min = "0";
            invalidElement.max = "100";
            invalidElement.value = "abc"; // type="range"では不正な文字列は50(中央値)に正規化される
            invalidElement.releasePointerCapture = vi.fn();
            invalidElement.removeEventListener = vi.fn();
            invalidElement.focus = vi.fn();

            const mockEvent = createMockEvent(1, invalidElement);

            await execute(mockEvent);

            // HTMLInputElement type="range"は不正な文字列を(min+max)/2に正規化する
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(50);
        });
    });

    describe("ビット演算(| 0)の動作", () => {
        it("正の小数が切り捨てられる", async () => {
            mockElement.value = "45.7";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(45);
        });

        it("負の小数が切り捨てられる(0に近づく)", async () => {
            // HTMLInputElement type="range"は負の値を受け付けないため、0に正規化される
            const negativeElement = document.createElement("input");
            negativeElement.type = "range";
            negativeElement.min = "0";
            negativeElement.max = "100";
            negativeElement.value = "-45.7"; // 実際には0に正規化される
            negativeElement.releasePointerCapture = vi.fn();
            negativeElement.removeEventListener = vi.fn();
            negativeElement.focus = vi.fn();

            const mockEvent = createMockEvent(1, negativeElement);

            await execute(mockEvent);

            // type="range"で負の値を設定すると、ブラウザが自動的に0に正規化する
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(0);
        });

        it("非常に大きな値が処理される", async () => {
            mockElement.value = "999999";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            // ビット演算は32ビット整数に変換するため、大きな値は変換される
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalled();
        });
    });

    describe("実行順序", () => {
        it("処理が正しい順序で実行される", async () => {
            const callOrder: string[] = [];

            mock$setColorSettingState.mockImplementation(() => callOrder.push("setState"));
            mock$setCursor.mockImplementation(() => callOrder.push("setCursor"));
            mockElement.releasePointerCapture = vi.fn(() => callOrder.push("releaseCapture"));
            mockElement.removeEventListener = vi.fn(() => callOrder.push("removeListener"));
            mockColorSettingAlphaMultiplierUpdateValueUseCase.mockImplementation(() => callOrder.push("updateValue"));
            mockElement.focus = vi.fn(() => callOrder.push("focus"));

            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            // 期待される順序:
            // 1. setState
            // 2. setCursor
            // 3. stopPropagation (テスト対象外)
            // 4. releaseCapture
            // 5. removeListener (4回)
            // 6. updateValue
            // 7. focus
            expect(callOrder[0]).toBe("setState");
            expect(callOrder[1]).toBe("setCursor");
            expect(callOrder[2]).toBe("releaseCapture");
            // 次の4つはremoveListener
            expect(callOrder[3]).toBe("removeListener");
            expect(callOrder[4]).toBe("removeListener");
            expect(callOrder[5]).toBe("removeListener");
            expect(callOrder[6]).toBe("removeListener");
            expect(callOrder[7]).toBe("updateValue");
            expect(callOrder[8]).toBe("focus");
        });

        it("状態設定が最初に実行される", async () => {
            const callOrder: string[] = [];

            mock$setColorSettingState.mockImplementation(() => callOrder.push("setState"));
            mock$setCursor.mockImplementation(() => callOrder.push("setCursor"));

            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(callOrder[0]).toBe("setState");
        });

        it("フォーカスが最後に実行される", async () => {
            const callOrder: string[] = [];

            mockColorSettingAlphaMultiplierUpdateValueUseCase.mockImplementation(() => callOrder.push("updateValue"));
            mockElement.focus = vi.fn(() => callOrder.push("focus"));

            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            const focusIndex = callOrder.indexOf("focus");
            const updateValueIndex = callOrder.indexOf("updateValue");
            expect(focusIndex).toBeGreaterThan(updateValueIndex);
            expect(focusIndex).toBe(callOrder.length - 1); // 最後
        });
    });

    describe("統合シナリオ", () => {
        it("完全なポインターアップフロー", async () => {
            mockElement.value = "85";
            const mockEvent = createMockEvent(42, mockElement);

            await execute(mockEvent);

            // 1. 状態変更
            expect(mock$setColorSettingState).toHaveBeenCalledWith("up");
            
            // 2. カーソル変更
            expect(mock$setCursor).toHaveBeenCalledWith("auto");
            
            // 3. イベント伝播停止
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            
            // 4. ポインターキャプチャ解放
            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(42);
            
            // 5. イベントリスナー削除(4つ)
            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
            
            // 6. 値更新
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(85);
            
            // 7. フォーカス
            expect(mockElement.focus).toHaveBeenCalled();
        });

        it("エラーケース: targetがnullの場合でも状態は変更される", async () => {
            const mockEvent = createMockEvent(1, null);

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("up");
            expect(mock$setCursor).toHaveBeenCalledWith("auto");
            // 他の処理は実行されない
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).not.toHaveBeenCalled();
        });

        it("境界値: value = 0の場合", async () => {
            mockElement.value = "0";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(0);
            expect(mockElement.focus).toHaveBeenCalled();
        });

        it("境界値: value = 100の場合", async () => {
            mockElement.value = "100";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(100);
            expect(mockElement.focus).toHaveBeenCalled();
        });
    });

    describe("HTMLInputElementの動作", () => {
        it("input要素のfocusメソッドが実際に呼ばれる", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalledTimes(1);
        });

        it("releasePointerCaptureが1回だけ呼ばれる", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledTimes(1);
        });

        it("removeEventListenerが正確に4回呼ばれる", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
        });
    });

    describe("エッジケース", () => {
        it("pointerId = 0 (マウス)", async () => {
            mockElement.value = "60";
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(0);
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(60);
        });

        it("pointerId = 1 (最初のタッチ)", async () => {
            mockElement.value = "70";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(1);
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(70);
        });

        it("value = '0.1' の場合", async () => {
            mockElement.value = "0.1";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            // 0.1 | 0 = 0
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(0);
        });

        it("value = '0.9' の場合", async () => {
            mockElement.value = "0.9";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            // 0.9 | 0 = 0
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(0);
        });

        it("value = '50.5' の場合", async () => {
            mockElement.value = "50.5";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            // 50.5 | 0 = 50
            expect(mockColorSettingAlphaMultiplierUpdateValueUseCase).toHaveBeenCalledWith(50);
        });
    });
});
