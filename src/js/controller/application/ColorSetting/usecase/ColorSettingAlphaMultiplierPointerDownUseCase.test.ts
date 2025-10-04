import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";

// モック関数の定義
const mock$getCurrentWorkSpace = vi.fn();
const mock$allHideMenu = vi.fn();
const mock$useKeyboard = vi.fn();
const mock$setColorSettingState = vi.fn();
const mock$setEditingElement = vi.fn();
const mockColorSettingAlphaMultiplierPointerMoveUseCase = vi.fn();
const mockColorSettingAlphaMultiplierPointerUpUseCase = vi.fn();

// vi.mockの呼び出し
vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("@/menu/application/MenuUtil", () => ({
    $allHideMenu: () => mock$allHideMenu()
}));

vi.mock("@/shortcut/ShortcutUtil", () => ({
    $useKeyboard: () => mock$useKeyboard()
}));

vi.mock("../ColorSettingUtil", () => ({
    $setColorSettingState: (state: string) => mock$setColorSettingState(state)
}));

vi.mock("@/global/GlobalUtil", () => ({
    $activeTouchPointers: new Set(),
    $setEditingElement: (element: HTMLElement | null) => mock$setEditingElement(element)
}));

vi.mock("./ColorSettingAlphaMultiplierPointerMoveUseCase", () => ({
    execute: mockColorSettingAlphaMultiplierPointerMoveUseCase
}));

vi.mock("./ColorSettingAlphaMultiplierPointerUpUseCase", () => ({
    execute: mockColorSettingAlphaMultiplierPointerUpUseCase
}));

// 動的インポート
const { execute } = await import("./ColorSettingAlphaMultiplierPointerDownUseCase");
const { colorSetting } = await import("@/controller/domain/model/ColorSetting");
const { $activeTouchPointers } = await import("@/global/GlobalUtil");

