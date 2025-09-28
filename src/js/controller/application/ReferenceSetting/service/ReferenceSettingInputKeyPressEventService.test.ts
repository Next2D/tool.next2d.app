import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ReferenceSettingInputKeyPressEventService";

// モックの設定
vi.mock("@/global/GlobalUtil", () => ({
    $setCursor: vi.fn(),
    $setEditingElement: vi.fn()
}));

describe("ReferenceSettingInputKeyPressEventService", () => {

    let mockKeyboardEvent: KeyboardEvent;
    let mockSetCursor: any;
    let mockSetEditingElement: any;

    beforeEach(() => {
        // モックされた関数を設定
        mockSetCursor = vi.fn();
        mockSetEditingElement = vi.fn();
        
        // モックを適用
        vi.doMock("@/global/GlobalUtil", () => ({
            $setCursor: mockSetCursor,
            $setEditingElement: mockSetEditingElement
        }));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Enterキーが押された場合", () => {

        beforeEach(() => {
            // EnterキーのKeyboardEventを作成
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "Enter",
                bubbles: true,
                cancelable: true
            });

            // stopPropagationをモック
            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });
        });

        test("Enterキーでフォーカスが終了される", () => {
            execute(mockKeyboardEvent);

            // イベントの伝播が停止される
            expect(mockKeyboardEvent.stopPropagation).toHaveBeenCalled();
            // 編集中の要素がnullに設定される
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
            // カーソルがautoに設定される
            expect(mockSetCursor).toHaveBeenCalledWith("auto");
        });

        test("stopPropagationが1回呼ばれる", () => {
            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        test("$setEditingElementがnullで呼ばれる", () => {
            execute(mockKeyboardEvent);

            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
            expect(mockSetEditingElement).toHaveBeenCalledTimes(1);
        });

        test("$setCursorが'auto'で呼ばれる", () => {
            execute(mockKeyboardEvent);

            expect(mockSetCursor).toHaveBeenCalledWith("auto");
            expect(mockSetCursor).toHaveBeenCalledTimes(1);
        });

        test("処理が正しい順序で実行される", () => {
            const callOrder: string[] = [];

            mockSetEditingElement.mockImplementation(() => callOrder.push("setEditingElement"));
            mockSetCursor.mockImplementation(() => callOrder.push("setCursor"));

            // stopPropagationの呼び出しを記録
            mockKeyboardEvent.stopPropagation = vi.fn(() => callOrder.push("stopPropagation"));

            execute(mockKeyboardEvent);

            expect(callOrder).toEqual([
                "stopPropagation",
                "setEditingElement",
                "setCursor"
            ]);
        });

    });

    describe("Enter以外のキーが押された場合", () => {

        test("他のキーでは何も実行されない - 'a'キー", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "a",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockSetCursor).not.toHaveBeenCalled();
        });

        test("他のキーでは何も実行されない - 'Escape'キー", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "Escape",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockSetCursor).not.toHaveBeenCalled();
        });

        test("他のキーでは何も実行されない - 'Tab'キー", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "Tab",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockSetCursor).not.toHaveBeenCalled();
        });

        test("他のキーでは何も実行されない - 'Space'キー", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: " ",  // スペースキー
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockSetCursor).not.toHaveBeenCalled();
        });

        test("他のキーでは何も実行されない - 'ArrowUp'キー", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "ArrowUp",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockSetCursor).not.toHaveBeenCalled();
        });

        test("数字キーでは何も実行されない", () => {
            const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

            numberKeys.forEach(key => {
                mockKeyboardEvent = new KeyboardEvent("keypress", {
                    key: key,
                    bubbles: true,
                    cancelable: true
                });

                Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                    value: vi.fn(),
                    writable: true,
                    configurable: true
                });

                execute(mockKeyboardEvent);

                expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
                expect(mockSetEditingElement).not.toHaveBeenCalled();
                expect(mockSetCursor).not.toHaveBeenCalled();
            });
        });

    });

    describe("Enterキーの大文字小文字やバリエーション", () => {

        test("'Enter'（正確なキー名）で処理される", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "Enter",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).toHaveBeenCalled();
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
            expect(mockSetCursor).toHaveBeenCalledWith("auto");
        });

        test("'enter'（小文字）では処理されない", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "enter",  // 小文字
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockSetCursor).not.toHaveBeenCalled();
        });

        test("'ENTER'（大文字）では処理されない", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "ENTER",  // 大文字
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockSetCursor).not.toHaveBeenCalled();
        });

    });

    describe("早期リターンの動作確認", () => {

        test("Enter以外のキーでは早期リターンし、後続の処理は実行されない", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "z",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            // 何も実行されない
            expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockSetCursor).not.toHaveBeenCalled();
        });

        test("Enterキーでは早期リターンせず、全ての処理が実行される", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "Enter",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            // 全て実行される
            expect(mockKeyboardEvent.stopPropagation).toHaveBeenCalled();
            expect(mockSetEditingElement).toHaveBeenCalled();
            expect(mockSetCursor).toHaveBeenCalled();
        });

    });

    describe("複数回実行のテスト", () => {

        test("Enterキーを複数回押した場合、毎回処理が実行される", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "Enter",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            // 3回実行
            execute(mockKeyboardEvent);
            execute(mockKeyboardEvent);
            execute(mockKeyboardEvent);

            expect(mockKeyboardEvent.stopPropagation).toHaveBeenCalledTimes(3);
            expect(mockSetEditingElement).toHaveBeenCalledTimes(3);
            expect(mockSetCursor).toHaveBeenCalledTimes(3);
        });

    });

    describe("関数の引数確認", () => {

        test("$setEditingElementは必ずnullで呼ばれる", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "Enter",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
            // 他の値では呼ばれていないことを確認
            expect(mockSetEditingElement).not.toHaveBeenCalledWith(undefined);
            expect(mockSetEditingElement).not.toHaveBeenCalledWith("");
            expect(mockSetEditingElement).not.toHaveBeenCalledWith(0);
        });

        test("$setCursorは必ず'auto'で呼ばれる", () => {
            mockKeyboardEvent = new KeyboardEvent("keypress", {
                key: "Enter",
                bubbles: true,
                cancelable: true
            });

            Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                value: vi.fn(),
                writable: true,
                configurable: true
            });

            execute(mockKeyboardEvent);

            expect(mockSetCursor).toHaveBeenCalledWith("auto");
            // 他のカーソル値では呼ばれていないことを確認
            expect(mockSetCursor).not.toHaveBeenCalledWith("pointer");
            expect(mockSetCursor).not.toHaveBeenCalledWith("text");
            expect(mockSetCursor).not.toHaveBeenCalledWith("");
        });

    });

    describe("KeyboardEventのプロパティテスト", () => {

        test("event.keyプロパティが正確に評価される", () => {
            // 異なるKeyboardEventプロパティでテスト
            const testCases = [
                { key: "Enter", shouldExecute: true },
                { key: "Return", shouldExecute: false },
                { key: "\r", shouldExecute: false },
                { key: "\n", shouldExecute: false }
            ];

            testCases.forEach(({ key, shouldExecute }) => {
                mockKeyboardEvent = new KeyboardEvent("keypress", {
                    key: key,
                    bubbles: true,
                    cancelable: true
                });

                Object.defineProperty(mockKeyboardEvent, "stopPropagation", {
                    value: vi.fn(),
                    writable: true,
                    configurable: true
                });

                execute(mockKeyboardEvent);

                if (shouldExecute) {
                    expect(mockKeyboardEvent.stopPropagation).toHaveBeenCalled();
                    expect(mockSetEditingElement).toHaveBeenCalledWith(null);
                    expect(mockSetCursor).toHaveBeenCalledWith("auto");
                } else {
                    expect(mockKeyboardEvent.stopPropagation).not.toHaveBeenCalled();
                    expect(mockSetEditingElement).not.toHaveBeenCalled();
                    expect(mockSetCursor).not.toHaveBeenCalled();
                }

                // モックをリセット
                vi.clearAllMocks();
            });
        });

    });

});