import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $SCREEN_POSITION_LEFT_ID,
    $SCREEN_POSITION_CENTER_ID,
    $SCREEN_POSITION_RIGHT_ID,
    $SCREEN_POSITION_TOP_ID,
    $SCREEN_POSITION_MIDDLE_ID,
    $SCREEN_POSITION_BOTTOM_ID,
    $SCREEN_STAGE_POSITION_LEFT_ID,
    $SCREEN_STAGE_POSITION_CENTER_ID,
    $SCREEN_STAGE_POSITION_RIGHT_ID,
    $SCREEN_STAGE_POSITION_TOP_ID,
    $SCREEN_STAGE_POSITION_MIDDLE_ID,
    $SCREEN_STAGE_POSITION_BOTTOM_ID
} from "@/config/ScreenAlignMenuConfig";

const {
    mockAlignSettingLeftPointerDownEventService,
    mockAlignSettingCenterPointerDownEventService,
    mockAlignSettingRightPointerDownEventService,
    mockAlignSettingTopPointerDownEventService,
    mockAlignSettingMiddlePointerDownEventService,
    mockAlignSettingBottomPointerDownEventService,
    mockAlignSettingStageLeftPointerDownEventService,
    mockAlignSettingStageCenterPointerDownEventService,
    mockAlignSettingStageRightPointerDownEventService,
    mockAlignSettingStageTopPointerDownEventService,
    mockAlignSettingStageMiddlePointerDownEventService,
    mockAlignSettingStageBottomPointerDownEventService
} = vi.hoisted(() => {
    return {
        mockAlignSettingLeftPointerDownEventService: vi.fn(),
        mockAlignSettingCenterPointerDownEventService: vi.fn(),
        mockAlignSettingRightPointerDownEventService: vi.fn(),
        mockAlignSettingTopPointerDownEventService: vi.fn(),
        mockAlignSettingMiddlePointerDownEventService: vi.fn(),
        mockAlignSettingBottomPointerDownEventService: vi.fn(),
        mockAlignSettingStageLeftPointerDownEventService: vi.fn(),
        mockAlignSettingStageCenterPointerDownEventService: vi.fn(),
        mockAlignSettingStageRightPointerDownEventService: vi.fn(),
        mockAlignSettingStageTopPointerDownEventService: vi.fn(),
        mockAlignSettingStageMiddlePointerDownEventService: vi.fn(),
        mockAlignSettingStageBottomPointerDownEventService: vi.fn()
    };
});

vi.mock("@/controller/application/AlignSetting/service/AlignSettingLeftPointerDownEventService", () => ({
    execute: mockAlignSettingLeftPointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingCenterPointerDownEventService", () => ({
    execute: mockAlignSettingCenterPointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingRightPointerDownEventService", () => ({
    execute: mockAlignSettingRightPointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingTopPointerDownEventService", () => ({
    execute: mockAlignSettingTopPointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingMiddlePointerDownEventService", () => ({
    execute: mockAlignSettingMiddlePointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingBottomPointerDownEventService", () => ({
    execute: mockAlignSettingBottomPointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingStageLeftPointerDownEventService", () => ({
    execute: mockAlignSettingStageLeftPointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingStageCenterPointerDownEventService", () => ({
    execute: mockAlignSettingStageCenterPointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingStageRightPointerDownEventService", () => ({
    execute: mockAlignSettingStageRightPointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingStageTopPointerDownEventService", () => ({
    execute: mockAlignSettingStageTopPointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingStageMiddlePointerDownEventService", () => ({
    execute: mockAlignSettingStageMiddlePointerDownEventService
}));

vi.mock("@/controller/application/AlignSetting/service/AlignSettingStageBottomPointerDownEventService", () => ({
    execute: mockAlignSettingStageBottomPointerDownEventService
}));

import { execute } from "./ScreenAlignMenuMenuInitializeRegisterEventUseCase";

