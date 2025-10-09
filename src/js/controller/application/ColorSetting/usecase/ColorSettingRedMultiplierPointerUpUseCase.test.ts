import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

const mock$setCursor = vi.fn();
const mock$setColorSettingState = vi.fn();
const mockColorSettingRedMultiplierUpdateValueUseCase = vi.fn();

vi.mock("@/global/GlobalUtil", () => ({
    $setCursor: (cursor: string) => mock$setCursor(cursor)
}));

vi.mock("../ColorSettingUtil", () => ({
    $setColorSettingState: (state: string) => mock$setColorSettingState(state)
}));

vi.mock("./ColorSettingRedMultiplierUpdateValueUseCase", () => ({
    execute: async (value: number) => mockColorSettingRedMultiplierUpdateValueUseCase(value)
}));

const { execute } = await import("./ColorSettingRedMultiplierPointerUpUseCase");

describe("ColorSettingRedMultiplierPointerUpUseCase", () => {
    let mockElement: HTMLInputElement;

    const createMockEvent = (
        pointerId: number = 1,
        target: HTMLInputElement | null = null
    ): PointerEvent => {
        return {
            pointerId: pointerId,
            target: target,
            stopPropagation: vi.fn()
        } as unknown as PointerEvent;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "75";
        mockElement.releasePointerCapture = vi.fn();
        mockElement.removeEventListener = vi.fn();
        mockElement.focus = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("基本動作", () => {
        it("colorSettingStateが'up'に設定される", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("up");
        });

        it("カーソルが'auto'に設定される", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("auto");
        });

        it("event.targetがnullの場合は早期リターン", async () => {
            const mockEvent = createMockEvent(1, null);

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("up");
            expect(mock$setCursor).toHaveBeenCalledWith("auto");
            expect(mockElement.releasePointerCapture).not.toHaveBeenCalled();
        });
    });
});
