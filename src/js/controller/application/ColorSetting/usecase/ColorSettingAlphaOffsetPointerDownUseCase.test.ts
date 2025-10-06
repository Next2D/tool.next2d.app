import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ColorSettingAlphaOffsetPointerDownUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { $setColorSettingState } from "../ColorSettingUtil";
import { colorSetting } from "@/controller/domain/model/ColorSetting";
import { execute as colorSettingAlphaOffsetPointerMoveUseCase } from "./ColorSettingAlphaOffsetPointerMoveUseCase";
import { execute as colorSettingAlphaOffsetPointerUpUseCase } from "./ColorSettingAlphaOffsetPointerUpUseCase";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

// モジュールをモック
vi.mock("@/core/application/CoreUtil");
vi.mock("@/menu/application/MenuUtil");
vi.mock("@/shortcut/ShortcutUtil");
vi.mock("../ColorSettingUtil");
vi.mock("./ColorSettingAlphaOffsetPointerMoveUseCase");
vi.mock("./ColorSettingAlphaOffsetPointerUpUseCase");
vi.mock("@/global/GlobalUtil", async () =>
{
    const actual = await vi.importActual("@/global/GlobalUtil");
    return {
        ...actual,
        $activeTouchPointers: new Set(),
        $setEditingElement: vi.fn()
    };
});

