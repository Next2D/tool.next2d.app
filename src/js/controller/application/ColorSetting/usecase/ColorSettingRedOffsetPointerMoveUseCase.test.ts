import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";

const mock$getCurrentWorkSpace = vi.fn();
const mock$getColorSettingState = vi.fn();
const mock$setCursor = vi.fn();
const mock$clamp = vi.fn();
const mockColorSettingRedOffsetUpdateElementUseCase = vi.fn();

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

vi.mock("./ColorSettingRedOffsetUpdateElementUseCase", () => ({
    execute: (movieClip: MovieClip, value: number) => mockColorSettingRedOffsetUpdateElementUseCase(movieClip, value)
}));

const { execute } = await import("./ColorSettingRedOffsetPointerMoveUseCase");

describe("ColorSettingRedOffsetPointerMoveUseCase", () => {
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockElement: HTMLInputElement;
    let rafCallback: (() => void) | null = null;

    beforeEach(() => {
        vi.clearAllMocks();

        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "0";

        mockMovieClip = {} as MovieClip;
        mockWorkSpace = {
            scene: mockMovieClip
        } as WorkSpace;

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mock$getColorSettingState.mockReturnValue("down");
        mock$clamp.mockImplementation((value: number, min: number, max: number) => {
            return Math.max(min, Math.min(max, value));
        });

        // requestAnimationFrameのモック
        rafCallback = null;
        global.requestAnimationFrame = vi.fn((callback: () => void) => {
            rafCallback = callback;
            return 1;
        }) as any;
    });

    afterEach(() => {
        rafCallback = null;
    });

    describe("基本動作", () => {
        it("movementXが0の場合は早期リターン", () => {
            const mockEvent = {
                movementX: 0,
                target: mockElement,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            } as unknown as PointerEvent;

            execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("ew-resize");
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("movementXが存在する場合は処理が実行される", () => {
            const mockEvent = {
                movementX: 10,
                target: mockElement,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            } as unknown as PointerEvent;

            execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("ew-resize");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();

            // requestAnimationFrameのコールバックを実行
            if (rafCallback) {
                rafCallback();
            }

            expect(mockColorSettingRedOffsetUpdateElementUseCase).toHaveBeenCalled();
        });

        it("カラー設定の状態がupの場合は処理をスキップ", () => {
            mock$getColorSettingState.mockReturnValue("up");
            const mockEvent = {
                movementX: 10,
                target: mockElement,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            } as unknown as PointerEvent;

            execute(mockEvent);

            // requestAnimationFrameのコールバックを実行
            if (rafCallback) {
                rafCallback();
            }

            expect(mockColorSettingRedOffsetUpdateElementUseCase).not.toHaveBeenCalled();
        });
    });
});
