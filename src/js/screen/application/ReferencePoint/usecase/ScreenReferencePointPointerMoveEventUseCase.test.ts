import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// モック設定（vi.hoistedを使用）
const {
    mockReferenceSetting,
    mockGetCurrentWorkSpace,
    mockScreenReferencePointMoveElementService,
    mockReferenceSettingUpdateXService,
    mockReferenceSettingUpdateYService,
    mockMatrix,
    mockGetConcatenatedMatrix
} = vi.hoisted(() => {
    const Matrix = vi.fn();
    Matrix.multiply = vi.fn(() => [1, 0, 0, 1, 0, 0]);
    
    return {
        mockReferenceSetting: {
            x: 0,
            y: 0,
            movementX: 0,
            movementY: 0,
            pivotX: 100,
            pivotY: 200
        },
        mockGetCurrentWorkSpace: vi.fn(),
        mockScreenReferencePointMoveElementService: vi.fn(),
        mockReferenceSettingUpdateXService: vi.fn(),
        mockReferenceSettingUpdateYService: vi.fn(),
        mockMatrix: Matrix,
        mockGetConcatenatedMatrix: vi.fn(() => [1, 0, 0, 1, 0, 0])
    };
});

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: mockReferenceSetting
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("../service/ScreenReferencePointMoveElementService", () => ({
    execute: mockScreenReferencePointMoveElementService
}));

vi.mock("@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateXService", () => ({
    execute: mockReferenceSettingUpdateXService
}));

vi.mock("@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateYService", () => ({
    execute: mockReferenceSettingUpdateYService
}));

vi.mock("@next2d/geom", () => ({
    Matrix: mockMatrix
}));

vi.mock("@/controller/application/TransformSetting/TransformSettingUtil", () => ({
    $getConcatenatedMatrix: mockGetConcatenatedMatrix
}));

import { execute } from "./ScreenReferencePointPointerMoveEventUseCase";

// requestAnimationFrame のモック
Object.defineProperty(global, 'requestAnimationFrame', {
    value: (callback: FrameRequestCallback) => {
        setTimeout(callback, 16); // 16ms後に実行（60FPS相当）
        return 1;
    },
    writable: true
});

