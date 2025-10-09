import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";

const mock$getCurrentWorkSpace = vi.fn();
const mock$allHideMenu = vi.fn();
const mock$useKeyboard = vi.fn();
const mock$setColorSettingState = vi.fn();
const mock$setEditingElement = vi.fn();
const mockColorSettingBlueOffsetPointerMoveUseCase = vi.fn();
const mockColorSettingBlueOffsetPointerUpUseCase = vi.fn();

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

vi.mock("./ColorSettingBlueOffsetPointerMoveUseCase", () => ({
    execute: mockColorSettingBlueOffsetPointerMoveUseCase
}));

vi.mock("./ColorSettingBlueOffsetPointerUpUseCase", () => ({
    execute: mockColorSettingBlueOffsetPointerUpUseCase
}));

const { execute } = await import("./ColorSettingBlueOffsetPointerDownUseCase");
const { colorSetting } = await import("@/controller/domain/model/ColorSetting");
const { $activeTouchPointers } = await import("@/global/GlobalUtil");

describe("ColorSettingBlueOffsetPointerDownUseCase", () => {
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
        mockElement.value = "0";
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
    });
});
