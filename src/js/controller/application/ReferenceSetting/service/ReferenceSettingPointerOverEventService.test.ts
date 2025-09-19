import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ReferenceSettingPointerOverEventService";

// $useKeyboardをモック化
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $useKeyboard: vi.fn()
}));

describe("ReferenceSettingPointerOverEventService", () => {

    let mockEvent: PointerEvent;
    let mockElement: HTMLElement;
    let mockUseKeyboard: any;

    beforeEach(() => {
        // $useKeyboardのモック設定
        mockUseKeyboard = vi.fn();
        
        // モックされた関数を取得
        vi.doMock("@/shortcut/ShortcutUtil", () => ({
            $useKeyboard: mockUseKeyboard
        }));

        // HTMLElementをモック作成
        mockElement = document.createElement("div");
        mockElement.style.cursor = "";

        // PointerEventをモック作成
        mockEvent = new PointerEvent("pointerover", {
            bubbles: true,
            cancelable: true
        });

        // event.targetをモック
        Object.defineProperty(mockEvent, "target", {
            value: mockElement,
            writable: true,
            configurable: true
        });

        // stopPropagationをモック
        Object.defineProperty(mockEvent, "stopPropagation", {
            value: vi.fn(),
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // 要素のスタイルをリセット
        if (mockElement) {
            mockElement.style.cursor = "";
        }
    });

    describe("正常系", () => {

        test("キーボード未使用時にカーソルがew-resizeに設定される", () => {
            mockUseKeyboard.mockReturnValue(false);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        test("イベントの伝播が停止される", () => {
            mockUseKeyboard.mockReturnValue(false);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        test("既存のカーソルスタイルが上書きされる", () => {
            mockUseKeyboard.mockReturnValue(false);
            mockElement.style.cursor = "pointer";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

    });

    describe("キーボード使用中の動作", () => {

        test("キーボード使用中は何もしない", () => {
            mockUseKeyboard.mockReturnValue(true);
            const originalCursor = mockElement.style.cursor;

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe(originalCursor);
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        test("キーボード使用中はstopPropagationが呼ばれない", () => {
            mockUseKeyboard.mockReturnValue(true);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

    });

    describe("異常系", () => {

        test("イベントターゲットがnullの場合、何もしない", () => {
            mockUseKeyboard.mockReturnValue(false);
            Object.defineProperty(mockEvent, "target", {
                value: null,
                writable: true,
                configurable: true
            });

            expect(() => execute(mockEvent)).not.toThrow();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        test("イベントターゲットがundefinedの場合、何もしない", () => {
            mockUseKeyboard.mockReturnValue(false);
            Object.defineProperty(mockEvent, "target", {
                value: undefined,
                writable: true,
                configurable: true
            });

            expect(() => execute(mockEvent)).not.toThrow();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        test("イベントターゲットがHTMLElementでない場合、エラーが発生する可能性がある", () => {
            mockUseKeyboard.mockReturnValue(false);
            const textNode = document.createTextNode("test");
            Object.defineProperty(mockEvent, "target", {
                value: textNode,
                writable: true,
                configurable: true
            });

            // HTMLElementでないオブジェクトにstyle.cursorを設定しようとするとエラーになる可能性
            expect(() => execute(mockEvent)).toThrow();
        });

    });

    describe("DOM操作の検証", () => {

        test("カーソルスタイルが正確に設定される", () => {
            mockUseKeyboard.mockReturnValue(false);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        test("他のスタイルプロパティは変更されない", () => {
            mockUseKeyboard.mockReturnValue(false);
            mockElement.style.backgroundColor = "red";
            mockElement.style.width = "100px";

            execute(mockEvent);

            expect(mockElement.style.backgroundColor).toBe("red");
            expect(mockElement.style.width).toBe("100px");
            expect(mockElement.style.cursor).toBe("ew-resize");
        });

    });

    describe("イベント処理の検証", () => {

        test("stopPropagationが正確に1回呼ばれる", () => {
            mockUseKeyboard.mockReturnValue(false);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        test("複数回実行してもstopPropagationが毎回呼ばれる", () => {
            mockUseKeyboard.mockReturnValue(false);

            execute(mockEvent);
            execute(mockEvent);
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(3);
        });

    });

    describe("様々な要素での動作確認", () => {

        test("div要素で正しく動作する", () => {
            mockUseKeyboard.mockReturnValue(false);
            const divElement = document.createElement("div");
            Object.defineProperty(mockEvent, "target", {
                value: divElement,
                writable: true,
                configurable: true
            });

            execute(mockEvent);

            expect(divElement.style.cursor).toBe("ew-resize");
        });

        test("span要素で正しく動作する", () => {
            mockUseKeyboard.mockReturnValue(false);
            const spanElement = document.createElement("span");
            Object.defineProperty(mockEvent, "target", {
                value: spanElement,
                writable: true,
                configurable: true
            });

            execute(mockEvent);

            expect(spanElement.style.cursor).toBe("ew-resize");
        });

        test("input要素で正しく動作する", () => {
            mockUseKeyboard.mockReturnValue(false);
            const inputElement = document.createElement("input");
            Object.defineProperty(mockEvent, "target", {
                value: inputElement,
                writable: true,
                configurable: true
            });

            execute(mockEvent);

            expect(inputElement.style.cursor).toBe("ew-resize");
        });

    });

    describe("条件分岐の完全テスト", () => {

        test("$useKeyboard()がfalseの場合の完全なフロー", () => {
            mockUseKeyboard.mockReturnValue(false);

            execute(mockEvent);

            // 全ての処理が実行される
            expect(mockUseKeyboard).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        test("$useKeyboard()がtrueの場合の早期リターン", () => {
            mockUseKeyboard.mockReturnValue(true);

            execute(mockEvent);

            // 早期リターンにより後続の処理は実行されない
            expect(mockUseKeyboard).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockElement.style.cursor).not.toBe("ew-resize");
        });

    });

    describe("カーソル設定の詳細検証", () => {

        test("ew-resizeカーソルが正確に設定される", () => {
            mockUseKeyboard.mockReturnValue(false);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
            // ew-resizeは東西方向のリサイズカーソルを意味する
            expect(mockElement.style.cursor).toMatch(/ew-resize/);
        });

        test("連続実行でも同じカーソルが設定される", () => {
            mockUseKeyboard.mockReturnValue(false);

            execute(mockEvent);
            const firstCursor = mockElement.style.cursor;

            execute(mockEvent);
            const secondCursor = mockElement.style.cursor;

            expect(firstCursor).toBe(secondCursor);
            expect(secondCursor).toBe("ew-resize");
        });

    });

});