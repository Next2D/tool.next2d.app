import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $ALIGN_POSITION_LEFT_ID,
    $ALIGN_POSITION_RIGHT_ID,
    $ALIGN_POSITION_CENTER_ID,
    $ALIGN_POSITION_TOP_ID,
    $ALIGN_POSITION_MIDDLE_ID,
    $ALIGN_POSITION_BOTTOM_ID,
    $ALIGN_STAGE_POSITION_LEFT_ID,
    $ALIGN_STAGE_POSITION_RIGHT_ID,
    $ALIGN_STAGE_POSITION_CENTER_ID,
    $ALIGN_STAGE_POSITION_TOP_ID,
    $ALIGN_STAGE_POSITION_MIDDLE_ID,
    $ALIGN_STAGE_POSITION_BOTTOM_ID
} from "@/config/AlignSettingConfig";

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

vi.mock("../service/AlignSettingLeftPointerDownEventService", () => ({
    execute: mockAlignSettingLeftPointerDownEventService
}));

vi.mock("../service/AlignSettingCenterPointerDownEventService", () => ({
    execute: mockAlignSettingCenterPointerDownEventService
}));

vi.mock("../service/AlignSettingRightPointerDownEventService", () => ({
    execute: mockAlignSettingRightPointerDownEventService
}));

vi.mock("../service/AlignSettingTopPointerDownEventService", () => ({
    execute: mockAlignSettingTopPointerDownEventService
}));

vi.mock("../service/AlignSettingMiddlePointerDownEventService", () => ({
    execute: mockAlignSettingMiddlePointerDownEventService
}));

vi.mock("../service/AlignSettingBottomPointerDownEventService", () => ({
    execute: mockAlignSettingBottomPointerDownEventService
}));

vi.mock("../service/AlignSettingStageLeftPointerDownEventService", () => ({
    execute: mockAlignSettingStageLeftPointerDownEventService
}));

vi.mock("../service/AlignSettingStageCenterPointerDownEventService", () => ({
    execute: mockAlignSettingStageCenterPointerDownEventService
}));

vi.mock("../service/AlignSettingStageRightPointerDownEventService", () => ({
    execute: mockAlignSettingStageRightPointerDownEventService
}));

vi.mock("../service/AlignSettingStageTopPointerDownEventService", () => ({
    execute: mockAlignSettingStageTopPointerDownEventService
}));

vi.mock("../service/AlignSettingStageMiddlePointerDownEventService", () => ({
    execute: mockAlignSettingStageMiddlePointerDownEventService
}));

vi.mock("../service/AlignSettingStageBottomPointerDownEventService", () => ({
    execute: mockAlignSettingStageBottomPointerDownEventService
}));

import { execute } from "./AlignSettingInitializeRegisterEventUseCase";

