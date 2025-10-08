import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

// モックの設定（vi.hoistedを使用してhoistingの問題を解決）
const {
    mockUpdateKeyLock,
    mockGetCurrentWorkSpace,
    mockSetEditingElement,
    mockReferenceSetting
} = vi.hoisted(() => {
    return {
        mockUpdateKeyLock: vi.fn(),
        mockGetCurrentWorkSpace: vi.fn(),
        mockSetEditingElement: vi.fn(),
        mockReferenceSetting: {
            y: 100,
            beforeY: 0,
            movementY: 0
        }
    };
});

vi.mock("@/shortcut/ShortcutUtil", () => ({
    $updateKeyLock: mockUpdateKeyLock
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/global/GlobalUtil", () => ({
    $setEditingElement: mockSetEditingElement
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: mockReferenceSetting
}));

import { execute } from "./ReferenceSettingYFocusInEventService";

describe("ReferenceSettingYFocusInEventService", () => {

    let mockEvent: FocusEvent;
    let mockInputElement: HTMLInputElement;
    let mockWorkSpace: any;
    let mockMovieClip: any;

    beforeEach(() => {
        // モックをクリア
        vi.clearAllMocks();

        // mockReferenceSettingのリセット
        mockReferenceSetting.y = 100;
        mockReferenceSetting.beforeY = 0;
        mockReferenceSetting.movementY = 0;

        // HTMLInputElementをモック作成
        mockInputElement = document.createElement("input");
        mockInputElement.type = "text";
        mockInputElement.style.cursor = "text";
        mockInputElement.value = "50";

        // MovieClipのモック作成
        mockMovieClip = {
            selectedDepths: new Set([1, 2, 3])
        };

        // WorkSpaceのモック作成
        mockWorkSpace = {
            scene: mockMovieClip
        };

        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        // FocusEventをモック作成
        mockEvent = new FocusEvent("focusin", {
            bubbles: true,
            cancelable: true
        });

        // event.currentTargetをモック
        Object.defineProperty(mockEvent, "currentTarget", {
            value: mockInputElement,
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
        vi.clearAllMocks();
        // 要素のスタイルをリセット
        if (mockInputElement) {
            mockInputElement.style.cursor = "";
            mockInputElement.value = "";
        }
    });

    describe("正常系", () => {

        test("フォーカスイベントが正しく処理される", () => {
            execute(mockEvent);

            // カーソルがリセットされる
            expect(mockInputElement.style.cursor).toBe("");
            // イベントの伝播が停止される
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            // キーボードロックがONになる
            expect(mockUpdateKeyLock).toHaveBeenCalledWith(true);
            // 編集中の要素が設定される
            expect(mockSetEditingElement).toHaveBeenCalledWith(mockInputElement);
        });

        test("選択されたオブジェクトがある場合、element.valueから値が保存される", () => {
            mockInputElement.value = "125.5";
            mockMovieClip.selectedDepths = new Set([5, 10]);

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(125.5);
            expect(mockReferenceSetting.movementY).toBe(0);
        });

        test("element.valueが整数の場合も正しく保存される", () => {
            mockInputElement.value = "200";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(200);
            expect(mockReferenceSetting.movementY).toBe(0);
        });

        test("element.valueが負の値でも正しく保存される", () => {
            mockInputElement.value = "-75.25";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(-75.25);
            expect(mockReferenceSetting.movementY).toBe(0);
        });

        test("element.valueが0でも正しく保存される", () => {
            mockInputElement.value = "0";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(0);
            expect(mockReferenceSetting.movementY).toBe(0);
        });

    });

    describe("parseFloatの動作確認", () => {

        test("小数点を含む文字列が正しく解析される", () => {
            const testCases = [
                { input: "123.456", expected: 123.456 },
                { input: "-456.789", expected: -456.789 },
                { input: "0.001", expected: 0.001 },
                { input: "999.999", expected: 999.999 }
            ];

            testCases.forEach(({ input, expected }) => {
                mockInputElement.value = input;
                mockMovieClip.selectedDepths = new Set([1]);

                execute(mockEvent);

                expect(mockReferenceSetting.beforeY).toBe(expected);
            });
        });

        test("文字列の先頭に数値がある場合、数値部分のみ解析される", () => {
            mockInputElement.value = "123.45abc";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(123.45);
        });

        test("数値でない文字列の場合、NaNが設定される", () => {
            mockInputElement.value = "abc123";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(isNaN(mockReferenceSetting.beforeY)).toBe(true);
        });

        test("空文字列の場合、NaNが設定される", () => {
            mockInputElement.value = "";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(isNaN(mockReferenceSetting.beforeY)).toBe(true);
        });

        test("空白文字のみの場合、NaNが設定される", () => {
            mockInputElement.value = "   ";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(isNaN(mockReferenceSetting.beforeY)).toBe(true);
        });

    });

    describe("選択されたオブジェクトがない場合", () => {

        test("selectedDepthsが空の場合、値の保存は行われない", () => {
            mockInputElement.value = "300";
            mockReferenceSetting.beforeY = 100;
            mockReferenceSetting.movementY = 50;
            
            mockMovieClip.selectedDepths = new Set();

            execute(mockEvent);

            // 基本的な処理は実行される
            expect(mockInputElement.style.cursor).toBe("");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockUpdateKeyLock).toHaveBeenCalledWith(true);
            expect(mockSetEditingElement).toHaveBeenCalledWith(mockInputElement);

            // 値の保存は行われない（既存の値が保持される）
            expect(mockReferenceSetting.beforeY).toBe(100);
            expect(mockReferenceSetting.movementY).toBe(50);
        });

        test("selectedDepthsのsizeが0の場合、早期リターンする", () => {
            mockMovieClip.selectedDepths = new Set();
            const originalBeforeY = mockReferenceSetting.beforeY;
            const originalMovementY = mockReferenceSetting.movementY;

            execute(mockEvent);

            // 基本処理は実行されるが、値の更新は行われない
            expect(mockReferenceSetting.beforeY).toBe(originalBeforeY);
            expect(mockReferenceSetting.movementY).toBe(originalMovementY);
        });

    });

    describe("異常系", () => {

        test("event.currentTargetがnullの場合、早期リターンする", () => {
            Object.defineProperty(mockEvent, "currentTarget", {
                value: null,
                writable: true,
                configurable: true
            });

            expect(() => execute(mockEvent)).not.toThrow();

            // 後続の処理は実行されない
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockUpdateKeyLock).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
        });

        test("event.currentTargetがundefinedの場合、早期リターンする", () => {
            Object.defineProperty(mockEvent, "currentTarget", {
                value: undefined,
                writable: true,
                configurable: true
            });

            expect(() => execute(mockEvent)).not.toThrow();

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockUpdateKeyLock).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
        });

        test("event.currentTargetがHTMLInputElementでない場合でも型キャストで動作する", () => {
            const divElement = document.createElement("div");
            divElement.style.cursor = "pointer";
            // divElementにvalueプロパティを追加（型キャスト対応）
            Object.defineProperty(divElement, "value", {
                value: "150",
                writable: true,
                configurable: true
            });
            
            Object.defineProperty(mockEvent, "currentTarget", {
                value: divElement,
                writable: true,
                configurable: true
            });

            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            // 型キャストにより動作する
            expect(divElement.style.cursor).toBe("");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockUpdateKeyLock).toHaveBeenCalledWith(true);
            expect(mockSetEditingElement).toHaveBeenCalledWith(divElement);
            expect(mockReferenceSetting.beforeY).toBe(150);
        });

    });

    describe("DOM操作の検証", () => {

        test("要素のカーソルが空文字に設定される", () => {
            mockInputElement.style.cursor = "text";

            execute(mockEvent);

            expect(mockInputElement.style.cursor).toBe("");
        });

        test("カーソルが既に空文字の場合でも安全に動作する", () => {
            mockInputElement.style.cursor = "";

            execute(mockEvent);

            expect(mockInputElement.style.cursor).toBe("");
        });

        test("他のスタイルプロパティは変更されない", () => {
            mockInputElement.style.backgroundColor = "blue";
            mockInputElement.style.height = "50px";
            mockInputElement.style.cursor = "crosshair";

            execute(mockEvent);

            expect(mockInputElement.style.backgroundColor).toBe("blue");
            expect(mockInputElement.style.height).toBe("50px");
            expect(mockInputElement.style.cursor).toBe("");
        });

    });

    describe("イベント処理の検証", () => {

        test("stopPropagationが1回呼ばれる", () => {
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        test("複数回実行してもstopPropagationが毎回呼ばれる", () => {
            execute(mockEvent);
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(2);
        });

    });

    describe("外部関数の呼び出し確認", () => {

        test("$updateKeyLockがtrueで呼ばれる", () => {
            execute(mockEvent);

            expect(mockUpdateKeyLock).toHaveBeenCalledWith(true);
            expect(mockUpdateKeyLock).toHaveBeenCalledTimes(1);
        });

        test("$setEditingElementが正しい要素で呼ばれる", () => {
            execute(mockEvent);

            expect(mockSetEditingElement).toHaveBeenCalledWith(mockInputElement);
            expect(mockSetEditingElement).toHaveBeenCalledTimes(1);
        });

        test("$getCurrentWorkSpaceが呼ばれる", () => {
            execute(mockEvent);

            expect(mockGetCurrentWorkSpace).toHaveBeenCalledTimes(1);
        });

    });

    describe("referenceSettingの状態変更確認", () => {

        test("beforeYにparseFloat(element.value)の値が設定される", () => {
            const testValues = ["0", "50.5", "-25.75", "100", "999.999"];

            testValues.forEach(value => {
                mockInputElement.value = value;
                mockMovieClip.selectedDepths = new Set([1]);

                execute(mockEvent);

                expect(mockReferenceSetting.beforeY).toBe(parseFloat(value));
            });
        });

        test("movementYが0にリセットされる", () => {
            mockReferenceSetting.movementY = 555;
            mockInputElement.value = "123";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(mockReferenceSetting.movementY).toBe(0);
        });

        test("選択されたオブジェクトがない場合、referenceSettingの値は変更されない", () => {
            const originalY = mockReferenceSetting.y = 111;
            const originalBeforeY = mockReferenceSetting.beforeY = 222;
            const originalMovementY = mockReferenceSetting.movementY = 333;

            mockInputElement.value = "999";
            mockMovieClip.selectedDepths = new Set();

            execute(mockEvent);

            expect(mockReferenceSetting.y).toBe(originalY);
            expect(mockReferenceSetting.beforeY).toBe(originalBeforeY);
            expect(mockReferenceSetting.movementY).toBe(originalMovementY);
        });

    });

    describe("XサービスとYサービスの違いの確認", () => {

        test("beforeYはelement.valueから設定される（XサービスのようにreferenceSettingのyは使用しない）", () => {
            mockReferenceSetting.y = 999;
            mockInputElement.value = "123";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            // beforeYはelement.valueから設定される
            expect(mockReferenceSetting.beforeY).toBe(123);
            // referenceSettingのyは関係ない
            expect(mockReferenceSetting.beforeY).not.toBe(999);
        });

    });

    describe("処理順序の確認", () => {

        test("処理が正しい順序で実行される", () => {
            const callOrder: string[] = [];

            mockUpdateKeyLock.mockImplementation(() => callOrder.push("updateKeyLock"));
            mockSetEditingElement.mockImplementation(() => callOrder.push("setEditingElement"));
            mockGetCurrentWorkSpace.mockImplementation(() => {
                callOrder.push("getCurrentWorkSpace");
                return mockWorkSpace;
            });

            // stopPropagationの呼び出しを記録
            const originalStopPropagation = mockEvent.stopPropagation;
            mockEvent.stopPropagation = vi.fn(() => callOrder.push("stopPropagation"));

            execute(mockEvent);

            expect(callOrder).toEqual([
                "stopPropagation",
                "updateKeyLock",
                "setEditingElement",
                "getCurrentWorkSpace"
            ]);
        });

    });

});