import { describe, it, expect, beforeEach, vi } from "vitest";

const mockColorSettingInputPointerOverEventService = vi.fn();
const mockColorSettingInputPointerOutEventService = vi.fn();
const mockColorSettingInputFocusInEventService = vi.fn();
const mockColorSettingInputKeyPressEventService = vi.fn();
const mockColorSettingAlphaMultiplierPointerDownUseCase = vi.fn();
const mockColorSettingAlphaMultiplierFocusOutEventUseCase = vi.fn();
const mockColorSettingAlphaOffsetPointerDownUseCase = vi.fn();
const mockColorSettingAlphaOffsetFocusOutEventUseCase = vi.fn();
const mockColorSettingRedMultiplierPointerDownUseCase = vi.fn();
const mockColorSettingRedMultiplierFocusOutEventUseCase = vi.fn();
const mockColorSettingRedOffsetPointerDownUseCase = vi.fn();
const mockColorSettingRedOffsetFocusOutEventUseCase = vi.fn();
const mockColorSettingGreenMultiplierPointerDownUseCase = vi.fn();
const mockColorSettingGreenMultiplierFocusOutEventUseCase = vi.fn();
const mockColorSettingGreenOffsetPointerDownUseCase = vi.fn();
const mockColorSettingGreenOffsetFocusOutEventUseCase = vi.fn();
const mockColorSettingBlueMultiplierPointerDownUseCase = vi.fn();
const mockColorSettingBlueMultiplierFocusOutEventUseCase = vi.fn();
const mockColorSettingBlueOffsetPointerDownUseCase = vi.fn();
const mockColorSettingBlueOffsetFocusOutEventUseCase = vi.fn();

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

vi.mock("./ColorSettingAlphaMultiplierPointerDownUseCase", () => ({
    execute: mockColorSettingAlphaMultiplierPointerDownUseCase
}));

vi.mock("./ColorSettingAlphaMultiplierFocusOutEventUseCase", () => ({
    execute: mockColorSettingAlphaMultiplierFocusOutEventUseCase
}));

vi.mock("./ColorSettingAlphaOffsetPointerDownUseCase", () => ({
    execute: mockColorSettingAlphaOffsetPointerDownUseCase
}));

vi.mock("./ColorSettingAlphaOffsetFocusOutEventUseCase", () => ({
    execute: mockColorSettingAlphaOffsetFocusOutEventUseCase
}));

vi.mock("./ColorSettingRedMultiplierPointerDownUseCase", () => ({
    execute: mockColorSettingRedMultiplierPointerDownUseCase
}));

vi.mock("./ColorSettingRedMultiplierFocusOutEventUseCase", () => ({
    execute: mockColorSettingRedMultiplierFocusOutEventUseCase
}));

vi.mock("./ColorSettingRedOffsetPointerDownUseCase", () => ({
    execute: mockColorSettingRedOffsetPointerDownUseCase
}));

vi.mock("./ColorSettingRedOffsetFocusOutEventUseCase", () => ({
    execute: mockColorSettingRedOffsetFocusOutEventUseCase
}));

vi.mock("./ColorSettingGreenMultiplierPointerDownUseCase", () => ({
    execute: mockColorSettingGreenMultiplierPointerDownUseCase
}));

vi.mock("./ColorSettingGreenMultiplierFocusOutEventUseCase", () => ({
    execute: mockColorSettingGreenMultiplierFocusOutEventUseCase
}));

vi.mock("./ColorSettingGreenOffsetPointerDownUseCase", () => ({
    execute: mockColorSettingGreenOffsetPointerDownUseCase
}));

vi.mock("./ColorSettingGreenOffsetFocusOutEventUseCase", () => ({
    execute: mockColorSettingGreenOffsetFocusOutEventUseCase
}));

vi.mock("./ColorSettingBlueMultiplierPointerDownUseCase", () => ({
    execute: mockColorSettingBlueMultiplierPointerDownUseCase
}));

vi.mock("./ColorSettingBlueMultiplierFocusOutEventUseCase", () => ({
    execute: mockColorSettingBlueMultiplierFocusOutEventUseCase
}));

vi.mock("./ColorSettingBlueOffsetPointerDownUseCase", () => ({
    execute: mockColorSettingBlueOffsetPointerDownUseCase
}));

vi.mock("./ColorSettingBlueOffsetFocusOutEventUseCase", () => ({
    execute: mockColorSettingBlueOffsetFocusOutEventUseCase
}));

