import { describe, it, expect, beforeEach, vi } from "vitest";

const mock$updateKeyLock = vi.fn();
const mock$clamp = vi.fn();
const mockColorSettingGreenMultiplierUpdateValueUseCase = vi.fn();

vi.mock("@/shortcut/ShortcutUtil", () => ({
    $updateKeyLock: (value: boolean) => mock$updateKeyLock(value)
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: (value: number, min: number, max: number) => mock$clamp(value, min, max)
}));

vi.mock("./ColorSettingGreenMultiplierUpdateValueUseCase", () => ({
    execute: async (green: number) => mockColorSettingGreenMultiplierUpdateValueUseCase(green)
}));

const { execute } = await import("./ColorSettingGreenMultiplierFocusOutEventUseCase");

describe("ColorSettingGreenMultiplierFocusOutEventUseCase", () => {
    let mockElement: HTMLInputElement;
    let mockEvent: FocusEvent;

    beforeEach(() => {
        vi.clearAllMocks();

        mockElement = document.createElement("input");
        mockElement.type = "number";
        mockElement.value = "50";

        mockEvent = {
            target: mockElement,
            stopPropagation: vi.fn()
        } as unknown as FocusEvent;

        mock$clamp.mockImplementation((value: number, min: number, max: number) => {
            return Math.max(min, Math.min(max, value));
        });

        mockColorSettingGreenMultiplierUpdateValueUseCase.mockResolvedValue(undefined);
    });

    describe("基本動作", () => {
        it("targetがnullの場合は早期リターン", async () => {
            mockEvent = {
                target: null,
                stopPropagation: vi.fn()
            } as unknown as FocusEvent;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("stopPropagationが呼ばれる", async () => {
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("$updateKeyLockがfalseで呼ばれる", async () => {
            await execute(mockEvent);

            expect(mock$updateKeyLock).toHaveBeenCalledWith(false);
        });

        it("colorSettingGreenMultiplierUpdateValueUseCaseが呼ばれる", async () => {
            mock$clamp.mockReturnValue(50);

            await execute(mockEvent);

            expect(mockColorSettingGreenMultiplierUpdateValueUseCase).toHaveBeenCalledWith(50);
        });
    });
});
