import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { EventType } from "@/tool/domain/event/EventType";

// モック関数の定義
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

vi.mock("@/config/ColorSettingConfig", () => ({
    $COLOR_ALPHA_MULTIPLIER_ID: "color-alpha-multiplier",
    $COLOR_ALPHA_OFFSET_ID: "color-alpha-offset",
    $COLOR_RED_MULTIPLIER_ID: "color-red-multiplier",
    $COLOR_RED_OFFSET_ID: "color-red-offset",
    $COLOR_GREEN_MULTIPLIER_ID: "color-green-multiplier"
}));

// 動的インポート
const { execute } = await import("./ColorSettingInitializeRegisterEventUseCase");

describe("ColorSettingInitializeRegisterEventUseCase", () => {
    let mockAlphaMultiplierElement: HTMLInputElement;
    let mockAlphaOffsetElement: HTMLInputElement;
    let mockRedMultiplierElement: HTMLInputElement;
    let mockRedOffsetElement: HTMLInputElement;
    let mockGreenMultiplierElement: HTMLInputElement;

    beforeEach(() => {
        vi.clearAllMocks();

        // DOM要素を作成してbodyに追加
        mockAlphaMultiplierElement = document.createElement("input");
        mockAlphaMultiplierElement.id = "color-alpha-multiplier";
        mockAlphaMultiplierElement.addEventListener = vi.fn();
        document.body.appendChild(mockAlphaMultiplierElement);

        mockAlphaOffsetElement = document.createElement("input");
        mockAlphaOffsetElement.id = "color-alpha-offset";
        mockAlphaOffsetElement.addEventListener = vi.fn();
        document.body.appendChild(mockAlphaOffsetElement);

        mockRedMultiplierElement = document.createElement("input");
        mockRedMultiplierElement.id = "color-red-multiplier";
        mockRedMultiplierElement.addEventListener = vi.fn();
        document.body.appendChild(mockRedMultiplierElement);

        mockRedOffsetElement = document.createElement("input");
        mockRedOffsetElement.id = "color-red-offset";
        mockRedOffsetElement.addEventListener = vi.fn();
        document.body.appendChild(mockRedOffsetElement);

        mockGreenMultiplierElement = document.createElement("input");
        mockGreenMultiplierElement.id = "color-green-multiplier";
        mockGreenMultiplierElement.addEventListener = vi.fn();
        document.body.appendChild(mockGreenMultiplierElement);
    });

    afterEach(() => {
        // 作成したDOM要素をクリーンアップ
        document.body.innerHTML = "";
    });

    describe("基本動作", () => {
        it("全ての要素にイベントリスナーが登録される", () => {
            execute();

            expect(mockAlphaMultiplierElement.addEventListener).toHaveBeenCalled();
            expect(mockAlphaOffsetElement.addEventListener).toHaveBeenCalled();
            expect(mockRedMultiplierElement.addEventListener).toHaveBeenCalled();
            expect(mockRedOffsetElement.addEventListener).toHaveBeenCalled();
            expect(mockGreenMultiplierElement.addEventListener).toHaveBeenCalled();
        });

        it("greenMultiplier要素にPOINTER_OVERイベントが登録される", () => {
            execute();

            expect(mockGreenMultiplierElement.addEventListener).toHaveBeenCalledWith(
                EventType.POINTER_OVER,
                mockColorSettingInputPointerOverEventService
            );
        });

        it("greenMultiplier要素にPOINTER_OUTイベントが登録される", () => {
            execute();

            expect(mockGreenMultiplierElement.addEventListener).toHaveBeenCalledWith(
                EventType.POINTER_OUT,
                mockColorSettingInputPointerOutEventService
            );
        });

        it("要素が存在しない場合はエラーが発生しない", () => {
            document.body.innerHTML = "";

            expect(() => execute()).not.toThrow();
        });
    });

    describe("各要素へのイベント登録", () => {
        it("alphaMultiplier要素に全イベントが登録される", () => {
            execute();

            const calls = (mockAlphaMultiplierElement.addEventListener as any).mock.calls;
            const eventTypes = calls.map((call: any[]) => call[0]);

            expect(eventTypes).toContain(EventType.POINTER_OVER);
            expect(eventTypes).toContain(EventType.POINTER_OUT);
            expect(eventTypes).toContain(EventType.POINTER_DOWN);
            expect(eventTypes).toContain("focusin");
            expect(eventTypes).toContain("focusout");
            expect(eventTypes).toContain("keypress");
        });

        it("alphaOffset要素に全イベントが登録される", () => {
            execute();

            const calls = (mockAlphaOffsetElement.addEventListener as any).mock.calls;
            const eventTypes = calls.map((call: any[]) => call[0]);

            expect(eventTypes).toContain(EventType.POINTER_OVER);
            expect(eventTypes).toContain(EventType.POINTER_OUT);
            expect(eventTypes).toContain(EventType.POINTER_DOWN);
            expect(eventTypes).toContain("focusin");
            expect(eventTypes).toContain("focusout");
            expect(eventTypes).toContain("keypress");
        });

        it("redMultiplier要素に全イベントが登録される", () => {
            execute();

            const calls = (mockRedMultiplierElement.addEventListener as any).mock.calls;
            const eventTypes = calls.map((call: any[]) => call[0]);

            expect(eventTypes).toContain(EventType.POINTER_OVER);
            expect(eventTypes).toContain(EventType.POINTER_OUT);
            expect(eventTypes).toContain(EventType.POINTER_DOWN);
            expect(eventTypes).toContain("focusin");
            expect(eventTypes).toContain("focusout");
            expect(eventTypes).toContain("keypress");
        });

        it("redOffset要素に全イベントが登録される", () => {
            execute();

            const calls = (mockRedOffsetElement.addEventListener as any).mock.calls;
            const eventTypes = calls.map((call: any[]) => call[0]);

            expect(eventTypes).toContain(EventType.POINTER_OVER);
            expect(eventTypes).toContain(EventType.POINTER_OUT);
            expect(eventTypes).toContain(EventType.POINTER_DOWN);
            expect(eventTypes).toContain("focusin");
            expect(eventTypes).toContain("focusout");
            expect(eventTypes).toContain("keypress");
        });

        it("greenMultiplier要素に全イベントが登録される", () => {
            execute();

            const calls = (mockGreenMultiplierElement.addEventListener as any).mock.calls;
            const eventTypes = calls.map((call: any[]) => call[0]);

            expect(eventTypes).toContain(EventType.POINTER_OVER);
            expect(eventTypes).toContain(EventType.POINTER_OUT);
            expect(eventTypes).toContain(EventType.POINTER_DOWN);
            expect(eventTypes).toContain("focusin");
            expect(eventTypes).toContain("focusout");
            expect(eventTypes).toContain("keypress");
        });
    });
});
