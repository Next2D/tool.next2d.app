import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

// モック設定
const { mockGetCurrentWorkSpace, mockScreenScrollResizeService } = vi.hoisted(() => {
    return {
        mockGetCurrentWorkSpace: vi.fn(),
        mockScreenScrollResizeService: vi.fn()
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/screen/application/ScreenScroll/service/ScreenScrollResizeService", () => ({
    execute: mockScreenScrollResizeService
}));

import { execute } from "./ControllerAdjustmentPointerMoveUseCase";

describe("ControllerAdjustmentPointerMoveUseCase Test", () =>
{
    let originalRequestAnimationFrame: typeof requestAnimationFrame;
    let mockWorkSpace: any;
    let mockStyle: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // requestAnimationFrameのモック
        originalRequestAnimationFrame = global.requestAnimationFrame;
        global.requestAnimationFrame = vi.fn((callback) => {
            callback(0);
            return 1;
        }) as any;

        // CSSStyleDeclarationのモック
        mockStyle = {
            getPropertyValue: vi.fn().mockReturnValue("300"),
            setProperty: vi.fn()
        };

        // documentのモック
        Object.defineProperty(document, "documentElement", {
            configurable: true,
            value: {
                style: mockStyle
            }
        });

        // workSpaceのモック
        mockWorkSpace = {
            controllerAreaState: {
                width: 300
            }
        };

        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
    });

    afterEach(() => {
        global.requestAnimationFrame = originalRequestAnimationFrame;
        vi.clearAllMocks();
    });

    it("test case", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const MockEvent = {
            "movementX": 10,
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            }
        } as PointerEvent;

        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);

        execute(MockEvent);

        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);
    });
});