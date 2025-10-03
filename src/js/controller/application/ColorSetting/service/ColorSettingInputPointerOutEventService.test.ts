import { describe, it, expect, beforeEach, vi } from "vitest";

// モック関数の定義
const mock$useKeyboard = vi.fn();

// vi.mockの呼び出し
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $useKeyboard: () => mock$useKeyboard()
}));

// 動的インポート
const { execute } = await import("./ColorSettingInputPointerOutEventService");

describe("ColorSettingInputPointerOutEventService", () => {
    let mockElement: HTMLElement;

    const createMockEvent = (target: HTMLElement | null = null): PointerEvent => {
        return {
            target: target,
            stopPropagation: vi.fn()
        } as unknown as PointerEvent;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // モックHTML要素を作成
        mockElement = document.createElement("div");
        mockElement.style.cursor = "pointer";

        // デフォルトではキーボードを使用していない
        mock$useKeyboard.mockReturnValue(false);
    });

    describe("基本動作", () => {
        it("要素のカーソルスタイルが空文字列にリセットされる", () => {
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("stopPropagationが呼ばれる", () => {
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("要素のカーソルスタイルが設定されている場合にリセットされる", () => {
            mockElement.style.cursor = "move";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("カーソルスタイルが既に空の場合でも正常に動作する", () => {
            mockElement.style.cursor = "";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });
    });

    describe("早期リターン条件", () => {
        it("キーボード使用中($useKeyboard=true)の場合は何もしない", () => {
            mock$useKeyboard.mockReturnValue(true);
            const mockEvent = createMockEvent(mockElement);
            mockElement.style.cursor = "pointer";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("pointer"); // 変更されない
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("event.targetがnullの場合は何もしない", () => {
            const mockEvent = createMockEvent(null);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        it("event.targetがundefinedの場合は何もしない", () => {
            const mockEvent = {
                target: undefined,
                stopPropagation: vi.fn()
            } as unknown as PointerEvent;

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });
    });

    describe("イベント処理", () => {
        it("stopPropagationが確実に呼ばれる", () => {
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("キーボード使用中でもstopPropagationは呼ばれない", () => {
            mock$useKeyboard.mockReturnValue(true);
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("カーソルスタイルのリセット", () => {
        it("様々なカーソルスタイルがリセットされる - pointer", () => {
            mockElement.style.cursor = "pointer";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("様々なカーソルスタイルがリセットされる - move", () => {
            mockElement.style.cursor = "move";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("様々なカーソルスタイルがリセットされる - grab", () => {
            mockElement.style.cursor = "grab";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("様々なカーソルスタイルがリセットされる - text", () => {
            mockElement.style.cursor = "text";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("様々なカーソルスタイルがリセットされる - crosshair", () => {
            mockElement.style.cursor = "crosshair";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });
    });

    describe("複数回実行", () => {
        it("同じ要素で複数回実行しても正常に動作する", () => {
            const mockEvent1 = createMockEvent(mockElement);
            mockElement.style.cursor = "pointer";

            execute(mockEvent1);
            expect(mockElement.style.cursor).toBe("");

            mockElement.style.cursor = "move";
            const mockEvent2 = createMockEvent(mockElement);

            execute(mockEvent2);
            expect(mockElement.style.cursor).toBe("");
        });

        it("stopPropagationが毎回呼ばれる", () => {
            const mockEvent1 = createMockEvent(mockElement);
            const mockEvent2 = createMockEvent(mockElement);

            execute(mockEvent1);
            execute(mockEvent2);

            expect(mockEvent1.stopPropagation).toHaveBeenCalledTimes(1);
            expect(mockEvent2.stopPropagation).toHaveBeenCalledTimes(1);
        });
    });

    describe("異なる要素タイプ", () => {
        it("div要素で正常に動作する", () => {
            const divElement = document.createElement("div");
            divElement.style.cursor = "pointer";
            const mockEvent = createMockEvent(divElement);

            execute(mockEvent);

            expect(divElement.style.cursor).toBe("");
        });

        it("input要素で正常に動作する", () => {
            const inputElement = document.createElement("input");
            inputElement.style.cursor = "text";
            const mockEvent = createMockEvent(inputElement);

            execute(mockEvent);

            expect(inputElement.style.cursor).toBe("");
        });

        it("button要素で正常に動作する", () => {
            const buttonElement = document.createElement("button");
            buttonElement.style.cursor = "pointer";
            const mockEvent = createMockEvent(buttonElement);

            execute(mockEvent);

            expect(buttonElement.style.cursor).toBe("");
        });

        it("span要素で正常に動作する", () => {
            const spanElement = document.createElement("span");
            spanElement.style.cursor = "move";
            const mockEvent = createMockEvent(spanElement);

            execute(mockEvent);

            expect(spanElement.style.cursor).toBe("");
        });
    });

    describe("統合シナリオ", () => {
        it("完全なフロー: キーボード未使用 → 要素あり → カーソルリセット", () => {
            mock$useKeyboard.mockReturnValue(false);
            mockElement.style.cursor = "pointer";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            // 1. キーボードチェック
            expect(mock$useKeyboard).toHaveBeenCalled();

            // 2. イベント処理
            expect(mockEvent.stopPropagation).toHaveBeenCalled();

            // 3. カーソルリセット
            expect(mockElement.style.cursor).toBe("");
        });

        it("エラーケース: キーボード使用中は何も変更されない", () => {
            mock$useKeyboard.mockReturnValue(true);
            mockElement.style.cursor = "move";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("move");
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("エラーケース: 要素なしでもstopPropagationは実行される", () => {
            const mockEvent = createMockEvent(null);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });
    });

    describe("$useKeyboard依存", () => {
        it("$useKeyboardがfalseの時は処理が実行される", () => {
            mock$useKeyboard.mockReturnValue(false);
            mockElement.style.cursor = "pointer";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mock$useKeyboard).toHaveBeenCalled();
            expect(mockElement.style.cursor).toBe("");
        });

        it("$useKeyboardがtrueの時は早期リターンする", () => {
            mock$useKeyboard.mockReturnValue(true);
            mockElement.style.cursor = "pointer";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mock$useKeyboard).toHaveBeenCalled();
            expect(mockElement.style.cursor).toBe("pointer");
        });

        it("$useKeyboardが複数回呼ばれても正しく動作する", () => {
            mock$useKeyboard.mockReturnValueOnce(false).mockReturnValueOnce(true);
            mockElement.style.cursor = "move";

            const mockEvent1 = createMockEvent(mockElement);
            execute(mockEvent1);
            expect(mockElement.style.cursor).toBe("");

            mockElement.style.cursor = "grab";
            const mockEvent2 = createMockEvent(mockElement);
            execute(mockEvent2);
            expect(mockElement.style.cursor).toBe("grab");
        });
    });

    describe("エッジケース", () => {
        it("カーソルスタイルが長い文字列の場合", () => {
            mockElement.style.cursor = "url(custom-cursor.png), auto";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("要素に他のスタイルがあってもカーソルのみリセットされる", () => {
            mockElement.style.cursor = "pointer";
            mockElement.style.backgroundColor = "red";
            mockElement.style.width = "100px";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
            expect(mockElement.style.backgroundColor).toBe("red");
            expect(mockElement.style.width).toBe("100px");
        });

        it("event.targetがHTMLElementではない場合の型変換", () => {
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            (svgElement as any).style = { cursor: "pointer" };
            const mockEvent = createMockEvent(svgElement as any);

            execute(mockEvent);

            expect((svgElement as any).style.cursor).toBe("");
        });
    });
});
