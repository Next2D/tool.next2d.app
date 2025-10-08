import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// モック設定（vi.hoistedを使用）
const {
    mockGetCurrentWorkSpace,
    mockActiveTouchPointers,
    mockExternalReferenceConstructor,
    mockExternalReferenceInstance
} = vi.hoisted(() => {
    const mockExternalReferenceInstance = {
        setPivot: vi.fn().mockResolvedValue(undefined)
    };
    return {
        mockGetCurrentWorkSpace: vi.fn(),
        mockActiveTouchPointers: { size: 1 },
        mockExternalReferenceConstructor: vi.fn(() => mockExternalReferenceInstance),
        mockExternalReferenceInstance
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/global/GlobalUtil", () => ({
    mockActiveTouchPointers: mockActiveTouchPointers
}));

vi.mock("@/external/controller/domain/model/ExternalReference", () => ({
    ExternalReference: mockExternalReferenceConstructor
}));

import { execute } from "./ReferenceSettingBoxPointerDownUseCase";

describe("ReferenceSettingBoxPointerDownUseCase", () => {
    let mockWorkSpace: any;
    let mockElement: HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();

        // WorkSpace モック
        mockWorkSpace = {
            scene: {
                id: "test-scene"
            }
        };

        // HTML要素モック
        mockElement = {
            dataset: {
                position: "top-left"
            }
        } as any;

        // 関数モック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        
        // mockExternalReferenceInstanceをリセット
        mockExternalReferenceInstance.setPivot.mockResolvedValue(undefined);

        // activeTouchPointers のサイズをリセット
        Object.defineProperty(mockActiveTouchPointers, 'size', {
            value: 1,
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const createMockEvent = (overrides: Partial<PointerEvent> = {}): PointerEvent => ({
        button: 0,
        target: mockElement,
        stopPropagation: vi.fn(),
        ...overrides
    } as any);

    describe("正常系", () => {
        it("有効なポインターダウンイベントで中心点を変更する", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
            expect(mockGetCurrentWorkSpace).toHaveBeenCalledTimes(1);
            expect(mockExternalReferenceConstructor).toHaveBeenCalledWith(
                mockWorkSpace,
                mockWorkSpace.scene
            );
            expect(mockExternalReferenceInstance.setPivot).toHaveBeenCalledWith("top-left");
        });

        it("異なるpivot位置でも正常に動作する", async () => {
            mockElement.dataset.position = "center";
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockExternalReferenceInstance.setPivot).toHaveBeenCalledWith("center");
        });

        it("bottom-rightのpivot位置で正常に動作する", async () => {
            mockElement.dataset.position = "bottom-right";
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockExternalReferenceInstance.setPivot).toHaveBeenCalledWith("bottom-right");
        });

        it("top-centerのpivot位置で正常に動作する", async () => {
            mockElement.dataset.position = "top-center";
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockExternalReferenceInstance.setPivot).toHaveBeenCalledWith("top-center");
        });
    });

    describe("早期リターン条件", () => {
        it("button が 0 以外の場合は処理を実行しない", async () => {
            const mockEvent = createMockEvent({ button: 1 });

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalReferenceConstructor).not.toHaveBeenCalled();
            expect(mockExternalReferenceInstance.setPivot).not.toHaveBeenCalled();
        });

        it("右クリック（button = 2）の場合は処理を実行しない", async () => {
            const mockEvent = createMockEvent({ button: 2 });

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalReferenceConstructor).not.toHaveBeenCalled();
            expect(mockExternalReferenceInstance.setPivot).not.toHaveBeenCalled();
        });

        it("アクティブタッチポインターが2個以上の場合は処理を実行しない", async () => {
            Object.defineProperty(mockActiveTouchPointers, 'size', {
                value: 2,
                writable: true,
                configurable: true
            });

            const mockEvent = createMockEvent();
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalReferenceConstructor).not.toHaveBeenCalled();
            expect(mockExternalReferenceInstance.setPivot).not.toHaveBeenCalled();
        });

        it("アクティブタッチポインターが3個の場合は処理を実行しない", async () => {
            Object.defineProperty(mockActiveTouchPointers, 'size', {
                value: 3,
                writable: true,
                configurable: true
            });

            const mockEvent = createMockEvent();
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalReferenceConstructor).not.toHaveBeenCalled();
            expect(mockExternalReferenceInstance.setPivot).not.toHaveBeenCalled();
        });

        it("event.target が null の場合は処理を実行しない", async () => {
            const mockEvent = createMockEvent({ target: null });

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalReferenceConstructor).not.toHaveBeenCalled();
            expect(mockExternalReferenceInstance.setPivot).not.toHaveBeenCalled();
        });

        it("event.target が undefined の場合は処理を実行しない", async () => {
            const mockEvent = createMockEvent({ target: undefined });

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalReferenceConstructor).not.toHaveBeenCalled();
            expect(mockExternalReferenceInstance.setPivot).not.toHaveBeenCalled();
        });
    });

    describe("複合条件のテスト", () => {
        it("button != 0 かつ アクティブタッチポインターが複数の場合", async () => {
            Object.defineProperty(mockActiveTouchPointers, 'size', {
                value: 2,
                writable: true,
                configurable: true
            });

            const mockEvent = createMockEvent({ button: 1 });
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalReferenceConstructor).not.toHaveBeenCalled();
            expect(mockExternalReferenceInstance.setPivot).not.toHaveBeenCalled();
        });
    });

    describe("イベント処理", () => {
        it("stopPropagationが適切に呼ばれる", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("stopPropagationはtarget検証前に呼ばれる", async () => {
            const mockEvent = createMockEvent({ target: null });

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
            // target が null でも stopPropagation は呼ばれる
        });
    });

    describe("ExternalReference処理", () => {
        it("WorkSpaceとsceneが正しくExternalReferenceに渡される", async () => {
            const customWorkSpace = {
                scene: { id: "custom-scene" }
            };
            
            mockGetCurrentWorkSpace.mockReturnValue(customWorkSpace);

            const mockEvent = createMockEvent();
            await execute(mockEvent);

            expect(mockExternalReferenceConstructor).toHaveBeenCalledWith(
                customWorkSpace,
                customWorkSpace.scene
            );
        });

        it("setPivotメソッドがawaitされる", async () => {
            const setPivotSpy = vi.fn().mockResolvedValue(undefined);
            mockExternalReferenceInstance.setPivot = setPivotSpy;

            const mockEvent = createMockEvent();
            await execute(mockEvent);

            expect(setPivotSpy).toHaveBeenCalledWith("top-left");
        });

        it("setPivotでエラーが発生した場合でも例外が伝播する", async () => {
            const error = new Error("setPivot failed");
            mockExternalReferenceInstance.setPivot.mockRejectedValue(error);

            const mockEvent = createMockEvent();
            await expect(execute(mockEvent)).rejects.toThrow("setPivot failed");
        });
    });

    describe("データ属性の処理", () => {
        it("dataset.positionが存在しない場合はundefinedが渡される", async () => {
            delete (mockElement.dataset as any).position;
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockExternalReferenceInstance.setPivot).toHaveBeenCalledWith(undefined);
        });

        it("dataset.positionが空文字の場合は空文字が渡される", async () => {
            mockElement.dataset.position = "";
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockExternalReferenceInstance.setPivot).toHaveBeenCalledWith("");
        });

        it("dataset.positionが不正な値でもそのまま渡される", async () => {
            mockElement.dataset.position = "invalid-position";
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockExternalReferenceInstance.setPivot).toHaveBeenCalledWith("invalid-position");
        });
    });

    describe("pivot位置の種類別テスト", () => {
        const pivotPositions = [
            "top-left", "top-center", "top-right",
            "center-left", "center", "center-right", 
            "bottom-left", "bottom-center", "bottom-right"
        ];

        pivotPositions.forEach((position) => {
            it(`pivot位置が${position}の場合に正常に処理される`, async () => {
                mockElement.dataset.position = position;
                const mockEvent = createMockEvent();

                await execute(mockEvent);

                expect(mockExternalReferenceInstance.setPivot).toHaveBeenCalledWith(position);
            });
        });
    });

    describe("非同期処理", () => {
        it("setPivotが非同期で完了するまで待機する", async () => {
            let pivotResolved = false;
            mockExternalReferenceInstance.setPivot.mockImplementation(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        pivotResolved = true;
                        resolve(undefined);
                    }, 10);
                });
            });

            const mockEvent = createMockEvent();
            await execute(mockEvent);

            expect(pivotResolved).toBe(true);
        });
    });
});
