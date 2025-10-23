import { describe, it, expect, beforeEach, vi } from "vitest";

const mock$getColorSettingState = vi.fn();
const mock$getCurrentWorkSpace = vi.fn();
const mockColorSettingGreenMultiplierUpdateElementUseCase = vi.fn();
const mock$clamp = vi.fn();
const mock$setCursor = vi.fn();

vi.mock("../ColorSettingUtil", () => ({
    $getColorSettingState: () => mock$getColorSettingState()
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("./ColorSettingGreenMultiplierUpdateElementUseCase", () => ({
    execute: (movieClip: any, value: number) => mockColorSettingGreenMultiplierUpdateElementUseCase(movieClip, value)
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: (value: number, min: number, max: number) => mock$clamp(value, min, max),
    $setCursor: (cursor: string) => mock$setCursor(cursor)
}));

const { execute } = await import("./ColorSettingGreenMultiplierPointerMoveUseCase");

describe("ColorSettingGreenMultiplierPointerMoveUseCase", () => {
    let mockElement: HTMLInputElement;
    let rafCallback: (() => void) | null = null;
    let mockMovieClip: any;
    let mockWorkSpace: any;

    const createMockEvent = (
        movementX: number = 5,
        target: HTMLInputElement | null = null
    ): PointerEvent => {
        return {
            movementX: movementX,
            target: target,
            stopPropagation: vi.fn(),
            preventDefault: vi.fn()
        } as unknown as PointerEvent;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockElement = document.createElement("input");
        mockElement.value = "50";

        mockMovieClip = { selectedDepths: new Map([[0, [1]]]) };
        mockWorkSpace = { scene: mockMovieClip };

        mock$getColorSettingState.mockReturnValue("down");
        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        mock$clamp.mockImplementation((value: number, min: number, max: number) => {
            return Math.min(Math.max(value, min), max);
        });

        rafCallback = null;
        global.requestAnimationFrame = vi.fn((callback: () => void) => {
            rafCallback = callback;
            return 1;
        }) as any;
    });

    describe("基本動作", () => {
        it("カーソルがew-resizeに設定される", async () => {
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("ew-resize");
        });

        it("movementXが0の場合は早期リターン", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("要素のvalueが更新される", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(10, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("60");
        });
    });
});
