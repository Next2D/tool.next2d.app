import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const {
    mock$getCurrentWorkSpace,
    mock$activeTouchPointers,
    mock$setEditingElement,
    mock$allHideMenu,
    mockExternalAlign
} = vi.hoisted(() => {
    return {
        mock$getCurrentWorkSpace: vi.fn(),
        mock$activeTouchPointers: new Set(),
        mock$setEditingElement: vi.fn(),
        mock$allHideMenu: vi.fn(),
        mockExternalAlign: vi.fn()
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mock$getCurrentWorkSpace
}));

vi.mock("@/global/GlobalUtil", () => ({
    $activeTouchPointers: mock$activeTouchPointers,
    $setEditingElement: mock$setEditingElement
}));

vi.mock("@/menu/application/MenuUtil", () => ({
    $allHideMenu: mock$allHideMenu
}));

vi.mock("@/external/controller/domain/model/ExternalAlign", () => ({
    ExternalAlign: mockExternalAlign
}));

import { execute } from "./AlignSettingRightPointerDownEventService";

describe("AlignSettingRightPointerDownEventService", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockEvent: PointerEvent;
    let mockExternalAlignInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mock$activeTouchPointers.clear();

        mockExternalAlignInstance = {
            right: vi.fn().mockResolvedValue(undefined)
        };

        mockExternalAlign.mockImplementation(() => mockExternalAlignInstance);

        mockMovieClip = {
            selectedDepths: new Map([[0, [1]]])
        };

        mockWorkSpace = {
            scene: mockMovieClip
        };

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        mockEvent = {
            type: "pointerdown",
            button: 0,
            stopPropagation: vi.fn()
        } as unknown as PointerEvent;
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("早期リターン条件", () => {
        it("左クリック以外の場合、何も処理しない", async () => {
            mockEvent.button = 1;

            await execute(mockEvent);

            expect(mockExternalAlign).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("マルチタッチの場合、何も処理しない", async () => {
            mock$activeTouchPointers.add(1);
            mock$activeTouchPointers.add(2);

            await execute(mockEvent);

            expect(mockExternalAlign).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("選択中のキャラクターがない場合、何も処理しない", async () => {
            mockMovieClip.selectedDepths = new Map();

            await execute(mockEvent);

            expect(mockExternalAlign).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("正常処理", () => {
        it("左クリック時に右端揃えが実行される", async () => {
            await execute(mockEvent);

            expect(mock$allHideMenu).toHaveBeenCalled();
            expect(mock$setEditingElement).toHaveBeenCalledWith(null);
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockExternalAlign).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            expect(mockExternalAlignInstance.right).toHaveBeenCalled();
        });

        it("複数のキャラクターが選択されている場合でも実行される", async () => {
            mockMovieClip.selectedDepths = new Map([
                [0, [1, 2]],
                [1, [3]]
            ]);

            await execute(mockEvent);

            expect(mockExternalAlignInstance.right).toHaveBeenCalled();
        });

        it("シングルタッチの場合は実行される", async () => {
            mock$activeTouchPointers.add(1);

            await execute(mockEvent);

            expect(mockExternalAlignInstance.right).toHaveBeenCalled();
        });
    });

    describe("非同期処理", () => {
        it("right メソッドが非同期で実行される", async () => {
            let methodCalled = false;
            mockExternalAlignInstance.right.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                methodCalled = true;
            });

            await execute(mockEvent);

            expect(methodCalled).toBe(true);
        });
    });
});