vi.mock("@/config/ColorSettingConfig", () => ({
    $COLOR_ALPHA_MULTIPLIER_ID: "color-alpha-multiplier",
    $COLOR_ALPHA_OFFSET_ID: "color-alpha-offset",
    $COLOR_RED_MULTIPLIER_ID: "color-red-multiplier",
    $COLOR_RED_OFFSET_ID: "color-red-offset",
    $COLOR_GREEN_MULTIPLIER_ID: "color-green-multiplier",
    $COLOR_GREEN_OFFSET_ID: "color-green-offset",
    $COLOR_BLUE_MULTIPLIER_ID: "color-blue-multiplier",
    $COLOR_BLUE_OFFSET_ID: "color-blue-offset"
}));

const { execute } = await import("./ColorSettingInitializeRegisterEventUseCase");

describe("ColorSettingInitializeRegisterEventUseCase", () => {
    let elements: {
        alphaMultiplier: HTMLInputElement;
        alphaOffset: HTMLInputElement;
        redMultiplier: HTMLInputElement;
        redOffset: HTMLInputElement;
        greenMultiplier: HTMLInputElement;
        greenOffset: HTMLInputElement;
        blueMultiplier: HTMLInputElement;
        blueOffset: HTMLInputElement;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // 全ての要素を作成
        elements = {
            alphaMultiplier: document.createElement("input"),
            alphaOffset: document.createElement("input"),
            redMultiplier: document.createElement("input"),
            redOffset: document.createElement("input"),
            greenMultiplier: document.createElement("input"),
            greenOffset: document.createElement("input"),
            blueMultiplier: document.createElement("input"),
            blueOffset: document.createElement("input")
        };

        // IDを設定
        elements.alphaMultiplier.id = "color-alpha-multiplier";
        elements.alphaOffset.id = "color-alpha-offset";
        elements.redMultiplier.id = "color-red-multiplier";
        elements.redOffset.id = "color-red-offset";
        elements.greenMultiplier.id = "color-green-multiplier";
        elements.greenOffset.id = "color-green-offset";
        elements.blueMultiplier.id = "color-blue-multiplier";
        elements.blueOffset.id = "color-blue-offset";

        // DOMに追加
        Object.values(elements).forEach(el => {
            el.addEventListener = vi.fn();
            document.body.appendChild(el);
        });
    });

    afterEach(() => {
        Object.values(elements).forEach(el => {
            if (el.parentNode) {
                document.body.removeChild(el);
            }
        });
    });

    describe("基本動作", () => {
        it("全ての要素にイベントリスナーが登録される", () => {
            execute();

            Object.values(elements).forEach(element => {
                expect(element.addEventListener).toHaveBeenCalled();
                // 各要素に6つのイベントリスナーが登録される（pointerover, pointerout, pointerdown, focusin, focusout, keypress）
                expect(element.addEventListener).toHaveBeenCalledTimes(6);
            });
        });

        it("要素が存在しない場合でもエラーが発生しない", () => {
            // 全ての要素を削除
            Object.values(elements).forEach(el => {
                document.body.removeChild(el);
            });

            expect(() => execute()).not.toThrow();
        });
    });

    describe("Alpha Multiplier要素", () => {
        it("正しいイベントハンドラーが登録される", () => {
            execute();

            expect(elements.alphaMultiplier.addEventListener).toHaveBeenCalledWith(
                "pointerover",
                mockColorSettingInputPointerOverEventService
            );
            expect(elements.alphaMultiplier.addEventListener).toHaveBeenCalledWith(
                "pointerout",
                mockColorSettingInputPointerOutEventService
            );
            expect(elements.alphaMultiplier.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockColorSettingAlphaMultiplierPointerDownUseCase,
                { "passive": false }
            );
            expect(elements.alphaMultiplier.addEventListener).toHaveBeenCalledWith(
                "focusin",
                mockColorSettingInputFocusInEventService
            );
            expect(elements.alphaMultiplier.addEventListener).toHaveBeenCalledWith(
                "focusout",
                mockColorSettingAlphaMultiplierFocusOutEventUseCase
            );
            expect(elements.alphaMultiplier.addEventListener).toHaveBeenCalledWith(
                "keypress",
                mockColorSettingInputKeyPressEventService
            );
        });
    });

    describe("Blue Multiplier要素", () => {
        it("正しいイベントハンドラーが登録される", () => {
            execute();

            expect(elements.blueMultiplier.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockColorSettingBlueMultiplierPointerDownUseCase,
                { "passive": false }
            );
            expect(elements.blueMultiplier.addEventListener).toHaveBeenCalledWith(
                "focusout",
                mockColorSettingBlueMultiplierFocusOutEventUseCase
            );
        });
    });

    describe("Blue Offset要素", () => {
        it("正しいイベントハンドラーが登録される", () => {
            execute();

            expect(elements.blueOffset.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockColorSettingBlueOffsetPointerDownUseCase,
                { "passive": false }
            );
            expect(elements.blueOffset.addEventListener).toHaveBeenCalledWith(
                "focusout",
                mockColorSettingBlueOffsetFocusOutEventUseCase
            );
        });
    });
});
