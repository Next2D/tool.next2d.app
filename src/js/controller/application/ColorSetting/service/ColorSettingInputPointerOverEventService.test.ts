import { describe, it, expect, beforeEach, vi } from "vitest";

// モック関数の定義
const mock$useKeyboard = vi.fn();

// vi.mockの呼び出し
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $useKeyboard: () => mock$useKeyboard()
}));

// 動的インポート
const { execute } = await import("./ColorSettingInputPointerOverEventService");

describe("ColorSettingInputPointerOverEventService", () => {
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
        mockElement.style.cursor = "";

        // デフォルトではキーボードを使用していない
        mock$useKeyboard.mockReturnValue(false);
    });

    describe("基本動作", () => {
        it("要素のカーソルスタイルが'ew-resize'に設定される", () => {
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("stopPropagationが呼ばれる", () => {
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("カーソルスタイルが空文字列から'ew-resize'に変更される", () => {
            mockElement.style.cursor = "";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("既存のカーソルスタイルが'ew-resize'に上書きされる", () => {
            mockElement.style.cursor = "pointer";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
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

        it("event.targetがnullの場合はカーソル設定されない", () => {
            const mockEvent = createMockEvent(null);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        it("event.targetがundefinedの場合はカーソル設定されない", () => {
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

        it("キーボード使用中はstopPropagationが呼ばれない", () => {
            mock$useKeyboard.mockReturnValue(true);
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("要素がnullでもstopPropagationは実行される", () => {
            const mockEvent = createMockEvent(null);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });
    });

    describe("カーソルスタイルの設定", () => {
        it("様々な初期カーソルからew-resizeに変更される - pointer", () => {
            mockElement.style.cursor = "pointer";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("様々な初期カーソルからew-resizeに変更される - move", () => {
            mockElement.style.cursor = "move";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("様々な初期カーソルからew-resizeに変更される - grab", () => {
            mockElement.style.cursor = "grab";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("様々な初期カーソルからew-resizeに変更される - text", () => {
            mockElement.style.cursor = "text";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("様々な初期カーソルからew-resizeに変更される - default", () => {
            mockElement.style.cursor = "default";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("既にew-resizeの場合でも同じ値が設定される", () => {
            mockElement.style.cursor = "ew-resize";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });
    });

    describe("複数回実行", () => {
        it("同じ要素で複数回実行しても正常に動作する", () => {
            const mockEvent1 = createMockEvent(mockElement);
            mockElement.style.cursor = "pointer";

            execute(mockEvent1);
            expect(mockElement.style.cursor).toBe("ew-resize");

            mockElement.style.cursor = "move";
            const mockEvent2 = createMockEvent(mockElement);

            execute(mockEvent2);
            expect(mockElement.style.cursor).toBe("ew-resize");
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
            divElement.style.cursor = "";
            const mockEvent = createMockEvent(divElement);

            execute(mockEvent);

            expect(divElement.style.cursor).toBe("ew-resize");
        });

        it("input要素で正常に動作する", () => {
            const inputElement = document.createElement("input");
            inputElement.style.cursor = "";
            const mockEvent = createMockEvent(inputElement);

            execute(mockEvent);

            expect(inputElement.style.cursor).toBe("ew-resize");
        });

        it("button要素で正常に動作する", () => {
            const buttonElement = document.createElement("button");
            buttonElement.style.cursor = "";
            const mockEvent = createMockEvent(buttonElement);

            execute(mockEvent);

            expect(buttonElement.style.cursor).toBe("ew-resize");
        });

        it("span要素で正常に動作する", () => {
            const spanElement = document.createElement("span");
            spanElement.style.cursor = "";
            const mockEvent = createMockEvent(spanElement);

            execute(mockEvent);

            expect(spanElement.style.cursor).toBe("ew-resize");
        });
    });

    describe("統合シナリオ", () => {
        it("完全なフロー: キーボード未使用 → 要素あり → カーソル設定", () => {
            mock$useKeyboard.mockReturnValue(false);
            mockElement.style.cursor = "";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            // 1. キーボードチェック
            expect(mock$useKeyboard).toHaveBeenCalled();

            // 2. イベント処理
            expect(mockEvent.stopPropagation).toHaveBeenCalled();

            // 3. カーソル設定
            expect(mockElement.style.cursor).toBe("ew-resize");
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
            mockElement.style.cursor = "";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mock$useKeyboard).toHaveBeenCalled();
            expect(mockElement.style.cursor).toBe("ew-resize");
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
            mockElement.style.cursor = "";

            const mockEvent1 = createMockEvent(mockElement);
            execute(mockEvent1);
            expect(mockElement.style.cursor).toBe("ew-resize");

            mockElement.style.cursor = "grab";
            const mockEvent2 = createMockEvent(mockElement);
            execute(mockEvent2);
            expect(mockElement.style.cursor).toBe("grab");
        });
    });

    describe("エッジケース", () => {
        it("カーソルスタイルが長い文字列からew-resizeに変更される", () => {
            mockElement.style.cursor = "url(custom-cursor.png), auto";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("要素に他のスタイルがあってもカーソルのみ変更される", () => {
            mockElement.style.cursor = "pointer";
            mockElement.style.backgroundColor = "red";
            mockElement.style.width = "100px";
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
            expect(mockElement.style.backgroundColor).toBe("red");
            expect(mockElement.style.width).toBe("100px");
        });

        it("event.targetがHTMLElementではない場合の型変換", () => {
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            (svgElement as any).style = { cursor: "" };
            const mockEvent = createMockEvent(svgElement as any);

            execute(mockEvent);

            expect((svgElement as any).style.cursor).toBe("ew-resize");
        });
    });

    describe("ew-resizeカーソルの意味", () => {
        it("ew-resizeは東西方向のリサイズカーソルである", () => {
            const mockEvent = createMockEvent(mockElement);

            execute(mockEvent);

            // ew-resize = East-West resize (水平方向のリサイズ)
            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("ColorSetting入力フィールドでの水平調整を示唆する", () => {
            const inputElement = document.createElement("input");
            inputElement.type = "range";
            const mockEvent = createMockEvent(inputElement);

            execute(mockEvent);

            expect(inputElement.style.cursor).toBe("ew-resize");
        });
    });

    describe("PointerOverとPointerOutの対称性", () => {
        it("PointerOverでew-resizeが設定され、PointerOutで空文字列になることを想定", () => {
            // PointerOver
            const overEvent = createMockEvent(mockElement);
            execute(overEvent);
            expect(mockElement.style.cursor).toBe("ew-resize");

            // PointerOutでリセット（別サービスの動作）
            mockElement.style.cursor = "";
            expect(mockElement.style.cursor).toBe("");
        });
    });
});
