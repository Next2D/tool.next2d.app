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
            x: 100,
            beforeX: 0,
            movementX: 0
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

import { execute } from "./ReferenceSettingXFocusInEventService";

describe("ReferenceSettingXFocusInEventService", () => {

    let mockEvent: FocusEvent;
    let mockInputElement: HTMLInputElement;
    let mockWorkSpace: any;
    let mockMovieClip: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // mockReferenceSettingのリセット
        mockReferenceSetting.x = 100;
        mockReferenceSetting.beforeX = 0;
        mockReferenceSetting.movementX = 0;

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

        test("選択されたオブジェクトがある場合、変更前の値が保存される", () => {
            mockInputElement.value = "150";
            mockMovieClip.selectedDepths = new Set([5, 10]);

            execute(mockEvent);

            expect(mockReferenceSetting.beforeX).toBe(150);
            expect(mockReferenceSetting.movementX).toBe(0);
        });

        test("referenceSettingのxが負の値でも正しく保存される", () => {
            mockInputElement.value = "-75";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(mockReferenceSetting.beforeX).toBe(-75);
            expect(mockReferenceSetting.movementX).toBe(0);
        });

        test("referenceSettingのxが0でも正しく保存される", () => {
            mockInputElement.value = "0";
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(mockReferenceSetting.beforeX).toBe(0);
            expect(mockReferenceSetting.movementX).toBe(0);
        });

    });

    describe("選択されたオブジェクトがない場合", () => {

        test("selectedDepthsが空の場合、値の保存は行われない", () => {
            mockReferenceSetting.x = 200;
            mockReferenceSetting.beforeX = 100;
            mockReferenceSetting.movementX = 50;
            
            mockMovieClip.selectedDepths = new Set();

            execute(mockEvent);

            // 基本的な処理は実行される
            expect(mockInputElement.style.cursor).toBe("");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockUpdateKeyLock).toHaveBeenCalledWith(true);
            expect(mockSetEditingElement).toHaveBeenCalledWith(mockInputElement);

            // 値の保存は行われない（既存の値が保持される）
            expect(mockReferenceSetting.beforeX).toBe(100);
            expect(mockReferenceSetting.movementX).toBe(50);
        });

        test("selectedDepthsのsizeが0の場合、早期リターンする", () => {
            mockMovieClip.selectedDepths = new Set();
            const originalBeforeX = mockReferenceSetting.beforeX;
            const originalMovementX = mockReferenceSetting.movementX;

            execute(mockEvent);

            // 基本処理は実行されるが、値の更新は行われない
            expect(mockReferenceSetting.beforeX).toBe(originalBeforeX);
            expect(mockReferenceSetting.movementX).toBe(originalMovementX);
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
            
            Object.defineProperty(mockEvent, "currentTarget", {
                value: divElement,
                writable: true,
                configurable: true
            });

            execute(mockEvent);

            // 型キャストにより動作する
            expect(divElement.style.cursor).toBe("");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockUpdateKeyLock).toHaveBeenCalledWith(true);
            expect(mockSetEditingElement).toHaveBeenCalledWith(divElement);
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
            mockInputElement.style.backgroundColor = "red";
            mockInputElement.style.width = "100px";
            mockInputElement.style.cursor = "pointer";

            execute(mockEvent);

            expect(mockInputElement.style.backgroundColor).toBe("red");
            expect(mockInputElement.style.width).toBe("100px");
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

        test("beforeXに現在のxの値が設定される", () => {
            const testValues = [0, 50, -25, 100.5, -150.75];

            testValues.forEach(value => {
                mockInputElement.value = String(value);
                mockMovieClip.selectedDepths = new Set([1]);

                execute(mockEvent);

                expect(mockReferenceSetting.beforeX).toBe(value);
            });
        });

        test("movementXが0にリセットされる", () => {
            mockReferenceSetting.movementX = 999;
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(mockReferenceSetting.movementX).toBe(0);
        });

        test("選択されたオブジェクトがない場合、referenceSettingの値は変更されない", () => {
            const originalX = mockReferenceSetting.x = 123;
            const originalBeforeX = mockReferenceSetting.beforeX = 456;
            const originalMovementX = mockReferenceSetting.movementX = 789;

            mockMovieClip.selectedDepths = new Set();

            execute(mockEvent);

            expect(mockReferenceSetting.x).toBe(originalX);
            expect(mockReferenceSetting.beforeX).toBe(originalBeforeX);
            expect(mockReferenceSetting.movementX).toBe(originalMovementX);
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