describe("ColorSettingAlphaMultiplierPointerDownUseCase", () => {
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockElement: HTMLInputElement;

    const createMockEvent = (button: number = 0, target: HTMLInputElement | null = null): PointerEvent => {
        return {
            button: button,
            target: target,
            pointerId: 1,
            stopPropagation: vi.fn(),
            preventDefault: vi.fn()
        } as unknown as PointerEvent;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // colorSettingのリセット
        colorSetting.beforeValue = 0;

        // モックHTML要素を作成
        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "0.5";
        mockElement.setPointerCapture = vi.fn();
        mockElement.addEventListener = vi.fn();

        const selectedDepths = new Map([[0, [1]]]);
        mockMovieClip = {
            selectedDepths: selectedDepths
        } as unknown as MovieClip;

        mockWorkSpace = {
            scene: mockMovieClip
        } as unknown as WorkSpace;

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mock$useKeyboard.mockReturnValue(false);

        // $activeTouchPointersをクリア
        $activeTouchPointers.clear();
    });

    describe("基本動作", () => {
        it("正常なポインターダウンで全ての処理が実行される", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mock$allHideMenu).toHaveBeenCalled();
            expect(mock$setEditingElement).toHaveBeenCalledWith(null);
            expect(colorSetting.beforeValue).toBe(0.5);
            expect(mockElement.style.cursor).toBe("ew-resize");
            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(1);
            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("カーソルがew-resizeに設定される", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockElement.style.cursor).toBe("ew-resize");
        });

        it("beforeValueが要素のvalueから設定される", async () => {
            mockElement.value = "0.75";
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(0.75);
        });

        it("setPointerCaptureが正しいpointerIdで呼ばれる", async () => {
            const mockEvent = createMockEvent(0, mockElement);
            (mockEvent as any).pointerId = 123;

            await execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(123);
        });
    });

    describe("早期リターン条件", () => {
        it("event.buttonが0以外の場合は何もしない", async () => {
            const mockEvent = createMockEvent(1, mockElement); // 右クリック

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });

        it("event.buttonが2の場合は何もしない", async () => {
            const mockEvent = createMockEvent(2, mockElement); // 中クリック

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });

        it("$activeTouchPointersが2以上の場合は何もしない", async () => {
            $activeTouchPointers.add(1);
            $activeTouchPointers.add(2);
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });

        it("$useKeyboardがtrueの場合は早期リターン", async () => {
            mock$useKeyboard.mockReturnValue(true);
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
            expect(mock$setColorSettingState).not.toHaveBeenCalled();
        });

        it("event.targetがnullの場合は何もしない", async () => {
            const mockEvent = createMockEvent(0, null);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mock$setColorSettingState).not.toHaveBeenCalled();
        });

        it("selectedDepthsが空の場合は何もしない", async () => {
            const emptySelectedDepths = new Map();
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: emptySelectedDepths,
                writable: true,
                configurable: true
            });
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockElement.setPointerCapture).not.toHaveBeenCalled();
            expect(mock$setColorSettingState).not.toHaveBeenCalled();
        });
    });

    describe("イベント処理", () => {
        it("stopPropagationが呼ばれる", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("preventDefaultが呼ばれる", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
        });

        it("button !== 0の場合はstopPropagationが呼ばれない", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("イベントリスナー登録", () => {
        it("POINTER_MOVEイベントリスナーが登録される", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointermove",
                mockColorSettingAlphaMultiplierPointerMoveUseCase,
                { "passive": false }
            );
        });

        it("POINTER_UPイベントリスナーが登録される", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerup",
                mockColorSettingAlphaMultiplierPointerUpUseCase
            );
        });

        it("POINTER_CANCELイベントリスナーが登録される", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointercancel",
                mockColorSettingAlphaMultiplierPointerUpUseCase
            );
        });

        it("POINTER_LEAVEイベントリスナーが登録される", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerleave",
                mockColorSettingAlphaMultiplierPointerUpUseCase
            );
        });

        it("4つのイベントリスナーが全て登録される", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockElement.addEventListener).toHaveBeenCalledTimes(4);
        });
    });

    describe("メニューと編集要素の制御", () => {
        it("$allHideMenuが呼ばれる", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$allHideMenu).toHaveBeenCalledTimes(1);
        });

        it("$setEditingElementがnullで呼ばれる", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setEditingElement).toHaveBeenCalledWith(null);
        });

        it("キーボード使用中は$allHideMenuが呼ばれない", async () => {
            mock$useKeyboard.mockReturnValue(true);
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });
    });

    describe("カラー設定状態の変更", () => {
        it("$setColorSettingStateが'down'で呼ばれる", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("selectedDepthsが空の場合は$setColorSettingStateが呼ばれない", async () => {
            const emptySelectedDepths = new Map();
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: emptySelectedDepths,
                writable: true,
                configurable: true
            });
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setColorSettingState).not.toHaveBeenCalled();
        });
    });

    describe("beforeValueの設定", () => {
        it("様々な値でbeforeValueが正しく設定される - 0", async () => {
            mockElement.value = "0";
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(0);
        });

        it("様々な値でbeforeValueが正しく設定される - 1", async () => {
            mockElement.value = "1";
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(1);
        });

        it("様々な値でbeforeValueが正しく設定される - 0.25", async () => {
            mockElement.value = "0.25";
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(colorSetting.beforeValue).toBe(0.25);
        });

        it("様々な値でbeforeValueが正しく設定される - 0.333", async () => {
            mockElement.value = "0.333";
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(colorSetting.beforeValue).toBeCloseTo(0.333, 3);
        });
    });

    describe("複数選択時の動作", () => {
        it("複数のキャラクターが選択されている場合", async () => {
            const multiSelectedDepths = new Map([
                [0, [1, 2, 3]],
                [1, [4, 5]]
            ]);
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: multiSelectedDepths,
                writable: true,
                configurable: true
            });
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
            expect(mockElement.setPointerCapture).toHaveBeenCalled();
        });

        it("単一選択の場合も正常に動作する", async () => {
            const singleSelectedDepths = new Map([[0, [1]]]);
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: singleSelectedDepths,
                writable: true,
                configurable: true
            });
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });
    });

    describe("統合シナリオ", () => {
        it("完全なポインターダウンフロー", async () => {
            mockElement.value = "0.8";
            const mockEvent = createMockEvent(0, mockElement);
            (mockEvent as any).pointerId = 42;

            await execute(mockEvent);

            // 1. 早期リターンチェック
            expect(mockEvent.button).toBe(0);
            expect($activeTouchPointers.size).toBeLessThanOrEqual(1);

            // 2. イベント処理
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();

            // 3. メニューと編集要素
            expect(mock$allHideMenu).toHaveBeenCalled();
            expect(mock$setEditingElement).toHaveBeenCalledWith(null);

            // 4. カーソルとbeforeValue
            expect(mockElement.style.cursor).toBe("ew-resize");
            expect(colorSetting.beforeValue).toBe(0.8);

            // 5. ポインターキャプチャとイベントリスナー
            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(42);
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(4);

            // 6. 状態変更
            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("エラーケース: 右クリックでは何もしない", async () => {
            const mockEvent = createMockEvent(2, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
            expect(mock$setColorSettingState).not.toHaveBeenCalled();
        });

        it("エラーケース: マルチタッチでは何もしない", async () => {
            $activeTouchPointers.add(1);
            $activeTouchPointers.add(2);
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$setColorSettingState).not.toHaveBeenCalled();
        });

        it("エラーケース: キーボード使用中は一部処理のみ実行", async () => {
            mock$useKeyboard.mockReturnValue(true);
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
            expect(mock$setColorSettingState).not.toHaveBeenCalled();
        });
    });

    describe("$activeTouchPointersの依存", () => {
        it("$activeTouchPointersが空の場合は正常に動作する", async () => {
            $activeTouchPointers.clear();
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("$activeTouchPointersが1つの場合は正常に動作する", async () => {
            $activeTouchPointers.add(1);
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("$activeTouchPointersが2つ以上の場合は早期リターン", async () => {
            $activeTouchPointers.add(1);
            $activeTouchPointers.add(2);
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setColorSettingState).not.toHaveBeenCalled();
        });
    });

    describe("エッジケース", () => {
        it("beforeValueが文字列の数値として正しくパースされる", async () => {
            mockElement.value = "0.12345";
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(colorSetting.beforeValue).toBeCloseTo(0.12345, 5);
        });

        it("pointerIdが0の場合でも正常に動作する", async () => {
            const mockEvent = createMockEvent(0, mockElement);
            (mockEvent as any).pointerId = 0;

            await execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(0);
        });

        it("pointerIdが負の値でも動作する（理論上）", async () => {
            const mockEvent = createMockEvent(0, mockElement);
            (mockEvent as any).pointerId = -1;

            await execute(mockEvent);

            expect(mockElement.setPointerCapture).toHaveBeenCalledWith(-1);
        });
    });
});
