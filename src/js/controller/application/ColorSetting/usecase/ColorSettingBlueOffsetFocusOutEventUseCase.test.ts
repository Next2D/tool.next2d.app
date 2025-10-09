import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// モック関数の定義
const mock$updateKeyLock = vi.fn();
const mock$clamp = vi.fn();
const mockColorSettingBlueOffsetUpdateValueUseCase = vi.fn();

// vi.mockの呼び出し
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $updateKeyLock: (value: boolean) => mock$updateKeyLock(value)
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: (value: number, min: number, max: number) => mock$clamp(value, min, max)
}));

vi.mock("./ColorSettingBlueOffsetUpdateValueUseCase", () => ({
    execute: async (blue: number) => mockColorSettingBlueOffsetUpdateValueUseCase(blue)
}));

// 動的インポート
const { execute } = await import("./ColorSettingBlueOffsetFocusOutEventUseCase");

describe("ColorSettingBlueOffsetFocusOutEventUseCase", () => {
    let mockElement: HTMLInputElement;
    let mockEvent: FocusEvent;

    beforeEach(() => {
        vi.clearAllMocks();

        // モックelement
        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "0";

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
        mockColorSettingBlueOffsetUpdateValueUseCase.mockResolvedValue(undefined);
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
            mockElement.value = "50";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(50, -255, 255);
        });

        it("colorSettingBlueOffsetUpdateValueUseCaseが呼ばれる", async () => {
            mock$clamp.mockReturnValue(0);

            await execute(mockEvent);

            expect(mockColorSettingBlueOffsetUpdateValueUseCase).toHaveBeenCalledWith(0);
            expect(mockColorSettingBlueOffsetUpdateValueUseCase).toHaveBeenCalledTimes(1);
        });
    });

    describe("値の解析とクランプ", () => {
        it("整数値が正しく解析される", async () => {
            mockElement.value = "100";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(100, -255, 255);
        });

        it("-255の値が正しく処理される (type='number'で負の値を許容)", async () => {
            mockElement.type = "number";
            mockElement.value = "-255";
            mock$clamp.mockReturnValue(-255);

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(-255, -255, 255);
            expect(mockColorSettingBlueOffsetUpdateValueUseCase).toHaveBeenCalledWith(-255);
        });

        it("255の値が正しく処理される (type='number'で範囲外の値を許容)", async () => {
            mockElement.type = "number";
            mockElement.value = "255";
            mock$clamp.mockReturnValue(255);

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(255, -255, 255);
            expect(mockColorSettingBlueOffsetUpdateValueUseCase).toHaveBeenCalledWith(255);
        });

        it("type='range'の場合、負の値は0に正規化される", async () => {
            mockElement.type = "range";
            mockElement.value = "-255";
            mock$clamp.mockReturnValue(0);

            await execute(mockEvent);

            // type="range"の場合、-255は自動的に0に正規化される
            expect(mock$clamp).toHaveBeenCalledWith(0, -255, 255);
            expect(mockColorSettingBlueOffsetUpdateValueUseCase).toHaveBeenCalledWith(0);
        });

        it("type='range'の場合、最大値を超える値は最大値に正規化される", async () => {
            mockElement.type = "range";
            mockElement.value = "255";
            mock$clamp.mockReturnValue(100);

            await execute(mockEvent);

            // type="range"の場合、範囲は0-100なので255は100に正規化される
            expect(mock$clamp).toHaveBeenCalledWith(100, -255, 255);
            expect(mockColorSettingBlueOffsetUpdateValueUseCase).toHaveBeenCalledWith(100);
        });
    });
});
