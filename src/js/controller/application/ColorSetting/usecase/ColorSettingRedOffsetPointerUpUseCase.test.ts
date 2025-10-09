import { describe, it, expect, beforeEach, vi } from "vitest";

const mock$setCursor = vi.fn();
const mock$setColorSettingState = vi.fn();

vi.mock("@/global/GlobalUtil", () => ({
    $setCursor: (cursor: string) => mock$setCursor(cursor)
}));

vi.mock("../ColorSettingUtil", () => ({
    $setColorSettingState: (state: string) => mock$setColorSettingState(state)
}));

vi.mock("./ColorSettingRedOffsetUpdateValueUseCase", () => ({
    execute: async () => vi.fn()
}));

const { execute } = await import("./ColorSettingRedOffsetPointerUpUseCase");

describe("ColorSettingRedOffsetPointerUpUseCase", () => {
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
        mockElement.value = "0";
        mockElement.releasePointerCapture = vi.fn();
        mockElement.removeEventListener = vi.fn();
        mockElement.focus = vi.fn();
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
    });
});
