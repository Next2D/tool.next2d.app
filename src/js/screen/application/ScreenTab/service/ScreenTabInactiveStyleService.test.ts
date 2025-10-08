import { execute } from "./ScreenTabInactiveStyleService";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

// $updateKeyLockをモック
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $updateKeyLock: vi.fn()
}));

describe("ScreenTabInactiveStyleServiceTest", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("execute test", () =>
    {
        const textElement = document.createElement("div");
        textElement.contentEditable = "true";

        const tabElement = document.createElement("div");
        // JSDOM環境でも確実に設定される形式を使用
        tabElement.style.borderBottom = "1px solid red";
        tabElement.draggable = false;

        expect(tabElement.draggable).toBe(false);
        expect(textElement.contentEditable).toBe("true");

        execute(textElement, tabElement);

        expect(tabElement.draggable).toBe(true);
        expect(textElement.contentEditable).toBe("false");
        expect(tabElement.style.borderBottom).toBe("");
        expect($updateKeyLock).toHaveBeenCalledWith(false);
        expect($updateKeyLock).toHaveBeenCalledTimes(1);
    });

    it("contentEditableがfalseに変更される", () =>
    {
        const textElement = document.createElement("div");
        textElement.contentEditable = "true";

        const tabElement = document.createElement("div");
        tabElement.draggable = false;

        expect(textElement.contentEditable).toBe("true");

        execute(textElement, tabElement);

        expect(textElement.contentEditable).toBe("false");
    });

    it("borderBottomが空文字列にクリアされる", () =>
    {
        const textElement = document.createElement("div");
        const tabElement = document.createElement("div");
        tabElement.style.borderBottom = "2px solid red";

        expect(tabElement.style.borderBottom).toBeTruthy();

        execute(textElement, tabElement);

        expect(tabElement.style.borderBottom).toBe("");
    });

    it("draggableがtrueに設定される", () =>
    {
        const textElement = document.createElement("div");
        const tabElement = document.createElement("div");
        tabElement.draggable = false;

        expect(tabElement.draggable).toBe(false);

        execute(textElement, tabElement);

        expect(tabElement.draggable).toBe(true);
    });

    it("$updateKeyLockがfalseで呼ばれる", () =>
    {
        const textElement = document.createElement("div");
        const tabElement = document.createElement("div");

        execute(textElement, tabElement);

        expect($updateKeyLock).toHaveBeenCalledWith(false);
    });

    it("初期状態に関わらず非アクティブスタイルが適用される", () =>
    {
        const textElement = document.createElement("div");
        textElement.contentEditable = "false";

        const tabElement = document.createElement("div");
        tabElement.draggable = true;
        tabElement.style.borderBottom = "";

        execute(textElement, tabElement);

        // 既に非アクティブ状態でも正しく設定される
        expect(textElement.contentEditable).toBe("false");
        expect(tabElement.draggable).toBe(true);
        expect(tabElement.style.borderBottom).toBe("");
        expect($updateKeyLock).toHaveBeenCalledWith(false);
    });
});