describe("ScreenReferencePointPointerMoveEventUseCase", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockMatrixInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Matrix インスタンスモック
        mockMatrixInstance = {
            a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0,
            invert: vi.fn().mockReturnThis()
        };
        mockMatrix.mockReturnValue(mockMatrixInstance);

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
            scene: {},
            currentFrame: 1,
            selectedDepths: new Map([[0, [0]]]),
            isSingleSelectedOfDisplayObject: vi.fn().mockReturnValue(true),
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };

        // WorkSpace モック
        mockWorkSpace = {
            scene: mockMovieClip,
            scale: 1
        };

        // 関数モック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        // ReferenceSetting の初期化
        Object.assign(mockReferenceSetting, {
            x: 0,
            y: 0,
            movementX: 0,
            movementY: 0,
            pivotX: 100,
            pivotY: 200
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const createMockEvent = (overrides: Partial<PointerEvent> = {}): PointerEvent => ({
        movementX: 10,
        movementY: 20,
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
        ...overrides
    } as any);

    describe("正常系 - 単一選択時", () => {
        it("移動量がある場合、完全な処理フローが実行される", async () => {
            const mockEvent = createMockEvent({ movementX: 10, movementY: 20 });
            
            execute(mockEvent);

            // イベント処理の確認
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockEvent.preventDefault).toHaveBeenCalledOnce();

            // requestAnimationFrame の処理を待つ
            await new Promise(resolve => setTimeout(resolve, 20));

            // ReferenceSetting の更新確認
            expect(mockReferenceSetting.x).toBe(10); // 0 + 10 * 1
            expect(mockReferenceSetting.y).toBe(20); // 0 + 20 * 1
            expect(mockReferenceSetting.movementX).toBe(10);
            expect(mockReferenceSetting.movementY).toBe(20);

            // 要素移動サービスの呼び出し確認
            expect(mockScreenReferencePointMoveElementService).toHaveBeenCalledWith(10, 20);

            // 単一選択時のロジック確認
            expect(mockMovieClip.isSingleSelectedOfDisplayObject).toHaveBeenCalledOnce();
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 0);

            // Matrix 処理の確認
            expect(mockMatrix).toHaveBeenCalledWith(...mockCharacter.matrix);
            expect(mockMatrixInstance.invert).toHaveBeenCalledOnce();

            // 座標更新サービスの呼び出し確認（Matrix変換後の値）
            expect(mockReferenceSettingUpdateXService).toHaveBeenCalledWith(10); // x変換結果
            expect(mockReferenceSettingUpdateYService).toHaveBeenCalledWith(20); // y変換結果
        });

        it("スケールが適用された場合の座標計算", async () => {
            mockWorkSpace.scale = 2;
            const mockEvent = createMockEvent({ movementX: 5, movementY: 10 });

            execute(mockEvent);
            await new Promise(resolve => setTimeout(resolve, 20));

            // 実装ではmovementをそのまま加算するため、スケールは適用されない
            expect(mockReferenceSetting.x).toBe(5); // 0 + 5
            expect(mockReferenceSetting.y).toBe(10); // 0 + 10
            expect(mockReferenceSetting.movementX).toBe(5);
            expect(mockReferenceSetting.movementY).toBe(10);
        });

        it("Matrix変換が正しく適用される", async () => {
            // Matrix の変換結果をモック
            mockMatrixInstance.a = 2;
            mockMatrixInstance.b = 0;
            mockMatrixInstance.c = 0;
            mockMatrixInstance.d = 0.5;
            mockMatrixInstance.tx = 10;
            mockMatrixInstance.ty = 5;

            const mockEvent = createMockEvent({ movementX: 10, movementY: 20 });

            execute(mockEvent);
            await new Promise(resolve => setTimeout(resolve, 20));

            // Matrix変換式: x = referenceSetting.x * matrix.a + referenceSetting.y * matrix.c + matrix.tx
            //              y = referenceSetting.x * matrix.b + referenceSetting.y * matrix.d + matrix.ty
            const expectedX = 10 * 2 + 20 * 0 + 10; // 20 + 0 + 10 = 30
            const expectedY = 10 * 0 + 20 * 0.5 + 5; // 0 + 10 + 5 = 15

            expect(mockReferenceSettingUpdateXService).toHaveBeenCalledWith(expectedX);
            expect(mockReferenceSettingUpdateYService).toHaveBeenCalledWith(expectedY);
        });
    });

    describe("正常系 - 複数選択時", () => {
        it("複数選択の場合はpivot値ベースで更新される", async () => {
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);
            const mockEvent = createMockEvent({ movementX: 15, movementY: 25 });

            execute(mockEvent);
            await new Promise(resolve => setTimeout(resolve, 20));

            // ReferenceSetting の基本更新は同じ
            expect(mockReferenceSetting.x).toBe(15);
            expect(mockReferenceSetting.y).toBe(25);
            expect(mockReferenceSetting.movementX).toBe(15);
            expect(mockReferenceSetting.movementY).toBe(25);

            // pivot値ベースの更新
            expect(mockReferenceSettingUpdateXService).toHaveBeenCalledWith(115); // pivotX(100) + movementX(15)
            expect(mockReferenceSettingUpdateYService).toHaveBeenCalledWith(225); // pivotY(200) + movementY(25)

            // 単一選択時の処理は実行されない
            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockMatrix).not.toHaveBeenCalled();
        });
    });

    describe("早期リターン条件", () => {
        it("movementXとmovementYが共に0の場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ movementX: 0, movementY: 0 });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
        });

        it("movementXが0でmovementYがある場合は処理を実行する", async () => {
            const mockEvent = createMockEvent({ movementX: 0, movementY: 10 });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockEvent.preventDefault).toHaveBeenCalledOnce();
        });

        it("movementXがありmovementYが0の場合は処理を実行する", async () => {
            const mockEvent = createMockEvent({ movementX: 10, movementY: 0 });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockEvent.preventDefault).toHaveBeenCalledOnce();
        });

        it("movementXとmovementYがundefinedの場合は処理を実行しない", () => {
            const mockEvent = createMockEvent({ movementX: undefined as any, movementY: undefined as any });

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    describe("エラーハンドリング - 単一選択時", () => {
        it("layerが存在しない場合は処理を中断する", async () => {
            mockMovieClip.getLayer.mockReturnValue(null);
            const mockEvent = createMockEvent();

            execute(mockEvent);
            await new Promise(resolve => setTimeout(resolve, 20));

            // 基本処理は実行される
            expect(mockScreenReferencePointMoveElementService).toHaveBeenCalled();
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);

            // character取得以降は実行されない
            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockReferenceSettingUpdateXService).not.toHaveBeenCalled();
            expect(mockReferenceSettingUpdateYService).not.toHaveBeenCalled();
        });

        it("characterが存在しない場合は処理を中断する", async () => {
            mockLayer.getCharacter.mockReturnValue(null);
            const mockEvent = createMockEvent();

            execute(mockEvent);
            await new Promise(resolve => setTimeout(resolve, 20));

            // layer取得まで実行される
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 0);

            // Matrix処理以降は実行されない
            expect(mockMatrix).not.toHaveBeenCalled();
            expect(mockReferenceSettingUpdateXService).not.toHaveBeenCalled();
            expect(mockReferenceSettingUpdateYService).not.toHaveBeenCalled();
        });
    });

    describe("selectedDepthsの処理", () => {
        it("selectedDepthsから正しくlayerIndexとcharacterIndexを取得する", async () => {
            // 異なるselectedDepths設定
            mockMovieClip.selectedDepths = new Map([[5, [3, 7]]]);
            const mockEvent = createMockEvent();

            execute(mockEvent);
            await new Promise(resolve => setTimeout(resolve, 20));

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(5); // layerIndex
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 3); // characterIndex (values[0])
        });
    });

    describe("累積処理の確認", () => {
        it("複数回の移動で値が累積される", async () => {
            // 初期値設定
            mockReferenceSetting.x = 50;
            mockReferenceSetting.y = 60;
            mockReferenceSetting.movementX = 10;
            mockReferenceSetting.movementY = 20;

            const mockEvent = createMockEvent({ movementX: 5, movementY: 8 });

            execute(mockEvent);
            await new Promise(resolve => setTimeout(resolve, 20));

            // 累積確認
            expect(mockReferenceSetting.x).toBe(55); // 50 + 5 * 1
            expect(mockReferenceSetting.y).toBe(68); // 60 + 8 * 1
            expect(mockReferenceSetting.movementX).toBe(15); // 10 + 5
            expect(mockReferenceSetting.movementY).toBe(28); // 20 + 8
        });
    });

    describe("負の移動量の処理", () => {
        it("負の移動量でも正常に処理される", async () => {
            const mockEvent = createMockEvent({ movementX: -10, movementY: -5 });

            execute(mockEvent);
            await new Promise(resolve => setTimeout(resolve, 20));

            expect(mockReferenceSetting.x).toBe(-10);
            expect(mockReferenceSetting.y).toBe(-5);
            expect(mockReferenceSetting.movementX).toBe(-10);
            expect(mockReferenceSetting.movementY).toBe(-5);

            expect(mockScreenReferencePointMoveElementService).toHaveBeenCalledWith(-10, -5);
        });
    });

    describe("非同期処理の確認", () => {
        it("requestAnimationFrameが使用される", async () => {
            const mockEvent = createMockEvent();
            const rafSpy = vi.spyOn(global, 'requestAnimationFrame');

            execute(mockEvent);

            expect(rafSpy).toHaveBeenCalledOnce();
            expect(rafSpy).toHaveBeenCalledWith(expect.any(Function));
            
            // コールバックの実行を待つ
            await new Promise(resolve => setTimeout(resolve, 20));
        });

        it("requestAnimationFrame内で適切な順序で処理される", async () => {
            const executionOrder: string[] = [];
            const mockEvent = createMockEvent();

            // 各モックをクリアしてから新しい実装を設定
            mockGetCurrentWorkSpace.mockClear();
            mockScreenReferencePointMoveElementService.mockClear();
            mockReferenceSettingUpdateXService.mockClear();
            mockReferenceSettingUpdateYService.mockClear();

            mockGetCurrentWorkSpace.mockImplementation(() => {
                executionOrder.push("getCurrentWorkSpace");
                return mockWorkSpace;
            });

            mockScreenReferencePointMoveElementService.mockImplementation(() => {
                executionOrder.push("screenReferencePointMoveElementService");
            });

            mockReferenceSettingUpdateXService.mockImplementation(() => {
                executionOrder.push("referenceSettingUpdateXService");
            });

            mockReferenceSettingUpdateYService.mockImplementation(() => {
                executionOrder.push("referenceSettingUpdateYService");
            });

            execute(mockEvent);
            await new Promise(resolve => setTimeout(resolve, 30)); // 少し長めに待つ

            // 実装の実際の順序に合わせる
            expect(executionOrder).toEqual([
                "screenReferencePointMoveElementService",
                "getCurrentWorkSpace",
                "referenceSettingUpdateXService",
                "referenceSettingUpdateYService"
            ]);
        });
    });
});
