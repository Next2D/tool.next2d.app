import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";

// モック関数の定義
const mock$getCurrentWorkSpace = vi.fn();
const mock$getColorSettingState = vi.fn();
const mock$setCursor = vi.fn();
const mock$clamp = vi.fn();
const mockColorSettingGreenMultiplierUpdateElementUseCase = vi.fn();

// vi.mockの呼び出し
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

vi.mock("./ColorSettingGreenMultiplierUpdateElementUseCase", () => ({
    execute: (movieClip: MovieClip, value: number) => mockColorSettingGreenMultiplierUpdateElementUseCase(movieClip, value)
}));

// 動的インポート
const { execute } = await import("./ColorSettingGreenMultiplierPointerMoveUseCase");

describe("ColorSettingGreenMultiplierPointerMoveUseCase", () => {
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockElement: HTMLInputElement;

    beforeEach(() => {
        vi.clearAllMocks();

        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "50";

        mockMovieClip = {} as MovieClip;
        mockWorkSpace = {
            scene: mockMovieClip
        } as WorkSpace;

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mock$getColorSettingState.mockReturnValue("down");
        mock$clamp.mockImplementation((value: number, min: number, max: number) => {
            return Math.max(min, Math.min(max, value));
        });
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
        });

        it("カラー設定の状態がupの場合は処理をスキップ", (done) => {
            mock$getColorSettingState.mockReturnValue("up");
            const mockEvent = {
                movementX: 10,
                target: mockElement,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            } as unknown as PointerEvent;

            execute(mockEvent);

            setTimeout(() => {
                expect(mockColorSettingGreenMultiplierUpdateElementUseCase).not.toHaveBeenCalled();
                done();
            }, 50);
        });
    });
});