describe("AlignSettingInitializeRegisterEventUseCase", () => {
    let elements: Map<string, HTMLElement>;

    beforeEach(() => {
        elements = new Map();
        
        // Create all required elements
        const elementIds = [
            $ALIGN_POSITION_LEFT_ID,
            $ALIGN_POSITION_CENTER_ID,
            $ALIGN_POSITION_RIGHT_ID,
            $ALIGN_POSITION_TOP_ID,
            $ALIGN_POSITION_MIDDLE_ID,
            $ALIGN_POSITION_BOTTOM_ID,
            $ALIGN_STAGE_POSITION_LEFT_ID,
            $ALIGN_STAGE_POSITION_CENTER_ID,
            $ALIGN_STAGE_POSITION_RIGHT_ID,
            $ALIGN_STAGE_POSITION_TOP_ID,
            $ALIGN_STAGE_POSITION_MIDDLE_ID,
            $ALIGN_STAGE_POSITION_BOTTOM_ID
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

    describe("イベントリスナー登録", () => {
        it("すべての整列ボタンにイベントリスナーが登録される", () => {
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

            // Verify all event listeners were registered
            expect(eventListeners.get($ALIGN_POSITION_LEFT_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_POSITION_CENTER_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_POSITION_RIGHT_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_POSITION_TOP_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_POSITION_MIDDLE_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_POSITION_BOTTOM_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_STAGE_POSITION_LEFT_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_STAGE_POSITION_CENTER_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_STAGE_POSITION_RIGHT_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_STAGE_POSITION_TOP_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_STAGE_POSITION_MIDDLE_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_STAGE_POSITION_BOTTOM_ID)).toBe(true);
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

            expect(handlers.get($ALIGN_POSITION_LEFT_ID)).toBe(mockAlignSettingLeftPointerDownEventService);
            expect(handlers.get($ALIGN_POSITION_CENTER_ID)).toBe(mockAlignSettingCenterPointerDownEventService);
            expect(handlers.get($ALIGN_POSITION_RIGHT_ID)).toBe(mockAlignSettingRightPointerDownEventService);
            expect(handlers.get($ALIGN_POSITION_TOP_ID)).toBe(mockAlignSettingTopPointerDownEventService);
            expect(handlers.get($ALIGN_POSITION_MIDDLE_ID)).toBe(mockAlignSettingMiddlePointerDownEventService);
            expect(handlers.get($ALIGN_POSITION_BOTTOM_ID)).toBe(mockAlignSettingBottomPointerDownEventService);
            expect(handlers.get($ALIGN_STAGE_POSITION_LEFT_ID)).toBe(mockAlignSettingStageLeftPointerDownEventService);
            expect(handlers.get($ALIGN_STAGE_POSITION_CENTER_ID)).toBe(mockAlignSettingStageCenterPointerDownEventService);
            expect(handlers.get($ALIGN_STAGE_POSITION_RIGHT_ID)).toBe(mockAlignSettingStageRightPointerDownEventService);
            expect(handlers.get($ALIGN_STAGE_POSITION_TOP_ID)).toBe(mockAlignSettingStageTopPointerDownEventService);
            expect(handlers.get($ALIGN_STAGE_POSITION_MIDDLE_ID)).toBe(mockAlignSettingStageMiddlePointerDownEventService);
            expect(handlers.get($ALIGN_STAGE_POSITION_BOTTOM_ID)).toBe(mockAlignSettingStageBottomPointerDownEventService);
        });
    });

    describe("要素が存在しない場合の処理", () => {
        beforeEach(() => {
            // Remove all elements
            elements.forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
            elements.clear();
        });

        it("要素が存在しない場合でもエラーが発生しない", () => {
            expect(() => execute()).not.toThrow();
        });
    });

    describe("一部の要素が存在しない場合の処理", () => {
        it("一部の要素が存在しない場合、存在する要素のみイベントリスナーが登録される", () => {
            // Remove some elements
            const leftElement = elements.get($ALIGN_POSITION_LEFT_ID);
            const stageBottomElement = elements.get($ALIGN_STAGE_POSITION_BOTTOM_ID);
            
            if (leftElement?.parentNode) {
                leftElement.parentNode.removeChild(leftElement);
            }
            if (stageBottomElement?.parentNode) {
                stageBottomElement.parentNode.removeChild(stageBottomElement);
            }

            const eventListeners = new Map<string, boolean>();

            elements.forEach((element, id) => {
                if (element.parentNode) {
                    eventListeners.set(id, false);
                    element.addEventListener = vi.fn((type) => {
                        if (type === EventType.POINTER_DOWN) {
                            eventListeners.set(id, true);
                        }
                    });
                }
            });

            execute();

            // Verify only existing elements have event listeners
            expect(eventListeners.get($ALIGN_POSITION_CENTER_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_POSITION_RIGHT_ID)).toBe(true);
            expect(eventListeners.get($ALIGN_STAGE_POSITION_TOP_ID)).toBe(true);
        });
    });

    describe("イベントタイプの確認", () => {
        it("POINTER_DOWN イベントのみが登録される", () => {
            const eventTypes = new Map<string, string[]>();

            elements.forEach((element, id) => {
                eventTypes.set(id, []);
                element.addEventListener = vi.fn((type) => {
                    eventTypes.get(id)?.push(type);
                });
            });

            execute();

            elements.forEach((element, id) => {
                const types = eventTypes.get(id) || [];
                expect(types).toEqual([EventType.POINTER_DOWN]);
            });
        });
    });

    describe("複数回実行時の動作", () => {
        it("複数回実行してもエラーが発生しない", () => {
            elements.forEach((element) => {
                element.addEventListener = vi.fn();
            });

            expect(() => {
                execute();
                execute();
                execute();
            }).not.toThrow();
        });

        it("複数回実行すると複数回イベントリスナーが登録される", () => {
            const addEventListenerCalls = new Map<string, number>();

            elements.forEach((element, id) => {
                addEventListenerCalls.set(id, 0);
                element.addEventListener = vi.fn(() => {
                    addEventListenerCalls.set(id, (addEventListenerCalls.get(id) || 0) + 1);
                });
            });

            execute();
            execute();

            elements.forEach((element, id) => {
                expect(addEventListenerCalls.get(id)).toBe(2);
            });
        });
    });

    describe("整列ボタンのグループ分け", () => {
        it("選択範囲整列ボタンのイベントリスナーが登録される", () => {
            const selectionAlignmentIds = [
                $ALIGN_POSITION_LEFT_ID,
                $ALIGN_POSITION_CENTER_ID,
                $ALIGN_POSITION_RIGHT_ID,
                $ALIGN_POSITION_TOP_ID,
                $ALIGN_POSITION_MIDDLE_ID,
                $ALIGN_POSITION_BOTTOM_ID
            ];

            const handlers = new Map<string, any>();

            elements.forEach((element, id) => {
                element.addEventListener = vi.fn((type, handler) => {
                    if (type === EventType.POINTER_DOWN) {
                        handlers.set(id, handler);
                    }
                });
            });

            execute();

            selectionAlignmentIds.forEach(id => {
                expect(handlers.has(id)).toBe(true);
                expect(handlers.get(id)).toBeDefined();
            });
        });

        it("ステージ整列ボタンのイベントリスナーが登録される", () => {
            const stageAlignmentIds = [
                $ALIGN_STAGE_POSITION_LEFT_ID,
                $ALIGN_STAGE_POSITION_CENTER_ID,
                $ALIGN_STAGE_POSITION_RIGHT_ID,
                $ALIGN_STAGE_POSITION_TOP_ID,
                $ALIGN_STAGE_POSITION_MIDDLE_ID,
                $ALIGN_STAGE_POSITION_BOTTOM_ID
            ];

            const handlers = new Map<string, any>();

            elements.forEach((element, id) => {
                element.addEventListener = vi.fn((type, handler) => {
                    if (type === EventType.POINTER_DOWN) {
                        handlers.set(id, handler);
                    }
                });
            });

            execute();

            stageAlignmentIds.forEach(id => {
                expect(handlers.has(id)).toBe(true);
                expect(handlers.get(id)).toBeDefined();
            });
        });
    });
});
