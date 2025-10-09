import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { EventType } from "@/tool/domain/event/EventType";

// vi.hoistedを使用してモック関数を定義
const {
    mockColorSettingInputPointerOverEventService,
    mockColorSettingInputPointerOutEventService,
    mockColorSettingInputFocusInEventService,
    mockColorSettingInputKeyPressEventService
} = vi.hoisted(() => {
    return {
        mockColorSettingInputPointerOverEventService: vi.fn(),
        mockColorSettingInputPointerOutEventService: vi.fn(),
        mockColorSettingInputFocusInEventService: vi.fn(),
        mockColorSettingInputKeyPressEventService: vi.fn()
    };
});

// vi.mockの呼び出し
vi.mock("../service/ColorSettingInputPointerOverEventService", () => ({
    execute: mockColorSettingInputPointerOverEventService
}));

vi.mock("../service/ColorSettingInputPointerOutEventService", () => ({
    execute: mockColorSettingInputPointerOutEventService
}));

vi.mock("../service/ColorSettingInputFocusInEventService", () => ({
    execute: mockColorSettingInputFocusInEventService
}));

vi.mock("../service/ColorSettingInputKeyPressEventService", () => ({
    execute: mockColorSettingInputKeyPressEventService
}));

vi.mock("./ColorSettingAlphaMultiplierPointerDownUseCase", () => ({ execute: vi.fn() }));
vi.mock("./ColorSettingAlphaMultiplierFocusOutEventUseCase", () => ({ execute: vi.fn() }));
vi.mock("./ColorSettingAlphaOffsetPointerDownUseCase", () => ({ execute: vi.fn() }));
vi.mock("./ColorSettingAlphaOffsetFocusOutEventUseCase", () => ({ execute: vi.fn() }));
vi.mock("./ColorSettingRedMultiplierPointerDownUseCase", () => ({ execute: vi.fn() }));
vi.mock("./ColorSettingRedMultiplierFocusOutEventUseCase", () => ({ execute: vi.fn() }));
vi.mock("./ColorSettingRedOffsetPointerDownUseCase", () => ({ execute: vi.fn() }));
vi.mock("./ColorSettingRedOffsetFocusOutEventUseCase", () => ({ execute: vi.fn() }));
vi.mock("./ColorSettingGreenMultiplierPointerDownUseCase", () => ({ execute: vi.fn() }));
vi.mock("./ColorSettingGreenMultiplierFocusOutEventUseCase", () => ({ execute: vi.fn() }));

vi.mock("@/config/ColorSettingConfig", () => ({
    $COLOR_SETTING_ID: "color-setting",
    $COLOR_ALPHA_MULTIPLIER_ID: "color-alpha-multiplier",
    $COLOR_ALPHA_OFFSET_ID: "color-alpha-offset",
    $COLOR_RED_MULTIPLIER_ID: "color-red-multiplier",
    $COLOR_RED_OFFSET_ID: "color-red-offset",
    $COLOR_GREEN_MULTIPLIER_ID: "color-green-multiplier",
    $COLOR_GREEN_OFFSET_ID: "color-green-offset",
    $COLOR_BLUE_MULTIPLIER_ID: "color-blue-multiplier",
    $COLOR_BLUE_OFFSET_ID: "color-blue-offset"
}));

// 動的インポート
const { execute } = await import("./ColorSettingInitializeRegisterEventUseCase");

describe("ColorSettingInitializeRegisterEventUseCase", () => {
    let mockGreenMultiplierElement: HTMLInputElement;

    beforeEach(() => {
        vi.clearAllMocks();

        // greenMultiplier要素のみを作成
        mockGreenMultiplierElement = document.createElement("input");
        mockGreenMultiplierElement.id = "color-green-multiplier";
        mockGreenMultiplierElement.addEventListener = vi.fn();
        document.body.appendChild(mockGreenMultiplierElement);
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    describe("基本動作", () => {
        it("greenMultiplier要素にイベントリスナーが登録される", () => {
            execute();

            expect(mockGreenMultiplierElement.addEventListener).toHaveBeenCalled();
        });

        it("greenMultiplier要素にPOINTER_OVERイベントが登録される", () => {
            execute();

            expect(mockGreenMultiplierElement.addEventListener).toHaveBeenCalledWith(
                EventType.POINTER_OVER,
                mockColorSettingInputPointerOverEventService
            );
        });

        it("要素が存在しない場合はエラーが発生しない", () => {
            document.body.innerHTML = "";

            expect(() => execute()).not.toThrow();
        });
    });
});
