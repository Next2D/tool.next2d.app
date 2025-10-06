import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// モック関数の定義
const mock$updateKeyLock = vi.fn();
const mock$setEditingElement = vi.fn();
const mock$getCurrentWorkSpace = vi.fn();

// colorSettingのモック
const mockColorSetting = {
    beforeValue: 0
};

// vi.mockの呼び出し
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $updateKeyLock: (lock: boolean) => mock$updateKeyLock(lock)
}));

vi.mock("@/global/GlobalUtil", () => ({
    $setEditingElement: (element: HTMLInputElement) => mock$setEditingElement(element)
}));

vi.mock("@/controller/domain/model/ColorSetting", () => ({
    colorSetting: mockColorSetting
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

// 動的インポート
const { execute } = await import("./ColorSettingInputFocusInEventService");

describe("ColorSettingInputFocusInEventService", () =>
{
    let mockElement: HTMLInputElement;
    let mockEvent: FocusEvent;
    let mockWorkSpace: any;
    let mockMovieClip: any;

    beforeEach(() =>
    {
        vi.clearAllMocks();

        // モックHTMLInputElement
        mockElement = document.createElement("input");
        mockElement.type = "number";
        mockElement.value = "50";
        mockElement.style.cursor = "pointer";

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
            stopPropagation: vi.fn(),
            preventDefault: vi.fn()
        } as unknown as FocusEvent;

        // colorSetting.beforeValueをリセット
        mockColorSetting.beforeValue = 0;
    });

    afterEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("基本動作", () =>
    {
        it("currentTargetが存在する場合、正常に処理される", () =>
        {
            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
            expect(mock$updateKeyLock).toHaveBeenCalledWith(true);
            expect(mock$setEditingElement).toHaveBeenCalledWith(mockElement);
            expect(mockColorSetting.beforeValue).toBe(50);
        });

        it("currentTargetがnullの場合は早期リターン", () =>
        {
            const nullEvent = {
                currentTarget: null,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            } as unknown as FocusEvent;

            execute(nullEvent);

            expect(nullEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$updateKeyLock).not.toHaveBeenCalled();
            expect(mock$setEditingElement).not.toHaveBeenCalled();
        });

        it("stopPropagationが呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("$updateKeyLockがtrueで呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mock$updateKeyLock).toHaveBeenCalledWith(true);
            expect(mock$updateKeyLock).toHaveBeenCalledTimes(1);
        });

        it("$setEditingElementが要素と共に呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mock$setEditingElement).toHaveBeenCalledWith(mockElement);
            expect(mock$setEditingElement).toHaveBeenCalledTimes(1);
        });
    });

    describe("cursor操作", () =>
    {
        it("cursorスタイルが空文字列にリセットされる", () =>
        {
            mockElement.style.cursor = "pointer";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("cursorが既に空の場合もそのまま", () =>
        {
            mockElement.style.cursor = "";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });

        it("cursorが他の値でもリセットされる", () =>
        {
            mockElement.style.cursor = "not-allowed";

            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("");
        });
    });

    describe("beforeValueの保持", () =>
    {
        it("element.valueが整数の場合", () =>
        {
            mockElement.value = "75";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(75);
        });

        it("element.valueが0の場合", () =>
        {
            mockElement.value = "0";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(0);
        });

        it("element.valueが100の場合", () =>
        {
            mockElement.value = "100";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(100);
        });

        it("element.valueが小数の場合", () =>
        {
            mockElement.value = "50.5";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(50.5);
        });

        it("element.valueが負の値の場合", () =>
        {
            mockElement.value = "-10";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(-10);
        });

        it("element.valueが空文字列の場合はNaN", () =>
        {
            mockElement.value = "";

            execute(mockEvent);

            expect(Number.isNaN(mockColorSetting.beforeValue)).toBe(true);
        });

        it("element.valueが数値でない場合はNaN", () =>
        {
            mockElement.value = "invalid";

            execute(mockEvent);

            expect(Number.isNaN(mockColorSetting.beforeValue)).toBe(true);
        });
    });

    describe("selectedDepthsのチェック", () =>
    {
        it("selectedDepths.sizeが0の場合は早期リターン", () =>
        {
            mockMovieClip.selectedDepths = new Map();

            execute(mockEvent);

            // イベント処理は実行されるがbeforeValueは保持されない
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$updateKeyLock).toHaveBeenCalled();
            expect(mock$setEditingElement).toHaveBeenCalled();
            // beforeValueは更新されない (早期リターン後)
            expect(mockColorSetting.beforeValue).toBe(0);
        });

        it("selectedDepthsが空のMapの場合", () =>
        {
            mockMovieClip.selectedDepths = new Map();
            expect(mockMovieClip.selectedDepths.size).toBe(0);

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(0);
        });

        it("selectedDepthsに複数の選択がある場合も正常動作", () =>
        {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2]],
                [1, [3]]
            ]);
            mockElement.value = "80";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(80);
        });
    });

    describe("実行順序", () =>
    {
        it("cursor → stopPropagation → $updateKeyLock → $setEditingElement → beforeValueの順", () =>
        {
            const callOrder: string[] = [];

            // cursorの監視
            Object.defineProperty(mockElement.style, "cursor", {
                set: function(value) {
                    callOrder.push("cursor");
                    this._cursor = value;
                },
                get: function() {
                    return this._cursor || "";
                },
                configurable: true
            });

            mockEvent.stopPropagation = vi.fn(() => {
                callOrder.push("stopPropagation");
            });

            mock$updateKeyLock.mockImplementation(() => {
                callOrder.push("$updateKeyLock");
            });

            mock$setEditingElement.mockImplementation(() => {
                callOrder.push("$setEditingElement");
            });

            // beforeValueの監視
            Object.defineProperty(mockColorSetting, "beforeValue", {
                set: function(value) {
                    callOrder.push("beforeValue");
                    this._beforeValue = value;
                },
                get: function() {
                    return this._beforeValue;
                },
                configurable: true
            });

            execute(mockEvent);

            expect(callOrder[0]).toBe("cursor");
            expect(callOrder[1]).toBe("stopPropagation");
            expect(callOrder[2]).toBe("$updateKeyLock");
            expect(callOrder[3]).toBe("$setEditingElement");
            expect(callOrder[4]).toBe("beforeValue");
        });
    });

    describe("$getCurrentWorkSpaceの使用", () =>
    {
        it("$getCurrentWorkSpaceが呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mock$getCurrentWorkSpace).toHaveBeenCalledTimes(1);
        });

        it("workSpace.sceneからmovieClipを取得する", () =>
        {
            execute(mockEvent);

            expect(mock$getCurrentWorkSpace).toHaveBeenCalled();
            expect(mockColorSetting.beforeValue).toBe(50);
        });
    });

    describe("エッジケース", () =>
    {
        it("elementのvalueが'0'の場合", () =>
        {
            mockElement.value = "0";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(0);
        });

        it("elementのvalueが非常に大きな数の場合", () =>
        {
            mockElement.value = "999999";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(999999);
        });

        it("elementのvalueが非常に小さな数の場合", () =>
        {
            mockElement.value = "-999999";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(-999999);
        });

        it("elementのvalueが小数点以下が長い場合", () =>
        {
            mockElement.value = "50.123456789";

            execute(mockEvent);

            expect(mockColorSetting.beforeValue).toBe(50.123456789);
        });

        it("複数回実行してもbeforeValueが正しく更新される", () =>
        {
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

    describe("型チェック", () =>
    {
        it("FocusEventを正しく処理する", () =>
        {
            expect(() => execute(mockEvent)).not.toThrow();
        });

        it("currentTargetがHTMLInputElementとしてキャストされる", () =>
        {
            execute(mockEvent);

            expect(mock$setEditingElement).toHaveBeenCalledWith(mockElement);
            expect(mockElement).toBeInstanceOf(HTMLInputElement);
        });
    });

    describe("実行結果", () =>
    {
        it("戻り値はundefined(void)", () =>
        {
            const result = execute(mockEvent);

            expect(result).toBeUndefined();
        });

        it("currentTargetがnullの場合もundefinedを返す", () =>
        {
            const nullEvent = {
                currentTarget: null,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            } as unknown as FocusEvent;

            const result = execute(nullEvent);

            expect(result).toBeUndefined();
        });

        it("selectedDepths.sizeが0の場合もundefinedを返す", () =>
        {
            mockMovieClip.selectedDepths = new Map();

            const result = execute(mockEvent);

            expect(result).toBeUndefined();
        });
    });
});
