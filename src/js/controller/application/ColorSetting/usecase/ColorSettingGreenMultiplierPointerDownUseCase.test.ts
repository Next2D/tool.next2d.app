import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";

// モック関数の定義
const mock$getCurrentWorkSpace = vi.fn();
const mock$allHideMenu = vi.fn();
const mock$useKeyboard = vi.fn();
const mock$setColorSettingState = vi.fn();
const mock$setEditingElement = vi.fn();
const mockColorSettingGreenMultiplierPointerMoveUseCase = vi.fn();
const mockColorSettingGreenMultiplierPointerUpUseCase = vi.fn();

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

vi.mock("./ColorSettingGreenMultiplierPointerMoveUseCase", () => ({
    execute: mockColorSettingGreenMultiplierPointerMoveUseCase
}));

vi.mock("./ColorSettingGreenMultiplierPointerUpUseCase", () => ({
    execute: mockColorSettingGreenMultiplierPointerUpUseCase
}));

// 動的インポート
const { execute } = await import("./ColorSettingGreenMultiplierPointerDownUseCase");
const { colorSetting } = await import("@/controller/domain/model/ColorSetting");
const { $activeTouchPointers } = await import("@/global/GlobalUtil");

describe("ColorSettingGreenMultiplierPointerDownUseCase", () => {
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

        colorSetting.beforeValue = 0;

        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "50";
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

        $activeTouchPointers.clear();
    });

    describe("基本動作", () => {
        it("正常なポインターダウンで全ての処理が実行される", () => {
            const mockEvent = createMockEvent(0, mockElement);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mock$allHideMenu).toHaveBeenCalled();
            expect(mock$setEditingElement).toHaveBeenCalledWith(null);
            expect(mock$setColorSettingState).toHaveBeenCalledWith("down");
        });

        it("左ボタン以外のクリックでは早期リターン", () => {
            const mockEvent = createMockEvent(1, mockElement);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });

        it("複数タッチポイントがある場合は早期リターン", () => {
            $activeTouchPointers.add(1);
            $activeTouchPointers.add(2);
            const mockEvent = createMockEvent(0, mockElement);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("キーボード使用中は早期リターン", () => {
            mock$useKeyboard.mockReturnValue(true);
            const mockEvent = createMockEvent(0, mockElement);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$allHideMenu).not.toHaveBeenCalled();
        });

        it("selectedDepthsが空の場合は早期リターン", () => {
            mockMovieClip.selectedDepths = new Map();
            const mockEvent = createMockEvent(0, mockElement);

            execute(mockEvent);

            // selectedDepthsチェックでリターンするため、beforeValueは保存されない
            expect(colorSetting.beforeValue).toBe(0);
            // selectedDepthsチェックでリターンするため、colorSettingStateは設定されない
            expect(mock$setColorSettingState).not.toHaveBeenCalled();
        });
    });
});
