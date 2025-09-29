import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ScreenReferencePointPointerUpEventUseCase";

// モック設定
const mockSetCursor = vi.fn();
const mockGetCurrentWorkSpace = vi.fn();
const mockReferenceSetting = {
    x: 100,
    y: 200
};
const mockMatrix = vi.fn();
const mockExternalReference = vi.fn();
const mockScreenReferencePointPointerMoveEventUseCase = vi.fn();

vi.mock("@/global/GlobalUtil", () => ({
    $setCursor: mockSetCursor
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: mockReferenceSetting
}));

vi.mock("@next2d/geom", () => ({
    Matrix: mockMatrix
}));

vi.mock("@/external/controller/domain/model/ExternalReference", () => ({
    ExternalReference: mockExternalReference
}));

vi.mock("./ScreenReferencePointPointerMoveEventUseCase", () => ({
    execute: mockScreenReferencePointPointerMoveEventUseCase
}));

vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        POINTER_MOVE: "pointermove",
        POINTER_UP: "pointerup",
        POINTER_LEAVE: "pointerleave",
        POINTER_CANCEL: "pointercancel"
    }
}));

describe("ScreenReferencePointPointerUpEventUseCase", () => {
    let mockElement: HTMLDivElement;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockMatrixInstance: any;
    let mockExternalReferenceInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // HTML要素のモック作成
        mockElement = {
            style: { cursor: "grabbing" },
            releasePointerCapture: vi.fn(),
            removeEventListener: vi.fn()
        } as any;

        // Matrix インスタンスモック
        mockMatrixInstance = {
            a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0,
            invert: vi.fn().mockReturnThis()
        };
        mockMatrix.mockReturnValue(mockMatrixInstance);

        // ExternalReference インスタンスモック
        mockExternalReferenceInstance = {
            setX: vi.fn().mockResolvedValue(undefined),
            setY: vi.fn().mockResolvedValue(undefined)
        };
        mockExternalReference.mockReturnValue(mockExternalReferenceInstance);

        // Character モック
        mockCharacter = {
            matrix: [1, 0, 0, 1, 0, 0]
        };

        // Layer モック
        mockLayer = {
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        // MovieClip モック
        mockMovieClip = {
            currentFrame: 1,
            selectedDepths: new Map([[0, [0]]]),
            isSingleSelectedOfDisplayObject: vi.fn().mockReturnValue(true),
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };

        // WorkSpace モック
        mockWorkSpace = {
            scene: mockMovieClip
        };

        // 関数モック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        // ReferenceSetting の初期化
        mockReferenceSetting.x = 100;
        mockReferenceSetting.y = 200;
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const createMockEvent = (overrides: Partial<PointerEvent> = {}): PointerEvent => ({
        target: mockElement,
        pointerId: 123,
        stopPropagation: vi.fn(),
        ...overrides
    } as any);

    describe("正常系 - 単一選択時", () => {
        it("完全なクリーンアップと最終座標更新が実行される", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // グローバルカーソルの復元確認
            expect(mockSetCursor).toHaveBeenCalledWith("auto");

            // イベント伝播の停止確認
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();

            // 要素カーソルの復元確認
            expect(mockElement.style.cursor).toBe("");

            // ポインターキャプチャの解放確認
            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(123);

            // 4つのイベントリスナーの削除確認
            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointermove",
                mockScreenReferencePointPointerMoveEventUseCase
            );
            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointerup",
                execute
            );
            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointerleave",
                execute
            );
            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointercancel",
                execute
            );

            // 単一選択時の処理確認
            expect(mockMovieClip.isSingleSelectedOfDisplayObject).toHaveBeenCalledOnce();
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 0);

            // Matrix 処理の確認
            expect(mockMatrix).toHaveBeenCalledWith(...mockCharacter.matrix);
            expect(mockMatrixInstance.invert).toHaveBeenCalledOnce();

            // ExternalReference による最終更新確認
            expect(mockExternalReference).toHaveBeenCalledWith(mockWorkSpace, mockWorkSpace.scene);
            expect(mockExternalReferenceInstance.setX).toHaveBeenCalledWith(100); // Matrix変換結果
            expect(mockExternalReferenceInstance.setY).toHaveBeenCalledWith(200); // Matrix変換結果
        });

        it("Matrix変換が正しく適用される", async () => {
            // Matrix の変換結果をモック
            mockMatrixInstance.a = 2;
            mockMatrixInstance.b = 0.5;
            mockMatrixInstance.c = 0.2;
            mockMatrixInstance.d = 1.5;
            mockMatrixInstance.tx = 10;
            mockMatrixInstance.ty = 5;

            // ReferenceSetting の値を変更
            mockReferenceSetting.x = 50;
            mockReferenceSetting.y = 80;

            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // Matrix変換式: x = referenceSetting.x * matrix.a + referenceSetting.y * matrix.c + matrix.tx
            //              y = referenceSetting.x * matrix.b + referenceSetting.y * matrix.d + matrix.ty
            const expectedX = 50 * 2 + 80 * 0.2 + 10; // 100 + 16 + 10 = 126
            const expectedY = 50 * 0.5 + 80 * 1.5 + 5; // 25 + 120 + 5 = 150

            expect(mockExternalReferenceInstance.setX).toHaveBeenCalledWith(expectedX);
            expect(mockExternalReferenceInstance.setY).toHaveBeenCalledWith(expectedY);
        });

        it("異なるpointerIdでも正常に動作する", async () => {
            const mockEvent = createMockEvent({ pointerId: 456 });

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(456);
        });
    });

    describe("正常系 - 複数選択時", () => {
        it("複数選択の場合はExternalReference処理をスキップする", async () => {
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // 基本的なクリーンアップ処理は実行される
            expect(mockSetCursor).toHaveBeenCalledWith("auto");
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockElement.style.cursor).toBe("");
            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(123);
            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);

            // 単一選択時の処理は実行されない
            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockMatrix).not.toHaveBeenCalled();
            expect(mockExternalReference).not.toHaveBeenCalled();
        });
    });

    describe("要素が存在しない場合", () => {
        it("event.target が null の場合は早期リターンする", async () => {
            const mockEvent = createMockEvent({ target: null });

            await execute(mockEvent);

            // グローバルカーソルの復元のみ実行される
            expect(mockSetCursor).toHaveBeenCalledWith("auto");

            // その他の処理は実行されない
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
        });

        it("event.target が undefined の場合は早期リターンする", async () => {
            const mockEvent = createMockEvent({ target: undefined });

            await execute(mockEvent);

            expect(mockSetCursor).toHaveBeenCalledWith("auto");
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("エラーハンドリング - 単一選択時", () => {
        it("layerが存在しない場合は処理を中断する", async () => {
            mockMovieClip.getLayer.mockReturnValue(null);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // 基本クリーンアップは実行される
            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);

            // character取得以降は実行されない
            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockMatrix).not.toHaveBeenCalled();
            expect(mockExternalReference).not.toHaveBeenCalled();
        });

        it("characterが存在しない場合は処理を中断する", async () => {
            mockLayer.getCharacter.mockReturnValue(null);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // layer取得まで実行される
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 0);

            // Matrix処理以降は実行されない
            expect(mockMatrix).not.toHaveBeenCalled();
            expect(mockExternalReference).not.toHaveBeenCalled();
        });
    });

    describe("selectedDepthsの処理", () => {
        it("selectedDepthsから正しくlayerIndexとcharacterIndexを取得する", async () => {
            // 異なるselectedDepths設定
            mockMovieClip.selectedDepths = new Map([[5, [3, 7]]]);
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(5); // layerIndex
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 3); // characterIndex (values[0])
        });
    });

    describe("イベントリスナー削除の詳細確認", () => {
        it("すべてのイベントタイプでリスナーが削除される", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            const calls = (mockElement.removeEventListener as any).mock.calls;

            // 削除されるイベントタイプの確認
            expect(calls).toContainEqual([
                "pointermove",
                mockScreenReferencePointPointerMoveEventUseCase
            ]);
            expect(calls).toContainEqual([
                "pointerup",
                execute
            ]);
            expect(calls).toContainEqual([
                "pointerleave",
                execute
            ]);
            expect(calls).toContainEqual([
                "pointercancel",
                execute
            ]);
        });

        it("自分自身のハンドラーも削除される", async () => {
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            // UP, LEAVE, CANCEL イベントで自分自身（execute）が削除される
            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointerup",
                execute
            );
            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointerleave",
                execute
            );
            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointercancel",
                execute
            );
        });
    });

    describe("非同期処理の確認", () => {
        it("ExternalReference.setXとsetYが非同期で実行される", async () => {
            let setXResolved = false;
            let setYResolved = false;

            mockExternalReferenceInstance.setX.mockImplementation(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        setXResolved = true;
                        resolve(undefined);
                    }, 10);
                });
            });

            mockExternalReferenceInstance.setY.mockImplementation(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        setYResolved = true;
                        resolve(undefined);
                    }, 10);
                });
            });

            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(setXResolved).toBe(true);
            expect(setYResolved).toBe(true);
        });

        it("ExternalReferenceでエラーが発生した場合", async () => {
            mockExternalReferenceInstance.setX.mockRejectedValue(new Error("setX failed"));
            const mockEvent = createMockEvent();

            // エラーが伝播することを確認
            await expect(execute(mockEvent)).rejects.toThrow("setX failed");
        });
    });

    describe("カーソル管理", () => {
        it("グローバルカーソルと要素カーソルが正しく復元される", async () => {
            mockElement.style.cursor = "grabbing";
            const mockEvent = createMockEvent();

            await execute(mockEvent);

            expect(mockSetCursor).toHaveBeenCalledWith("auto");
            expect(mockElement.style.cursor).toBe("");
        });
    });

    describe("処理順序の確認", () => {
        it("処理が正しい順序で実行される", async () => {
            const executionOrder: string[] = [];
            const mockEvent = createMockEvent();

            mockSetCursor.mockImplementation(() => {
                executionOrder.push("setCursor");
            });

            const originalStopPropagation = mockEvent.stopPropagation;
            mockEvent.stopPropagation = vi.fn().mockImplementation(() => {
                executionOrder.push("stopPropagation");
                originalStopPropagation.call(mockEvent);
            });

            mockElement.releasePointerCapture = vi.fn().mockImplementation(() => {
                executionOrder.push("releasePointerCapture");
            });

            mockGetCurrentWorkSpace.mockImplementation(() => {
                executionOrder.push("getCurrentWorkSpace");
                return mockWorkSpace;
            });

            mockExternalReferenceInstance.setX.mockImplementation(async () => {
                executionOrder.push("setX");
            });

            mockExternalReferenceInstance.setY.mockImplementation(async () => {
                executionOrder.push("setY");
            });

            await execute(mockEvent);

            expect(executionOrder).toEqual([
                "setCursor",
                "stopPropagation",
                "releasePointerCapture",
                "getCurrentWorkSpace",
                "setX",
                "setY"
            ]);
        });
    });
});