describe("ColorSettingAlphaOffsetPointerDownUseCase", () =>
{
    let mockEvent: PointerEvent;
    let mockElement: HTMLInputElement;
    let mockMovieClip: any;
    let mockWorkSpace: any;
    let mock$getCurrentWorkSpace: any;
    let mock$allHideMenu: any;
    let mock$useKeyboard: any;
    let mock$setColorSettingState: any;
    let mock$setEditingElement: any;

    beforeEach(() =>
    {
        // HTMLInputElementのモックを作成
        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "50";
        mockElement.setPointerCapture = vi.fn();
        mockElement.addEventListener = vi.fn();

        // MovieClipのモックを作成
        mockMovieClip = {
            selectedDepths: new Set([1, 2])
        };

        // WorkSpaceのモックを作成
        mockWorkSpace = {
            scene: mockMovieClip
        };

        // PointerEventのモックを作成
        mockEvent = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            pointerId: 1,
            button: 0
        });
        Object.defineProperty(mockEvent, "target", {
            value: mockElement,
            writable: true
        });
        mockEvent.stopPropagation = vi.fn();
        mockEvent.preventDefault = vi.fn();

        // モック関数を設定
        mock$getCurrentWorkSpace = vi.mocked($getCurrentWorkSpace).mockReturnValue(mockWorkSpace);
        mock$allHideMenu = vi.mocked($allHideMenu);
        mock$useKeyboard = vi.mocked($useKeyboard).mockReturnValue(false);
        mock$setColorSettingState = vi.mocked($setColorSettingState);
        mock$setEditingElement = vi.mocked($setEditingElement);

        // $activeTouchPointersをクリア
        ($activeTouchPointers as Set<number>).clear();

        // colorSetting.beforeValueをリセット
        colorSetting.beforeValue = 0;
    });

    afterEach(() =>
    {
        vi.restoreAllMocks();
    });

    describe("基本動作", () =>
    {
        it("左クリック(button=0)で処理が実行される", () =>
        {
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$allHideMenu).toHaveBeenCalled();
        });

        it("stopPropagationが呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("$allHideMenuが呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mock$allHideMenu).toHaveBeenCalledTimes(1);
        });

        it("$setEditingElementがnullで呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mock$setEditingElement).toHaveBeenCalledWith(null);
        });

        it("preventDefaultが呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
        });

        it("カーソルが'ew-resize'に設定される", () =>
        {
            execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("$getCurrentWorkSpaceが呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mock$getCurrentWorkSpace).toHaveBeenCalledTimes(1);
        });

        it("colorSetting.beforeValueが設定される", () =>
        {
            mockElement.value = "75";

            execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(75);
        });

        it("setPointerCaptureが呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(1);
        });

        it("addEventListenerが4回呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledTimes(4);
        });

        it("$setColorSettingStateが'down'で呼ばれる", () =>
        {
            execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });
    });

    describe("早期リターン条件", () =>
    {
        it("button !== 0 の場合は早期リターン", () =>
        {
            mockEvent = new PointerEvent("pointerdown", {
                bubbles: true,
                cancelable: true,
                pointerId: 1,
                button: 1 // 右クリック
            });
            Object.defineProperty(mockEvent, "target", {
                value: mockElement,
                writable: true
            });
            mockEvent.stopPropagation = vi.fn();

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });

        it("$activeTouchPointers.size > 1 の場合は早期リターン", () =>
        {
            ($activeTouchPointers as Set<number>).add(1);
            ($activeTouchPointers as Set<number>).add(2);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });

        it("$useKeyboard()がtrueの場合は早期リターン", () =>
        {
            mock$useKeyboard.mockReturnValue(true);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });

        it("targetがnullの場合は早期リターン", () =>
        {
            Object.defineProperty(mockEvent, "target", {
                value: null,
                writable: true
            });

            execute(mockEvent);

            expect(mock$getCurrentWorkSpace).not.toHaveBeenCalled();
        });

        it("selectedDepths.sizeが0の場合は早期リターン", () =>
        {
            mockMovieClip.selectedDepths.clear();

            execute(mockEvent);

            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
        });
    });

    describe("イベントリスナーの登録", () =>
    {
        it("POINTER_MOVEイベントリスナーが登録される", () =>
        {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                EventType.POINTER_MOVE,
                colorSettingAlphaOffsetPointerMoveUseCase,
                { "passive": false }
            );
        });

        it("POINTER_UPイベントリスナーが登録される", () =>
        {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                EventType.POINTER_UP,
                colorSettingAlphaOffsetPointerUpUseCase
            );
        });

        it("POINTER_CANCELイベントリスナーが登録される", () =>
        {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                EventType.POINTER_CANCEL,
                colorSettingAlphaOffsetPointerUpUseCase
            );
        });

        it("POINTER_LEAVEイベントリスナーが登録される", () =>
        {
            execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                EventType.POINTER_LEAVE,
                colorSettingAlphaOffsetPointerUpUseCase
            );
        });

        it("POINTER_MOVEは{ passive: false }オプション付き", () =>
        {
            execute(mockEvent);

            const calls = (mockElement.addEventListener as any).mock.calls;
            const moveCall = calls.find((call: any[]) => call[0] === EventType.POINTER_MOVE);

            expect(moveCall).toBeDefined();
            expect(moveCall[2]).toEqual({ "passive": false });
        });

        it("POINTER_UP/CANCEL/LEAVEはオプションなし、またはundefined", () =>
        {
            execute(mockEvent);

            const calls = (mockElement.addEventListener as any).mock.calls;
            const upCall = calls.find((call: any[]) => call[0] === EventType.POINTER_UP);
            const cancelCall = calls.find((call: any[]) => call[0] === EventType.POINTER_CANCEL);
            const leaveCall = calls.find((call: any[]) => call[0] === EventType.POINTER_LEAVE);

            expect(upCall[2]).toBeUndefined();
            expect(cancelCall[2]).toBeUndefined();
            expect(leaveCall[2]).toBeUndefined();
        });
    });

    describe("実行順序", () =>
    {
        it("stopPropagation → $useKeyboardチェックの順", () =>
        {
            const callOrder: string[] = [];

            mockEvent.stopPropagation = vi.fn(() => callOrder.push("stopPropagation"));
            mock$useKeyboard.mockImplementation(() =>
            {
                callOrder.push("$useKeyboard");
                return false;
            });

            execute(mockEvent);

            expect(callOrder[0]).toBe("stopPropagation");
            expect(callOrder[1]).toBe("$useKeyboard");
        });

        it("$allHideMenu → $setEditingElement → preventDefaultの順", () =>
        {
            const callOrder: string[] = [];

            mock$allHideMenu.mockImplementation(() => callOrder.push("$allHideMenu"));
            mock$setEditingElement.mockImplementation(() => callOrder.push("$setEditingElement"));
            mockEvent.preventDefault = vi.fn(() => callOrder.push("preventDefault"));

            execute(mockEvent);

            expect(callOrder.indexOf("$allHideMenu")).toBeLessThan(callOrder.indexOf("$setEditingElement"));
            expect(callOrder.indexOf("$setEditingElement")).toBeLessThan(callOrder.indexOf("preventDefault"));
        });

        it("beforeValue保存 → setPointerCapture → addEventListenerの順", () =>
        {
            const callOrder: string[] = [];

            mockElement.setPointerCapture = vi.fn(() => callOrder.push("setPointerCapture"));
            mockElement.addEventListener = vi.fn(() => callOrder.push("addEventListener"));

            execute(mockEvent);
            callOrder.unshift("beforeValue");

            expect(callOrder.indexOf("beforeValue")).toBeLessThan(callOrder.indexOf("setPointerCapture"));
            expect(callOrder.indexOf("setPointerCapture")).toBeLessThan(callOrder.indexOf("addEventListener"));
        });
    });

    describe("値の解析", () =>
    {
        it("整数値が正しく解析される", () =>
        {
            mockElement.value = "80";

            execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(80);
        });

        it("小数点を含む値が正しく解析される", () =>
        {
            mockElement.value = "75.5";

            execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(75.5);
        });

        it("0が正しく解析される", () =>
        {
            mockElement.value = "0";

            execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(0);
        });

        it("負の値が正しく解析される", () =>
        {
            mockElement.type = "number";
            mockElement.value = "-10";

            execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(-10);
        });

        it("type='range'で255は100に正規化される", () =>
        {
            mockElement.type = "range";
            mockElement.value = "255";

            execute(mockEvent);

            // type='range'は0-100の範囲に自動正規化
            expect(colorSetting.beforeValue).toBe(100);
        });

        it("type='number'で255が正しく解析される", () =>
        {
            mockElement.type = "number";
            mockElement.value = "255";

            execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(255);
        });
    });

    describe("PointerEvent処理", () =>
    {
        it("pointerIdが正しく使用される", () =>
        {
            mockEvent = new PointerEvent("pointerdown", {
                bubbles: true,
                cancelable: true,
                pointerId: 42,
                button: 0
            });
            Object.defineProperty(mockEvent, "target", {
                value: mockElement,
                writable: true
            });
            mockEvent.stopPropagation = vi.fn();
            mockEvent.preventDefault = vi.fn();

            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(42);
        });

        it("button=0のみ処理される", () =>
        {
            execute(mockEvent);

            expect(mock$allHideMenu).toHaveBeenCalled();
        });

        it("button=1は処理されない", () =>
        {
            mockEvent = new PointerEvent("pointerdown", {
                button: 1
            });
            mockEvent.stopPropagation = vi.fn();

            execute(mockEvent);

            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });

        it("button=2は処理されない", () =>
        {
            mockEvent = new PointerEvent("pointerdown", {
                button: 2
            });
            mockEvent.stopPropagation = vi.fn();

            execute(mockEvent);

            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });
    });

    describe("WorkSpace処理", () =>
    {
        it("WorkSpace.sceneが正しく取得される", () =>
        {
            execute(mockEvent);

            expect(mock$getCurrentWorkSpace).toHaveBeenCalled();
            // movieClipがworkSpace.sceneから取得されることを確認
            expect(mockElement.setPointerCapture).toHaveBeenCalled();
        });

        it("selectedDepthsが空の場合は早期リターン", () =>
        {
            mockMovieClip.selectedDepths = new Set();

            execute(mockEvent);

            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
        });

        it("selectedDepthsに要素がある場合は処理継続", () =>
        {
            mockMovieClip.selectedDepths = new Set([1]);

            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalled();
        });

        it("selectedDepthsが複数の場合も処理される", () =>
        {
            mockMovieClip.selectedDepths = new Set([1, 2, 3]);

            execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalled();
        });
    });

    describe("統合シナリオ", () =>
    {
        it("完全なポインターダウンフロー", () =>
        {
            mockElement.value = "100";

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$useKeyboard).toHaveBeenCalled();
            expect(mock$allHideMenu).toHaveBeenCalled();
            expect(mock$setEditingElement).toHaveBeenCalledWith(null);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mockElement.style.cursor).toBe("ew-resize");
            expect(mock$getCurrentWorkSpace).toHaveBeenCalled();
            expect(colorSetting.beforeValue).toBe(100);
            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(1);
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(4);
            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("複数の早期リターン条件が正しく機能する", () =>
        {
            // button !== 0
            mockEvent = new PointerEvent("pointerdown", { button: 1 });
            mockEvent.stopPropagation = vi.fn();
            execute(mockEvent);
            expect(mock$allHideMenu).not.toHaveBeenCalled();

            // $activeTouchPointers.size > 1
            vi.clearAllMocks();
            mockEvent = new PointerEvent("pointerdown", { button: 0 });
            mockEvent.stopPropagation = vi.fn();
            ($activeTouchPointers as Set<number>).add(1);
            ($activeTouchPointers as Set<number>).add(2);
            execute(mockEvent);
            expect(mock$allHideMenu).not.toHaveBeenCalled();

            // $useKeyboard() === true
            vi.clearAllMocks();
            ($activeTouchPointers as Set<number>).clear();
            mock$useKeyboard.mockReturnValue(true);
            execute(mockEvent);
            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });
    });

    describe("エッジケース", () =>
    {
        it("value='0'の場合", () =>
        {
            mockElement.value = "0";

            execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(0);
            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("value='255'の場合 (type='range'は100に正規化)", () =>
        {
            mockElement.type = "range";
            mockElement.value = "255";

            execute(mockEvent);

            // type='range'は0-100の範囲に自動正規化
            expect(colorSetting.beforeValue).toBe(100);
            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("type='number'でvalue='255'の場合", () =>
        {
            mockElement.type = "number";
            mockElement.value = "255";

            execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(255);
            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("value='127.5'の場合 (type='range'は100に正規化)", () =>
        {
            mockElement.type = "range";
            mockElement.value = "127.5";

            execute(mockEvent);

            // type='range'は0-100の範囲に自動正規化
            expect(colorSetting.beforeValue).toBe(100);
        });

        it("type='number'でvalue='127.5'の場合", () =>
        {
            mockElement.type = "number";
            mockElement.value = "127.5";

            execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(127.5);
        });

        it("複数回実行してもそれぞれ正しく処理される", () =>
        {
            mockElement.value = "10";
            execute(mockEvent);
            expect(colorSetting.beforeValue).toBe(10);

            vi.clearAllMocks();
            mockElement.value = "20";
            execute(mockEvent);
            expect(colorSetting.beforeValue).toBe(20);

            vi.clearAllMocks();
            mockElement.value = "30";
            execute(mockEvent);
            expect(colorSetting.beforeValue).toBe(30);
        });
    });

    describe("戻り値", () =>
    {
        it("戻り値はundefined(void)", () =>
        {
            const result = execute(mockEvent);

            expect(result).toBeUndefined();
        });

        it("早期リターン時もundefinedを返す", () =>
        {
            mockEvent = new PointerEvent("pointerdown", { button: 1 });
            mockEvent.stopPropagation = vi.fn();

            const result = execute(mockEvent);

            expect(result).toBeUndefined();
        });
    });
});