describe("ScreenAlignMenuMenuInitializeRegisterEventUseCase", () => {
    let elements: Map<string, HTMLElement>;

    beforeEach(() => {
        elements = new Map();
        
        const elementIds = [
            $SCREEN_POSITION_LEFT_ID,
            $SCREEN_POSITION_CENTER_ID,
            $SCREEN_POSITION_RIGHT_ID,
            $SCREEN_POSITION_TOP_ID,
            $SCREEN_POSITION_MIDDLE_ID,
            $SCREEN_POSITION_BOTTOM_ID,
            $SCREEN_STAGE_POSITION_LEFT_ID,
            $SCREEN_STAGE_POSITION_CENTER_ID,
            $SCREEN_STAGE_POSITION_RIGHT_ID,
            $SCREEN_STAGE_POSITION_TOP_ID,
            $SCREEN_STAGE_POSITION_MIDDLE_ID,
            $SCREEN_STAGE_POSITION_BOTTOM_ID
        ];

        elementIds.forEach(id => {
            const element = document.createElement("div");
            element.id = id;
            document.body.appendChild(element);
            elements.set(id, element);
        });
    });

    afterEach(() => {
        elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        elements.clear();
    });

    it("すべてのスクリーン整列ボタンにイベントリスナーが登録される", () => {
        const eventListeners = new Map<string, boolean>();

        elements.forEach((element, id) => {
            eventListeners.set(id, false);
            element.addEventListener = vi.fn((type) => {
                if (type === EventType.POINTER_DOWN) {
                    eventListeners.set(id, true);
                }
            });
        });

        execute();

        expect(eventListeners.get($SCREEN_POSITION_LEFT_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_POSITION_CENTER_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_POSITION_RIGHT_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_POSITION_TOP_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_POSITION_MIDDLE_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_POSITION_BOTTOM_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_STAGE_POSITION_LEFT_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_STAGE_POSITION_CENTER_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_STAGE_POSITION_RIGHT_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_STAGE_POSITION_TOP_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_STAGE_POSITION_MIDDLE_ID)).toBe(true);
        expect(eventListeners.get($SCREEN_STAGE_POSITION_BOTTOM_ID)).toBe(true);
    });

    it("正しいイベントハンドラーが登録される", () => {
        const handlers = new Map<string, any>();

        elements.forEach((element, id) => {
            element.addEventListener = vi.fn((type, handler) => {
                if (type === EventType.POINTER_DOWN) {
                    handlers.set(id, handler);
                }
            });
        });

        execute();

        expect(handlers.get($SCREEN_POSITION_LEFT_ID)).toBe(mockAlignSettingLeftPointerDownEventService);
        expect(handlers.get($SCREEN_POSITION_CENTER_ID)).toBe(mockAlignSettingCenterPointerDownEventService);
        expect(handlers.get($SCREEN_POSITION_RIGHT_ID)).toBe(mockAlignSettingRightPointerDownEventService);
        expect(handlers.get($SCREEN_POSITION_TOP_ID)).toBe(mockAlignSettingTopPointerDownEventService);
        expect(handlers.get($SCREEN_POSITION_MIDDLE_ID)).toBe(mockAlignSettingMiddlePointerDownEventService);
        expect(handlers.get($SCREEN_POSITION_BOTTOM_ID)).toBe(mockAlignSettingBottomPointerDownEventService);
        expect(handlers.get($SCREEN_STAGE_POSITION_LEFT_ID)).toBe(mockAlignSettingStageLeftPointerDownEventService);
        expect(handlers.get($SCREEN_STAGE_POSITION_CENTER_ID)).toBe(mockAlignSettingStageCenterPointerDownEventService);
        expect(handlers.get($SCREEN_STAGE_POSITION_RIGHT_ID)).toBe(mockAlignSettingStageRightPointerDownEventService);
        expect(handlers.get($SCREEN_STAGE_POSITION_TOP_ID)).toBe(mockAlignSettingStageTopPointerDownEventService);
        expect(handlers.get($SCREEN_STAGE_POSITION_MIDDLE_ID)).toBe(mockAlignSettingStageMiddlePointerDownEventService);
        expect(handlers.get($SCREEN_STAGE_POSITION_BOTTOM_ID)).toBe(mockAlignSettingStageBottomPointerDownEventService);
    });

    it("要素が存在しない場合でもエラーが発生しない", () => {
        elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        elements.clear();

        expect(() => execute()).not.toThrow();
    });
});
