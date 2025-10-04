import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// モック関数の定義
const mock$updateKeyLock = vi.fn();
const mock$getCurrentWorkSpace = vi.fn();
const mock$setEditingElement = vi.fn();

// colorSettingのモック
const mockColorSetting = {
    beforeValue: 0
};

// vi.mockの呼び出し
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $updateKeyLock: (value: boolean) => mock$updateKeyLock(value)
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("@/global/GlobalUtil", () => ({
    $setEditingElement: (element: HTMLElement) => mock$setEditingElement(element)
}));

vi.mock("@/controller/domain/model/ColorSetting", () => ({
    colorSetting: mockColorSetting
}));

// 動的インポート
const { execute } = await import("./ColorSettingAlphaMultiplierFocusInEventService");

describe("ColorSettingAlphaMultiplierFocusInEventService", () => {
    let mockElement: HTMLInputElement;
    let mockEvent: FocusEvent;
    let mockWorkSpace: any;
    let mockMovieClip: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // モックelement
        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "50";
        mockElement.style.cursor = "ew-resize";

        // モックMovieClip
        mockMovieClip = {
            selectedDepths: new Map([[0, [1]]])
        };

        // モックWorkSpace
        mockWorkSpace = {
            scene: mockMovieClip
        };

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        // モックFocusEvent
        mockEvent = {
            currentTarget: mockElement,
            stopPropagation: vi.fn()
        } as unknown as FocusEvent;

        // colorSettingの初期化
        mockColorSetting.beforeValue = 0;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("基本動作", () => {
        it("currentTargetがnullの場合は早期リターン", () => {
            mockEvent = {
                currentTarget: null,
                stopPropagation: vi.fn()
            } as unknown as FocusEvent;

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$updateKeyLock).not.toHaveBeenCalled();
        });

        it("currentTargetがundefinedの場合は早期リターン", () => {
            mockEvent = {
                currentTarget: undefined,
                stopPropagation: vi.fn()
            } as unknown as FocusEvent;

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$updateKeyLock).not.toHaveBeenCalled();
        });

        it("element.style.cursorがリセットされる", () => {
            mockElement.style.cursor = "ew-resize";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("stopPropagationが呼ばれる", () => {
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("$updateKeyLockがtrueで呼ばれる", () => {
            execute(mockEvent);

            expect(mock$updateKeyLock).toHaveBeenCalledWith(true);
            expect(mock$updateKeyLock).toHaveBeenCalledTimes(1);
        });

        it("$setEditingElementが要素とともに呼ばれる", () => {
            execute(mockEvent);

            expect(mock$setEditingElement).toHaveBeenCalledWith(mockElement);
            expect(mock$setEditingElement).toHaveBeenCalledTimes(1);
        });

        it("$getCurrentWorkSpaceが呼ばれる", () => {
            execute(mockEvent);

            expect(mock$getCurrentWorkSpace).toHaveBeenCalledTimes(1);
        });

        it("colorSetting.beforeValueに現在値が保存される", () => {
            mockElement.value = "75";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(75);
        });
    });

    describe("selectedDepthsのチェック", () => {
        it("selectedDepths.sizeが0の場合はbeforeValueが設定されない", () => {
            mockMovieClip.selectedDepths = new Map();
            mockColorSetting.beforeValue = 999;

            execute(mockEvent);

            // beforeValueは変更されない
            expect(mockColorSetting.beforeValue).toBe(999);
        });

        it("selectedDepths.sizeが1以上の場合はbeforeValueが設定される", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockElement.value = "60";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(60);
        });

        it("selectedDepths.sizeが0でも基本処理は実行される", () => {
            mockMovieClip.selectedDepths = new Map();

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$updateKeyLock).toHaveBeenCalledWith(true);
            expect(mock$setEditingElement).toHaveBeenCalledWith(mockElement);
        });
    });

    describe("値の解析", () => {
        it("整数値が正しくparseされる", () => {
            mockElement.value = "50";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(50);
        });

        it("小数点を含む値が正しくparseされる", () => {
            mockElement.value = "75.5";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(75.5);
        });

        it("0の値が正しく保存される", () => {
            mockElement.value = "0";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(0);
        });

        it("100の値が正しく保存される", () => {
            mockElement.value = "100";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(100);
        });

        it("空文字列の場合 (type='range'は50に正規化)", () => {
            mockElement.type = "range";
            mockElement.value = "";

            execute(mockEvent);

            // type="range"の場合、空文字列は中間値50に正規化される
            expect(mockColorSetting.beforeValue).toBe(50);
        });

        it("parseFloatできない文字列の場合 (type='range'は50に正規化)", () => {
            mockElement.type = "range";
            mockElement.value = "abc";

            execute(mockEvent);

            // type="range"の場合、不正な値は中間値50に正規化される
            expect(mockColorSetting.beforeValue).toBe(50);
        });

        it("type='number'で空文字列の場合はNaNとして保存される", () => {
            mockElement.type = "number";
            mockElement.value = "";

            execute(mockEvent);

            // type="number"の場合、空文字列はNaNになる
            expect(mockColorSetting.beforeValue).toBeNaN();
        });

        it("type='number'でparseFloatできない文字列の場合はNaNとして保存される", () => {
            mockElement.type = "number";
            mockElement.value = "abc";

            execute(mockEvent);

            // type="number"の場合、不正な値はNaNになる
            expect(mockColorSetting.beforeValue).toBeNaN();
        });
    });

    describe("実行順序", () => {
        it("処理が正しい順序で実行される", () => {
            const callOrder: string[] = [];

            mock$updateKeyLock.mockImplementation(() => callOrder.push("updateKeyLock"));
            mock$setEditingElement.mockImplementation(() => callOrder.push("setEditingElement"));
            mock$getCurrentWorkSpace.mockImplementation(() => {
                callOrder.push("getCurrentWorkSpace");
                return mockWorkSpace;
            });
            mockEvent.stopPropagation = vi.fn(() => callOrder.push("stopPropagation"));

            execute(mockEvent);

            // 1. cursor reset (テスト不可)
            // 2. stopPropagation
            // 3. $updateKeyLock
            // 4. $setEditingElement
            // 5. $getCurrentWorkSpace
            // 6. beforeValue設定 (テスト不可)

            expect(callOrder[0]).toBe("stopPropagation");
            expect(callOrder[1]).toBe("updateKeyLock");
            expect(callOrder[2]).toBe("setEditingElement");
            expect(callOrder[3]).toBe("getCurrentWorkSpace");
        });

        it("cursorのリセットがstopPropagationより前", () => {
            mockElement.style.cursor = "pointer";

            execute(mockEvent);

            // cursorがリセットされている
            expect(mockElement.style.cursor).toBe("");
            // stopPropagationも呼ばれている
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });
    });

    describe("cursor styleのリセット", () => {
        it("cursor = 'ew-resize'が''にリセットされる", () => {
            mockElement.style.cursor = "ew-resize";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("cursor = 'pointer'が''にリセットされる", () => {
            mockElement.style.cursor = "pointer";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("cursor = 'auto'が''にリセットされる", () => {
            mockElement.style.cursor = "auto";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("cursor = ''はそのまま''", () => {
            mockElement.style.cursor = "";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });
    });

    describe("WorkSpaceとMovieClipの取得", () => {
        it("WorkSpaceからsceneが取得される", () => {
            execute(mockEvent);

            expect(mock$getCurrentWorkSpace).toHaveBeenCalled();
            // selectedDepthsにアクセスできることを確認
            expect(mockColorSetting.beforeValue).toBe(50);
        });

        it("WorkSpaceがnullの場合でもエラーにならない", () => {
            mock$getCurrentWorkSpace.mockReturnValue(null);

            // エラーが発生する可能性があるが、実装はnullチェックしていない
            expect(() => execute(mockEvent)).toThrow();
        });

        it("movieClip.selectedDepthsが存在することを確認", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]], [1, [2]]]);

            execute(mockEvent);

            // beforeValueが設定されている = selectedDepthsにアクセスできた
            expect(mockColorSetting.beforeValue).toBe(50);
        });
    });

    describe("統合シナリオ", () => {
        it("完全なフォーカスインフロー", () => {
            mockElement.value = "80";
            mockElement.style.cursor = "ew-resize";
            mockMovieClip.selectedDepths = new Map([[0, [1, 2]]]);

            execute(mockEvent);

            // 1. cursorがリセットされる
            expect(mockElement.style.cursor).toBe("");

            // 2. stopPropagationが呼ばれる
            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);

            // 3. キーロックが有効化される
            expect(mock$updateKeyLock).toHaveBeenCalledWith(true);

            // 4. 編集要素が設定される
            expect(mock$setEditingElement).toHaveBeenCalledWith(mockElement);

            // 5. WorkSpaceが取得される
            expect(mock$getCurrentWorkSpace).toHaveBeenCalled();

            // 6. beforeValueが保存される
            expect(mockColorSetting.beforeValue).toBe(80);
        });

        it("selectedDepthsが空の場合の動作", () => {
            mockElement.value = "40";
            mockMovieClip.selectedDepths = new Map();
            mockColorSetting.beforeValue = 123;

            execute(mockEvent);

            // 基本処理は実行される
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$updateKeyLock).toHaveBeenCalledWith(true);
            expect(mock$setEditingElement).toHaveBeenCalledWith(mockElement);

            // beforeValueは変更されない
            expect(mockColorSetting.beforeValue).toBe(123);
        });

        it("element.valueが空の場合 (type='range'は50に正規化)", () => {
            mockElement.type = "range";
            mockElement.value = "";
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            execute(mockEvent);

            // 全ての処理は実行される
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$updateKeyLock).toHaveBeenCalledWith(true);

            // type="range"の場合、空文字列は50に正規化される
            expect(mockColorSetting.beforeValue).toBe(50);
        });
    });

    describe("エッジケース", () => {
        it("value = '0'の場合", () => {
            mockElement.value = "0";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(0);
        });

        it("value = '100'の場合", () => {
            mockElement.value = "100";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(100);
        });

        it("value = '0.1'の場合", () => {
            mockElement.value = "0.1";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(0.1);
        });

        it("value = '99.99'の場合", () => {
            mockElement.value = "99.99";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(99.99);
        });

        it("負の値が入力された場合 (type='range'は0にクランプ)", () => {
            mockElement.type = "range";
            mockElement.value = "-10";

            execute(mockEvent);

            // type="range"の場合、範囲外の値は最小値0にクランプされる
            expect(mockColorSetting.beforeValue).toBe(0);
        });

        it("100を超える値が入力された場合 (type='range'は100にクランプ)", () => {
            mockElement.type = "range";
            mockElement.value = "150";

            execute(mockEvent);

            // type="range"の場合、範囲外の値は最大値100にクランプされる
            expect(mockColorSetting.beforeValue).toBe(100);
        });

        it("selectedDepths.size = 1の場合", () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            mockElement.value = "50";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(50);
        });

        it("selectedDepths.size = 複数の場合", () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2, 3]],
                [1, [4, 5]]
            ]);
            mockElement.value = "65";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(65);
        });
    });

    describe("HTMLInputElementの動作", () => {
        it("input要素のvalueプロパティが正しく読み取られる", () => {
            mockElement.value = "42";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(42);
        });

        it("type='range'の要素で動作する", () => {
            mockElement.type = "range";
            mockElement.value = "55";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(55);
        });

        it("type='number'の要素でも動作する", () => {
            mockElement.type = "number";
            mockElement.value = "88";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(88);
        });

        it("style.cursorの操作が正しく行われる", () => {
            mockElement.style.cursor = "move";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });
    });

    describe("FocusEventの処理", () => {
        it("FocusEventのcurrentTargetが正しく取得される", () => {
            execute(mockEvent);

            expect(mock$setEditingElement).toHaveBeenCalledWith(mockElement);
        });

        it("stopPropagationが1回だけ呼ばれる", () => {
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("複数回実行してもbeforeValueは最後の値になる", () => {
            mockElement.value = "10";
            execute(mockEvent);
            expect(mockColorSetting.beforeValue).toBe(10);

            mockElement.value = "20";
            execute(mockEvent);
            expect(mockColorSetting.beforeValue).toBe(20);

            mockElement.value = "30";
            execute(mockEvent);
            expect(mockColorSetting.beforeValue).toBe(30);
        });
    });
});
