import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// モック関数の定義
const mock$updateKeyLock = vi.fn();
const mock$clamp = vi.fn();
const mockColorSettingBlueMultiplierUpdateValueUseCase = vi.fn();

// vi.mockの呼び出し
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $updateKeyLock: (value: boolean) => mock$updateKeyLock(value)
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: (value: number, min: number, max: number) => mock$clamp(value, min, max)
}));

vi.mock("./ColorSettingBlueMultiplierUpdateValueUseCase", () => ({
    execute: async (blue: number) => mockColorSettingBlueMultiplierUpdateValueUseCase(blue)
}));

// 動的インポート
const { execute } = await import("./ColorSettingBlueMultiplierFocusOutEventUseCase");

describe("ColorSettingBlueMultiplierFocusOutEventUseCase", () => {
    let mockElement: HTMLInputElement;
    let mockEvent: FocusEvent;

    beforeEach(() => {
        vi.clearAllMocks();

        // モックelement
        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "50";

        // モックFocusEvent
        mockEvent = {
            target: mockElement,
            stopPropagation: vi.fn()
        } as unknown as FocusEvent;

        // デフォルトのclampの動作をモック
        mock$clamp.mockImplementation((value: number, min: number, max: number) => {
            return Math.max(min, Math.min(max, value));
        });

        // デフォルトのUpdateValueUseCaseの動作をモック
        mockColorSettingBlueMultiplierUpdateValueUseCase.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("基本動作", () => {
        it("targetがnullの場合は早期リターン", async () => {
            mockEvent = {
                target: null,
                stopPropagation: vi.fn()
            } as unknown as FocusEvent;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$updateKeyLock).not.toHaveBeenCalled();
        });

        it("stopPropagationが呼ばれる", async () => {
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("$updateKeyLockがfalseで呼ばれる", async () => {
            await execute(mockEvent);

            expect(mock$updateKeyLock).toHaveBeenCalledWith(false);
            expect(mock$updateKeyLock).toHaveBeenCalledTimes(1);
        });

        it("$clampが正しいパラメータで呼ばれる", async () => {
            mockElement.value = "75";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(75, 0, 100);
        });

        it("colorSettingBlueMultiplierUpdateValueUseCaseが呼ばれる", async () => {
            mock$clamp.mockReturnValue(50);

            await execute(mockEvent);

            expect(mockColorSettingBlueMultiplierUpdateValueUseCase).toHaveBeenCalledWith(50);
            expect(mockColorSettingBlueMultiplierUpdateValueUseCase).toHaveBeenCalledTimes(1);
        });
    });

    describe("値の解析とクランプ", () => {
        it("整数値が正しく解析される", async () => {
            mockElement.value = "60";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(60, 0, 100);
        });

        it("0の値が正しく処理される", async () => {
            mockElement.value = "0";
            mock$clamp.mockReturnValue(0);

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(0, 0, 100);
            expect(mockColorSettingBlueMultiplierUpdateValueUseCase).toHaveBeenCalledWith(0);
        });

        it("100の値が正しく処理される", async () => {
            mockElement.value = "100";
            mock$clamp.mockReturnValue(100);

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(100, 0, 100);
            expect(mockColorSettingBlueMultiplierUpdateValueUseCase).toHaveBeenCalledWith(100);
        });
    });
});
