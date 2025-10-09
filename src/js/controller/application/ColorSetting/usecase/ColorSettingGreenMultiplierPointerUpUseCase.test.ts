import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { EventType } from "@/tool/domain/event/EventType";

// モック関数の定義
const mock$setCursor = vi.fn();
const mock$setColorSettingState = vi.fn();
const mockColorSettingGreenMultiplierPointerMoveUseCase = vi.fn();
const mockColorSettingGreenMultiplierUpdateValueUseCase = vi.fn();

// vi.mockの呼び出し
vi.mock("@/global/GlobalUtil", () => ({
    $setCursor: (cursor: string) => mock$setCursor(cursor)
}));

vi.mock("../ColorSettingUtil", () => ({
    $setColorSettingState: (state: string) => mock$setColorSettingState(state)
}));

vi.mock("./ColorSettingGreenMultiplierPointerMoveUseCase", () => ({
    execute: mockColorSettingGreenMultiplierPointerMoveUseCase
}));

vi.mock("./ColorSettingGreenMultiplierUpdateValueUseCase", () => ({
    execute: async (value: number) => mockColorSettingGreenMultiplierUpdateValueUseCase(value)
}));

// 動的インポート
const { execute } = await import("./ColorSettingGreenMultiplierPointerUpUseCase");

describe("ColorSettingGreenMultiplierPointerUpUseCase", () => {
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

        it("releasePointerCaptureが呼ばれる", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(1);
        });

        it("イベントリスナーが削除される", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                EventType.POINTER_MOVE,
                mockColorSettingGreenMultiplierPointerMoveUseCase
            );
        });

        it("element.focusが呼ばれる", async () => {
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalled();
        });
    });
});
