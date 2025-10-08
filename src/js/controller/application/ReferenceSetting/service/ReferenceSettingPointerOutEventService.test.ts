import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ReferenceSettingPointerOutEventService";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";

// $useKeyboardをモック化
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $useKeyboard: vi.fn()
}));

describe("ReferenceSettingPointerOutEventService", () => {

    let mockEvent: PointerEvent;
    let mockElement: HTMLElement;

    beforeEach(() => {
        // モックをクリア
        vi.clearAllMocks();

        // HTMLElementをモック作成
        mockElement = document.createElement("div");
        mockElement.style.cursor = "";

        // PointerEventをモック作成
        mockEvent = new PointerEvent("pointerout", {
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

        test("キーボード未使用時にカーソルがデフォルト（空文字）に戻る", () => {
            ($useKeyboard as any).mockReturnValue(false);
            // 事前にカーソルを設定
            mockElement.style.cursor = "ew-resize";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        test("イベントの伝播が停止される", () => {
            ($useKeyboard as any).mockReturnValue(false);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        test("既存のカーソルスタイルがクリアされる", () => {
            ($useKeyboard as any).mockReturnValue(false);
            mockElement.style.cursor = "pointer";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        test("複雑なカーソル値もクリアされる", () => {
            ($useKeyboard as any).mockReturnValue(false);
            mockElement.style.cursor = "url(custom-cursor.png), auto";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

    });

    describe("キーボード使用中の動作", () => {

        test("キーボード使用中は何もしない", () => {
            ($useKeyboard as any).mockReturnValue(true);
            mockElement.style.cursor = "ew-resize";
            const originalCursor = mockElement.style.cursor;

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe(originalCursor);
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        test("キーボード使用中はstopPropagationが呼ばれない", () => {
            ($useKeyboard as any).mockReturnValue(true);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        test("キーボード使用中はカーソルの変更が一切行われない", () => {
            ($useKeyboard as any).mockReturnValue(true);
            mockElement.style.cursor = "move";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("move");
        });

    });

    describe("異常系", () => {

        test("イベントターゲットがnullの場合、何もしない", () => {
            ($useKeyboard as any).mockReturnValue(false);
            Object.defineProperty(mockEvent, "target", {
                value: null,
                writable: true,
                configurable: true
            });

            expect(() => execute(mockEvent)).not.toThrow();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        test("イベントターゲットがundefinedの場合、何もしない", () => {
            ($useKeyboard as any).mockReturnValue(false);
            Object.defineProperty(mockEvent, "target", {
                value: undefined,
                writable: true,
                configurable: true
            });

            expect(() => execute(mockEvent)).not.toThrow();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        test("イベントターゲットがHTMLElementでない場合、エラーが発生する可能性がある", () => {
            ($useKeyboard as any).mockReturnValue(false);
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

        test("カーソルスタイルが空文字に設定される", () => {
            ($useKeyboard as any).mockReturnValue(false);
            mockElement.style.cursor = "ew-resize";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        test("他のスタイルプロパティは変更されない", () => {
            ($useKeyboard as any).mockReturnValue(false);
            mockElement.style.backgroundColor = "red";
            mockElement.style.width = "100px";
            mockElement.style.cursor = "ew-resize";

            execute(mockEvent);

            expect(mockElement.style.backgroundColor).toBe("red");
            expect(mockElement.style.width).toBe("100px");
            expect(mockElement.style.cursor).toBe("");
        });

        test("カーソルが既に空文字の場合も安全に動作する", () => {
            ($useKeyboard as any).mockReturnValue(false);
            mockElement.style.cursor = "";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

    });

    describe("イベント処理の検証", () => {

        test("stopPropagationが正確に1回呼ばれる", () => {
            ($useKeyboard as any).mockReturnValue(false);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        test("複数回実行してもstopPropagationが毎回呼ばれる", () => {
            ($useKeyboard as any).mockReturnValue(false);

            execute(mockEvent);
            execute(mockEvent);
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(3);
        });

    });

    describe("様々な要素での動作確認", () => {

        test("div要素で正しく動作する", () => {
            ($useKeyboard as any).mockReturnValue(false);
            const divElement = document.createElement("div");
            divElement.style.cursor = "pointer";
            Object.defineProperty(mockEvent, "target", {
                value: divElement,
                writable: true,
                configurable: true
            });

            execute(mockEvent);

            expect(divElement.style.cursor).toBe("");
        });

        test("span要素で正しく動作する", () => {
            ($useKeyboard as any).mockReturnValue(false);
            const spanElement = document.createElement("span");
            spanElement.style.cursor = "text";
            Object.defineProperty(mockEvent, "target", {
                value: spanElement,
                writable: true,
                configurable: true
            });

            execute(mockEvent);

            expect(spanElement.style.cursor).toBe("");
        });

        test("button要素で正しく動作する", () => {
            ($useKeyboard as any).mockReturnValue(false);
            const buttonElement = document.createElement("button");
            buttonElement.style.cursor = "pointer";
            Object.defineProperty(mockEvent, "target", {
                value: buttonElement,
                writable: true,
                configurable: true
            });

            execute(mockEvent);

            expect(buttonElement.style.cursor).toBe("");
        });

    });

    describe("PointerOverEventServiceとの連携テスト", () => {

        test("ew-resizeカーソルが正しくクリアされる", () => {
            ($useKeyboard as any).mockReturnValue(false);
            // PointerOverEventServiceで設定されるであろうカーソル
            mockElement.style.cursor = "ew-resize";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        test("over->outの一連の流れをシミュレート", () => {
            ($useKeyboard as any).mockReturnValue(false);
            
            // 初期状態
            expect(mockElement.style.cursor).toBe("");
            
            // PointerOver相当の処理
            mockElement.style.cursor = "ew-resize";
            expect(mockElement.style.cursor).toBe("ew-resize");
            
            // PointerOut処理
            execute(mockEvent);
            expect(mockElement.style.cursor).toBe("");
        });

    });

    describe("条件分岐の完全テスト", () => {

        test("$useKeyboard()がfalseの場合の完全なフロー", () => {
            ($useKeyboard as any).mockReturnValue(false);
            mockElement.style.cursor = "ew-resize";

            execute(mockEvent);

            // 全ての処理が実行される
            expect(($useKeyboard as any)).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockElement.style.cursor).toBe("");
        });

        test("$useKeyboard()がtrueの場合の早期リターン", () => {
            ($useKeyboard as any).mockReturnValue(true);
            mockElement.style.cursor = "ew-resize";

            execute(mockEvent);

            // 早期リターンにより後続の処理は実行されない
            expect(($useKeyboard as any)).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockElement.style.cursor).toBe("ew-resize"); // 変更されない
        });

    });

    describe("カーソルリセットの詳細検証", () => {

        test("様々なカーソル値が空文字にリセットされる", () => {
            ($useKeyboard as any).mockReturnValue(false);
            
            const cursorValues = [
                "pointer",
                "text",
                "move",
                "ew-resize",
                "ns-resize",
                "nw-resize",
                "crosshair",
                "wait",
                "not-allowed"
            ];

            cursorValues.forEach(cursor => {
                mockElement.style.cursor = cursor;
                execute(mockEvent);
                expect(mockElement.style.cursor).toBe("");
            });
        });

        test("連続実行でも安定して空文字が維持される", () => {
            ($useKeyboard as any).mockReturnValue(false);
            mockElement.style.cursor = "ew-resize";

            execute(mockEvent);
            const firstResult = mockElement.style.cursor;

            execute(mockEvent);
            const secondResult = mockElement.style.cursor;

            expect(firstResult).toBe("");
            expect(secondResult).toBe("");
            expect(firstResult).toBe(secondResult);
        });

    });

});