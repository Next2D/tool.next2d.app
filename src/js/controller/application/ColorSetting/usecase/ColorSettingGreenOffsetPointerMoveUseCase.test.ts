import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";

const mock$getCurrentWorkSpace = vi.fn();
const mock$getColorSettingState = vi.fn();
const mock$setCursor = vi.fn();
const mock$clamp = vi.fn();
const mockColorSettingGreenOffsetUpdateElementUseCase = vi.fn();

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("../ColorSettingUtil", () => ({
    $getColorSettingState: () => mock$getColorSettingState()
}));

vi.mock("@/global/GlobalUtil", () => ({
    $setCursor: (cursor: string) => mock$setCursor(cursor),
    $clamp: (value: number, min: number, max: number) => mock$clamp(value, min, max)
}));

vi.mock("./ColorSettingGreenOffsetUpdateElementUseCase", () => ({
    execute: (movieClip: MovieClip, green: number) => mockColorSettingGreenOffsetUpdateElementUseCase(movieClip, green)
}));

const { execute } = await import("./ColorSettingGreenOffsetPointerMoveUseCase");

describe("ColorSettingGreenOffsetPointerMoveUseCase", () => {
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockElement: HTMLInputElement;

    const createMockEvent = (movementX: number = 10): PointerEvent => {
        return {
            movementX: movementX,
            target: mockElement,
            stopPropagation: vi.fn(),
            preventDefault: vi.fn()
        } as unknown as PointerEvent;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "0";

        mockMovieClip = {} as unknown as MovieClip;
        mockWorkSpace = {
            scene: mockMovieClip
        } as unknown as WorkSpace;

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mock$getColorSettingState.mockReturnValue("down");
        mock$clamp.mockImplementation((value: number, min: number, max: number) => {
            return Math.max(min, Math.min(max, value));
        });
    });

    describe("基本動作", () => {
        it("カーソルがew-resizeに設定される", () => {
            const mockEvent = createMockEvent(10);

            execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("ew-resize");
        });

        it("movementXが0の場合は早期リターン", () => {
            const mockEvent = createMockEvent(0);

            execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("stopPropagationとpreventDefaultが呼ばれる", () => {
            const mockEvent = createMockEvent(10);

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });
    });
});
