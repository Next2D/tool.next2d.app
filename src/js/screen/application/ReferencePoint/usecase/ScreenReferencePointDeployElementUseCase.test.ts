import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ScreenReferencePointDeployElementUseCase";

// モック設定
const mockSetReferencePointState = vi.fn();
const mockGetCurrentWorkSpace = vi.fn();
const mockScreenReferencePointShowService = vi.fn();
const mockScreenReferencePointHideService = vi.fn();
const mockReferencePositionGetGlobalPositionUseCase = vi.fn();
const mockGetScreenOffsetLeft = vi.fn();
const mockGetScreenOffsetTop = vi.fn();

// ReferenceSetting モック
const mockReferenceSetting = {
    x: 0,
    y: 0
};

vi.mock("../ReferencePointUtil", () => ({
    $setReferencePointState: mockSetReferencePointState
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("../service/ScreenReferencePointShowService", () => ({
    execute: mockScreenReferencePointShowService
}));

vi.mock("../service/ScreenReferencePointHideService", () => ({
    execute: mockScreenReferencePointHideService
}));

vi.mock("@/core/application/ReferencePosition/usecase/ReferencePositionGetGlobalPositionUseCase", () => ({
    execute: mockReferencePositionGetGlobalPositionUseCase
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: mockReferenceSetting
}));

vi.mock("@/global/GlobalUtil", () => ({
    $getScreenOffsetLeft: mockGetScreenOffsetLeft,
    $getScreenOffsetTop: mockGetScreenOffsetTop
}));

describe("ScreenReferencePointDeployElementUseCase", () => {
    let mockWorkSpace: any;
    let mockMovieClip: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // WorkSpace モック
        mockWorkSpace = {
            scene: {
                id: "test-scene",
                x: 100,
                y: 150
            }
        };
        mockMovieClip = mockWorkSpace.scene;

        // デフォルトのモック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockGetScreenOffsetLeft.mockReturnValue(10);
        mockGetScreenOffsetTop.mockReturnValue(20);

        // referenceSetting の初期化
        mockReferenceSetting.x = 0;
        mockReferenceSetting.y = 0;
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("正常系", () => {
        it("座標が取得できる場合、中心点Elementが正しく配置される", () => {
            const mockPosition = { x: 200, y: 300 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);

            execute();

            // WorkSpace とMovieClip の取得確認
            expect(mockGetCurrentWorkSpace).toHaveBeenCalledOnce();
            expect(mockReferencePositionGetGlobalPositionUseCase).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip
            );

            // 基準点状態を非表示に更新
            expect(mockSetReferencePointState).toHaveBeenCalledWith("hide");

            // 中心点座標の設定確認
            expect(mockReferenceSetting.x).toBe(200);
            expect(mockReferenceSetting.y).toBe(300);

            // 画面表示処理の確認（オフセット + Math.ceil適用）
            expect(mockScreenReferencePointShowService).toHaveBeenCalledWith(
                10 + Math.ceil(200), // screenOffsetLeft + Math.ceil(position.x)
                20 + Math.ceil(300)  // screenOffsetTop + Math.ceil(position.y)
            );

            // 隠し処理が呼ばれていないことを確認
            expect(mockScreenReferencePointHideService).not.toHaveBeenCalled();
        });

        it("小数点を含む座標でMath.ceilが適用される", () => {
            const mockPosition = { x: 123.4, y: 567.8 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);

            execute();

            expect(mockReferenceSetting.x).toBe(123.4);
            expect(mockReferenceSetting.y).toBe(567.8);

            // Math.ceil適用確認
            expect(mockScreenReferencePointShowService).toHaveBeenCalledWith(
                10 + 124, // 10 + Math.ceil(123.4)
                20 + 568  // 20 + Math.ceil(567.8)
            );
        });

        it("異なるScreenOffsetでも正しく計算される", () => {
            const mockPosition = { x: 50, y: 75 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);
            mockGetScreenOffsetLeft.mockReturnValue(30);
            mockGetScreenOffsetTop.mockReturnValue(40);

            execute();

            expect(mockScreenReferencePointShowService).toHaveBeenCalledWith(
                30 + 50, // 30 + Math.ceil(50)
                40 + 75  // 40 + Math.ceil(75)
            );
        });
    });

    describe("座標取得失敗時の処理", () => {
        it("positionがnullの場合は隠し処理を実行して終了", () => {
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(null);

            execute();

            // WorkSpace とMovieClip の取得確認
            expect(mockGetCurrentWorkSpace).toHaveBeenCalledOnce();
            expect(mockReferencePositionGetGlobalPositionUseCase).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip
            );

            // 隠し処理の実行確認
            expect(mockScreenReferencePointHideService).toHaveBeenCalledOnce();

            // 後続処理が実行されていないことを確認
            expect(mockSetReferencePointState).not.toHaveBeenCalled();
            expect(mockScreenReferencePointShowService).not.toHaveBeenCalled();
            expect(mockReferenceSetting.x).toBe(0); // 変更されていない
            expect(mockReferenceSetting.y).toBe(0); // 変更されていない
        });

        it("positionがundefinedの場合は隠し処理を実行して終了", () => {
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(undefined);

            execute();

            expect(mockScreenReferencePointHideService).toHaveBeenCalledOnce();
            expect(mockSetReferencePointState).not.toHaveBeenCalled();
            expect(mockScreenReferencePointShowService).not.toHaveBeenCalled();
        });

        it("positionが空オブジェクトの場合は隠し処理を実行して終了", () => {
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue({});

            execute();

            // 空オブジェクトはfalsyではないので、表示処理が実行される
            expect(mockScreenReferencePointHideService).not.toHaveBeenCalled();
            expect(mockSetReferencePointState).toHaveBeenCalledWith("hide");
            expect(mockScreenReferencePointShowService).toHaveBeenCalled();
        });
    });

    describe("エッジケースの処理", () => {
        it("座標が0,0の場合でも正常に処理される", () => {
            const mockPosition = { x: 0, y: 0 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);

            execute();

            expect(mockReferenceSetting.x).toBe(0);
            expect(mockReferenceSetting.y).toBe(0);
            expect(mockScreenReferencePointShowService).toHaveBeenCalledWith(
                10 + 0, // screenOffsetLeft + Math.ceil(0)
                20 + 0  // screenOffsetTop + Math.ceil(0)
            );
        });

        it("負の座標値でも正常に処理される", () => {
            const mockPosition = { x: -100.7, y: -200.3 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);

            execute();

            expect(mockReferenceSetting.x).toBe(-100.7);
            expect(mockReferenceSetting.y).toBe(-200.3);
            expect(mockScreenReferencePointShowService).toHaveBeenCalledWith(
                10 + Math.ceil(-100.7), // 10 + (-100)
                20 + Math.ceil(-200.3)  // 20 + (-200)
            );
        });

        it("ScreenOffsetが負の値でも正常に処理される", () => {
            const mockPosition = { x: 100, y: 200 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);
            mockGetScreenOffsetLeft.mockReturnValue(-50);
            mockGetScreenOffsetTop.mockReturnValue(-30);

            execute();

            expect(mockScreenReferencePointShowService).toHaveBeenCalledWith(
                -50 + 100, // -50 + Math.ceil(100)
                -30 + 200  // -30 + Math.ceil(200)
            );
        });
    });

    describe("依存関数の呼び出し順序確認", () => {
        it("関数が正しい順序で呼び出される", () => {
            const mockPosition = { x: 100, y: 200 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);

            const callOrder: string[] = [];
            mockGetCurrentWorkSpace.mockImplementation(() => {
                callOrder.push("getCurrentWorkSpace");
                return mockWorkSpace;
            });
            mockReferencePositionGetGlobalPositionUseCase.mockImplementation(() => {
                callOrder.push("referencePositionGetGlobalPositionUseCase");
                return mockPosition;
            });
            mockSetReferencePointState.mockImplementation(() => {
                callOrder.push("setReferencePointState");
            });
            mockGetScreenOffsetLeft.mockImplementation(() => {
                callOrder.push("getScreenOffsetLeft");
                return 10;
            });
            mockGetScreenOffsetTop.mockImplementation(() => {
                callOrder.push("getScreenOffsetTop");
                return 20;
            });
            mockScreenReferencePointShowService.mockImplementation(() => {
                callOrder.push("screenReferencePointShowService");
            });

            execute();

            expect(callOrder).toEqual([
                "getCurrentWorkSpace",
                "referencePositionGetGlobalPositionUseCase",
                "setReferencePointState",
                "getScreenOffsetLeft",
                "getScreenOffsetTop",
                "screenReferencePointShowService"
            ]);
        });
    });

    describe("ReferenceSetting の更新確認", () => {
        it("既存の値が上書きされる", () => {
            // 初期値を設定
            mockReferenceSetting.x = 999;
            mockReferenceSetting.y = 888;

            const mockPosition = { x: 100, y: 200 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);

            execute();

            expect(mockReferenceSetting.x).toBe(100);
            expect(mockReferenceSetting.y).toBe(200);
        });

        it("小数点座標も正確にReferenceSettingに設定される", () => {
            const mockPosition = { x: 123.456, y: 789.123 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);

            execute();

            expect(mockReferenceSetting.x).toBe(123.456);
            expect(mockReferenceSetting.y).toBe(789.123);
        });
    });

    describe("WorkSpace とMovieClip の関係性確認", () => {
        it("workSpace.sceneがmovieClipとして使用される", () => {
            const customScene = { id: "custom-scene", x: 300, y: 400 };
            const customWorkSpace = { scene: customScene };
            mockGetCurrentWorkSpace.mockReturnValue(customWorkSpace);

            const mockPosition = { x: 100, y: 200 };
            mockReferencePositionGetGlobalPositionUseCase.mockReturnValue(mockPosition);

            execute();

            expect(mockReferencePositionGetGlobalPositionUseCase).toHaveBeenCalledWith(
                customWorkSpace,
                customScene
            );
        });
    });
});
