import { describe, it, expect, beforeEach, vi } from "vitest";

const mock$setColorSettingState = vi.fn();
const mock$setCursor = vi.fn();
const mockColorSettingGreenOffsetUpdateValueUseCase = vi.fn();

vi.mock("../ColorSettingUtil", () => ({
    $setColorSettingState: (state: string) => mock$setColorSettingState(state)
}));

vi.mock("@/global/GlobalUtil", () => ({
    $setCursor: (cursor: string) => mock$setCursor(cursor)
}));

vi.mock("./ColorSettingGreenOffsetPointerMoveUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("./ColorSettingGreenOffsetUpdateValueUseCase", () => ({
    execute: async (green: number) => mockColorSettingGreenOffsetUpdateValueUseCase(green)
}));

const { execute } = await import("./ColorSettingGreenOffsetPointerUpUseCase");

describe("ColorSettingGreenOffsetPointerUpUseCase", () => {
    let mockElement: HTMLInputElement;

    const createMockEvent = (): PointerEvent => {
        return {
            target: mockElement,
            pointerId: 1,
            stopPropagation: vi.fn()
        } as unknown as PointerEvent;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "50";
        mockElement.releasePointerCapture = vi.fn();
        mockElement.removeEventListener = vi.fn();
        mockElement.focus = vi.fn();

        mockColorSettingGreenOffsetUpdateValueUseCase.mockResolvedValue(undefined);
    });

    describe("基本動作", () => {
        it("targetがnullの場合は早期リターン", async () => {
            const mockEvent = {
                target: null,
                stopPropagation: vi.fn()
            } as unknown as PointerEvent;

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("up");
            expect(mock$setCursor).toHaveBeenCalledWith("auto");
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("カラー設定の状態が'up'に変更される", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mock$setColorSettingState).toHaveBeenCalledWith("up");
        });

        it("カーソルが'auto'に設定される", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("auto");
        });

        it("stopPropagationが呼ばれる", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("releasePointerCaptureが呼ばれる", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(1);
        });

        it("イベントリスナーが削除される", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
        });

        it("colorSettingGreenOffsetUpdateValueUseCaseが呼ばれる", async () => {
            const mockEvent = createMockEvent();
            mockElement.value = "75";

            await execute(mockEvent);

            expect(mockColorSettingGreenOffsetUpdateValueUseCase).toHaveBeenCalledWith(75);
        });

        it("input要素にフォーカスされる", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalledTimes(1);
        });
    });

    describe("値の処理", () => {
        it("値が整数に変換される (ビット演算)", async () => {
            const mockEvent = createMockEvent();
            mockElement.value = "50.7";

            await execute(mockEvent);

            expect(mockColorSettingGreenOffsetUpdateValueUseCase).toHaveBeenCalledWith(50);
        });

        it("負の値が正しく処理される", async () => {
            const mockEvent = createMockEvent();
            mockElement.type = "number";
            mockElement.value = "-100";

            await execute(mockEvent);

            expect(mockColorSettingGreenOffsetUpdateValueUseCase).toHaveBeenCalledWith(-100);
        });
    });
});
