import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ReferenceSettingYPointerDownUseCase";

// モックの設定
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $useKeyboard: vi.fn()
}));

vi.mock("@/menu/application/MenuUtil", () => ({
    $allHideMenu: vi.fn()
}));

vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        POINTER_MOVE: "pointermove",
        POINTER_UP: "pointerup",
        POINTER_LEAVE: "pointerleave",
        POINTER_CANCEL: "pointercancel"
    }
}));

vi.mock("./ReferenceSettingYPointerMoveEventUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("./ReferenceSettingYPointerUpEventUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: {
        movementY: 0,
        beforeY: 0
    }
}));

vi.mock("@/global/GlobalUtil", () => ({
    $activeTouchPointers: new Map(),
    $setEditingElement: vi.fn()
}));

describe("ReferenceSettingYPointerDownUseCase", () => {

    let mockEvent: any;
    let mockElement: any;
    let mockUseKeyboard: any;
    let mockAllHideMenu: any;
    let mockSetEditingElement: any;
    let mockReferenceSetting: any;
    let mockActiveTouchPointers: any;
    let mockReferenceSettingYPointerMoveEventUseCase: any;
    let mockReferenceSettingYPointerUpEventUseCase: any;

    beforeEach(() => {
        // モック関数を設定
        mockUseKeyboard = vi.fn().mockReturnValue(false);
        mockAllHideMenu = vi.fn();
        mockSetEditingElement = vi.fn();
        mockReferenceSettingYPointerMoveEventUseCase = vi.fn();
        mockReferenceSettingYPointerUpEventUseCase = vi.fn();

        // モックを適用
        vi.doMock("@/shortcut/ShortcutUtil", () => ({
            $useKeyboard: mockUseKeyboard
        }));

        vi.doMock("@/menu/application/MenuUtil", () => ({
            $allHideMenu: mockAllHideMenu
        }));

        vi.doMock("./ReferenceSettingYPointerMoveEventUseCase", () => ({
            execute: mockReferenceSettingYPointerMoveEventUseCase
        }));

        vi.doMock("./ReferenceSettingYPointerUpEventUseCase", () => ({
            execute: mockReferenceSettingYPointerUpEventUseCase
        }));

        mockReferenceSetting = {
            movementY: 5,  // 初期値を設定して変更を確認
            beforeY: 10
        };

        vi.doMock("@/controller/domain/model/ReferenceSetting", () => ({
            referenceSetting: mockReferenceSetting
        }));

        mockActiveTouchPointers = new Map();

        vi.doMock("@/global/GlobalUtil", () => ({
            $activeTouchPointers: mockActiveTouchPointers,
            $setEditingElement: mockSetEditingElement
        }));

        // HTMLInputElementのモック
        mockElement = {
            value: "123.45",
            style: {},
            setPointerCapture: vi.fn(),
            addEventListener: vi.fn()
        };

        // PointerEventのモック
        mockEvent = {
            button: 0,
            pointerId: 1,
            target: mockElement,
            stopPropagation: vi.fn(),
            preventDefault: vi.fn()
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        mockActiveTouchPointers.clear();
    });

    describe("正常系", () => {

        test("ポインターダウン時の基本処理が実行される", () => {
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockAllHideMenu).toHaveBeenCalled();
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        test("カーソルスタイルが正しく設定される", () => {
            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        test("referenceSettingの値が正しく設定される", () => {
            mockElement.value = "456.78";

            execute(mockEvent);

            expect(mockReferenceSetting.movementY).toBe(0);
            expect(mockReferenceSetting.beforeY).toBe(456.78);
        });

        test("ポインターキャプチャが正しく設定される", () => {
            mockEvent.pointerId = 5;

            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(5);
        });

        test("必要なイベントリスナーが登録される", () => {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledTimes(4);
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointermove",
                mockReferenceSettingYPointerMoveEventUseCase,
                { "passive": false }
            );
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerup",
                mockReferenceSettingYPointerUpEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerleave",
                mockReferenceSettingYPointerUpEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointercancel",
                mockReferenceSettingYPointerUpEventUseCase
            );
        });

        test("整数値が正しくparseFloatされる", () => {
            mockElement.value = "100";

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(100);
        });

        test("小数点値が正しくparseFloatされる", () => {
            mockElement.value = "123.456";

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(123.456);
        });

        test("負の値が正しくparseFloatされる", () => {
            mockElement.value = "-789.123";

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(-789.123);
        });

        test("0値が正しくparseFloatされる", () => {
            mockElement.value = "0";

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(0);
        });

    });

    describe("早期リターンの条件", () => {

        test("左クリック以外のボタンの場合、処理されない", () => {
            mockEvent.button = 1; // 右クリック

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockAllHideMenu).not.toHaveBeenCalled();
        });

        test("右クリック（button = 2）の場合、処理されない", () => {
            mockEvent.button = 2;

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockAllHideMenu).not.toHaveBeenCalled();
        });

        test("マルチタッチ（2本以上）の場合、処理されない", () => {
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockAllHideMenu).not.toHaveBeenCalled();
        });

        test("キーボード使用中の場合、メニュー非表示後に処理が中断される", () => {
            mockUseKeyboard.mockReturnValue(true);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockUseKeyboard).toHaveBeenCalled();
            expect(mockAllHideMenu).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
        });

        test("eventのtargetがnullの場合、処理が中断される", () => {
            mockEvent.target = null;

            execute(mockEvent);

            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });

        test("eventのtargetがundefinedの場合、処理が中断される", () => {
            mockEvent.target = undefined;

            execute(mockEvent);

            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });

    });

    describe("activeTouchPointersの検証", () => {

        test("タッチポインターが1つの場合、処理が継続される", () => {
            mockActiveTouchPointers.set("pointer1", {});

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockAllHideMenu).toHaveBeenCalled();
        });

        test("タッチポインターが0個の場合、処理が継続される", () => {
            // mockActiveTouchPointers は空のMap

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockAllHideMenu).toHaveBeenCalled();
        });

        test("タッチポインターが3つの場合、処理されない", () => {
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});
            mockActiveTouchPointers.set("pointer3", {});

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockAllHideMenu).not.toHaveBeenCalled();
        });

    });

    describe("parseFloatのエッジケース", () => {

        test("空文字列の場合、NaNが設定される", () => {
            mockElement.value = "";

            execute(mockEvent);

            expect(isNaN(mockReferenceSetting.beforeY)).toBe(true);
        });

        test("非数値文字列の場合、NaNが設定される", () => {
            mockElement.value = "abc";

            execute(mockEvent);

            expect(isNaN(mockReferenceSetting.beforeY)).toBe(true);
        });

        test("先頭が数値で後が文字の場合、数値部分が設定される", () => {
            mockElement.value = "123abc";

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(123);
        });

        test("非常に大きな数値が正しく処理される", () => {
            mockElement.value = "999999999999";

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(999999999999);
        });

        test("非常に小さな数値が正しく処理される", () => {
            mockElement.value = "-999999999999";

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(-999999999999);
        });

        test("科学的記法が正しく処理される", () => {
            mockElement.value = "1.23e5";

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(123000);
        });

    });

    describe("イベント処理の順序確認", () => {

        test("イベント処理が正しい順序で実行される", () => {
            const callOrder: string[] = [];

            mockEvent.stopPropagation.mockImplementation(() => {
                callOrder.push("stopPropagation");
            });

            mockUseKeyboard.mockImplementation(() => {
                callOrder.push("useKeyboard");
                return false;
            });

            mockAllHideMenu.mockImplementation(() => {
                callOrder.push("allHideMenu");
            });

            mockSetEditingElement.mockImplementation(() => {
                callOrder.push("setEditingElement");
            });

            mockEvent.preventDefault.mockImplementation(() => {
                callOrder.push("preventDefault");
            });

            execute(mockEvent);

            expect(callOrder).toEqual([
                "stopPropagation",
                "useKeyboard",
                "allHideMenu",
                "setEditingElement",
                "preventDefault"
            ]);
        });

    });

    describe("スタイル設定の確認", () => {

        test("カーソルスタイル以外のプロパティは変更されない", () => {
            mockElement.style = {
                cursor: "default",
                color: "red",
                fontSize: "14px"
            };

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
            expect(mockElement.style.color).toBe("red");
            expect(mockElement.style.fontSize).toBe("14px");
        });

    });

    describe("referenceSettingの初期化確認", () => {

        test("movementYが確実に0にリセットされる", () => {
            mockReferenceSetting.movementY = 100; // 既存値を設定

            execute(mockEvent);

            expect(mockReferenceSetting.movementY).toBe(0);
        });

        test("beforeYが現在のelement.valueで上書きされる", () => {
            mockReferenceSetting.beforeY = 999; // 既存値を設定
            mockElement.value = "200";

            execute(mockEvent);

            expect(mockReferenceSetting.beforeY).toBe(200);
        });

    });

    describe("pointerId の処理確認", () => {

        test("異なるpointerIdが正しく処理される", () => {
            mockEvent.pointerId = 12345;

            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(12345);
        });

        test("負のpointerIdでも処理される", () => {
            mockEvent.pointerId = -1;

            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(-1);
        });

        test("0のpointerIdでも処理される", () => {
            mockEvent.pointerId = 0;

            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(0);
        });

    });

    describe("イベントリスナー登録の詳細確認", () => {

        test("POINTER_MOVEイベントが正しいオプションで登録される", () => {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointermove",
                mockReferenceSettingYPointerMoveEventUseCase,
                { "passive": false }
            );
        });

        test("POINTER_UP, LEAVE, CANCELイベントが同じハンドラーで登録される", () => {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerup",
                mockReferenceSettingYPointerUpEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerleave",
                mockReferenceSettingYPointerUpEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointercancel",
                mockReferenceSettingYPointerUpEventUseCase
            );
        });

        test("全てのイベントリスナーが正しい要素に登録される", () => {
            execute(mockEvent);

            // 4回の addEventListener 呼び出しがすべて同じ要素で行われることを確認
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(4);
            
            // すべての呼び出しが mockElement で行われていることを確認
            const calls = mockElement.addEventListener.mock.calls;
            calls.forEach((call: any) => {
                expect(typeof call[0]).toBe("string"); // イベントタイプが文字列
                expect(typeof call[1]).toBe("function"); // ハンドラーが関数
            });
        });

    });

    describe("Y座標特有の処理確認", () => {

        test("Y座標用のPointerMoveEventUseCaseが登録される", () => {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointermove",
                mockReferenceSettingYPointerMoveEventUseCase,
                { "passive": false }
            );
        });

        test("Y座標用のPointerUpEventUseCaseが登録される", () => {
            execute(mockEvent);

            // UP, LEAVE, CANCELの3つのイベントで同じY座標用ハンドラーが使われる
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerup",
                mockReferenceSettingYPointerUpEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerleave",
                mockReferenceSettingYPointerUpEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointercancel",
                mockReferenceSettingYPointerUpEventUseCase
            );
        });

        test("referenceSettingのY座標関連プロパティが操作される", () => {
            mockElement.value = "250.75";

            execute(mockEvent);

            expect(mockReferenceSetting.movementY).toBe(0);
            expect(mockReferenceSetting.beforeY).toBe(250.75);
            // X座標関連のプロパティは触れられていないことを確認
            expect(mockReferenceSetting.movementX).toBeUndefined();
            expect(mockReferenceSetting.beforeX).toBeUndefined();
        });

    });

});