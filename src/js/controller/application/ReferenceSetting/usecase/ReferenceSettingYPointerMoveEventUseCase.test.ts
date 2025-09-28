import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ReferenceSettingYPointerMoveEventUseCase";

// モックの設定
vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: {
        pivotY: 0,
        movementY: 0
    }
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: vi.fn((value, min, max) => Math.max(min, Math.min(max, value))),
    $setCursor: vi.fn()
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: vi.fn()
}));

vi.mock("@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("./ReferenceSettingUpdateYUseCase", () => ({
    execute: vi.fn()
}));

describe("ReferenceSettingYPointerMoveEventUseCase", () => {

    let mockEvent: any;
    let mockElement: any;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockSetCursor: any;
    let mockClamp: any;
    let mockGetCurrentWorkSpace: any;
    let mockScreenReferencePointDeployElementUseCase: any;
    let mockReferenceSettingUpdateYUseCase: any;
    let mockReferenceSetting: any;
    let originalRequestAnimationFrame: any;

    beforeEach(() => {
        // モック関数を設定
        mockSetCursor = vi.fn();
        mockClamp = vi.fn((value, min, max) => Math.max(min, Math.min(max, value)));
        mockGetCurrentWorkSpace = vi.fn();
        mockScreenReferencePointDeployElementUseCase = vi.fn();
        mockReferenceSettingUpdateYUseCase = vi.fn();

        // モックを適用
        vi.doMock("@/global/GlobalUtil", () => ({
            $clamp: mockClamp,
            $setCursor: mockSetCursor
        }));

        vi.doMock("@/core/application/CoreUtil", () => ({
            $getCurrentWorkSpace: mockGetCurrentWorkSpace
        }));

        vi.doMock("@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase", () => ({
            execute: mockScreenReferencePointDeployElementUseCase
        }));

        vi.doMock("./ReferenceSettingUpdateYUseCase", () => ({
            execute: mockReferenceSettingUpdateYUseCase
        }));

        mockReferenceSetting = {
            pivotY: 50,
            movementY: 0
        };

        vi.doMock("@/controller/domain/model/ReferenceSetting", () => ({
            referenceSetting: mockReferenceSetting
        }));

        // requestAnimationFrameのモック
        originalRequestAnimationFrame = global.requestAnimationFrame;
        global.requestAnimationFrame = vi.fn((callback) => {
            callback();
            return 1;
        });

        // HTMLInputElementのモック
        mockElement = {
            value: "100"
        };

        // movieClipのモック
        mockMovieClip = {
            selectedDepths: new Map()
        };

        // workSpaceのモック
        mockWorkSpace = {
            scene: mockMovieClip,
            scale: 1
        };

        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        // PointerEventのモック
        mockEvent = {
            movementX: 10, // Y座標処理でもmovementXを使用
            target: mockElement,
            stopPropagation: vi.fn(),
            preventDefault: vi.fn()
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        global.requestAnimationFrame = originalRequestAnimationFrame;
    });

    describe("正常系", () => {

        test("ポインタームーブ時の基本処理が実行される", () => {
            mockClamp.mockReturnValue(110);

            execute(mockEvent);

            expect(mockSetCursor).toHaveBeenCalledWith("ew-resize");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        test("requestAnimationFrameが呼び出される", () => {
            execute(mockEvent);

            expect(global.requestAnimationFrame).toHaveBeenCalled();
        });

        test("移動量とスケールを考慮した新しいY座標が計算される", () => {
            mockElement.value = "200";
            mockWorkSpace.scale = 2;
            mockEvent.movementX = 5; // Y座標でもmovementXを使用
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            // parseFloat("200") + 5 * 2 = 200 + 10 = 210, Math.ceil(210) = 210
            expect(mockClamp).toHaveBeenCalledWith(210, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("要素の値が更新される", () => {
            mockClamp.mockReturnValue(150);

            execute(mockEvent);

            expect(mockElement.value).toBe("150");
        });

        test("referenceSettingUpdateYUseCaseが正しく呼び出される", () => {
            mockClamp.mockReturnValue(180);

            execute(mockEvent);

            expect(mockReferenceSettingUpdateYUseCase).toHaveBeenCalledWith(mockMovieClip, 180);
        });

        test("referenceSettingの移動量が更新される", () => {
            mockClamp.mockReturnValue(200);
            mockReferenceSetting.pivotY = 50;

            execute(mockEvent);

            expect(mockReferenceSetting.movementY).toBe(150); // 200 - 50
        });

        test("screenReferencePointDeployElementUseCaseが呼び出される", () => {
            execute(mockEvent);

            expect(mockScreenReferencePointDeployElementUseCase).toHaveBeenCalled();
        });

        test("正の移動量が正しく処理される", () => {
            mockElement.value = "100";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = 15; // Y座標でもmovementXを使用
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(115, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("負の移動量が正しく処理される", () => {
            mockElement.value = "100";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = -20; // Y座標でもmovementXを使用
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(80, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

    });

    describe("早期リターンの条件", () => {

        test("movementXが0の場合、処理が中断される", () => {
            mockEvent.movementX = 0;

            execute(mockEvent);

            expect(mockSetCursor).toHaveBeenCalledWith("ew-resize");
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });

        test("movementXがundefinedの場合、処理が中断される", () => {
            mockEvent.movementX = undefined;

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });

        test("movementXがnullの場合、処理が中断される", () => {
            mockEvent.movementX = null;

            execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });

        test("requestAnimationFrame内でelementがnullの場合、処理が中断される", () => {
            mockEvent.target = null;

            execute(mockEvent);

            expect(mockClamp).not.toHaveBeenCalled();
            expect(mockReferenceSettingUpdateYUseCase).not.toHaveBeenCalled();
        });

        test("requestAnimationFrame内でelementがundefinedの場合、処理が中断される", () => {
            mockEvent.target = undefined;

            execute(mockEvent);

            expect(mockClamp).not.toHaveBeenCalled();
            expect(mockReferenceSettingUpdateYUseCase).not.toHaveBeenCalled();
        });

    });

    describe("スケール処理の検証", () => {

        test("スケール1.0の場合、移動量がそのまま適用される", () => {
            mockElement.value = "50";
            mockWorkSpace.scale = 1.0;
            mockEvent.movementX = 10; // Y座標でもmovementXを使用
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(60, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("スケール0.5の場合、移動量が半分になる", () => {
            mockElement.value = "50";
            mockWorkSpace.scale = 0.5;
            mockEvent.movementX = 20; // Y座標でもmovementXを使用
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(60, -Number.MAX_VALUE, Number.MAX_VALUE); // 50 + 20*0.5 = 60
        });

        test("スケール2.0の場合、移動量が2倍になる", () => {
            mockElement.value = "50";
            mockWorkSpace.scale = 2.0;
            mockEvent.movementX = 5; // Y座標でもmovementXを使用
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(60, -Number.MAX_VALUE, Number.MAX_VALUE); // 50 + 5*2.0 = 60
        });

        test("スケール0の場合、移動量が0になる", () => {
            mockElement.value = "50";
            mockWorkSpace.scale = 0;
            mockEvent.movementX = 100; // Y座標でもmovementXを使用
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(50, -Number.MAX_VALUE, Number.MAX_VALUE); // 50 + 100*0 = 50
        });

    });

    describe("Math.ceil処理の確認", () => {

        test("小数点以下切り上げが正しく動作する", () => {
            mockElement.value = "100.3";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = 2.7; // 100.3 + 2.7 = 103.0
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(103, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("負の小数点値の切り上げが正しく動作する", () => {
            mockElement.value = "50";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = -25.8; // 50 + (-25.8) = 24.2, Math.ceil(24.2) = 25
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(25, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("結果が整数の場合、そのまま処理される", () => {
            mockElement.value = "50";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = 25; // 50 + 25 = 75, Math.ceil(75) = 75
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(75, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

    });

    describe("parseFloat処理のエッジケース", () => {

        test("空文字列の場合、NaNが処理される", () => {
            mockElement.value = "";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = 10;

            execute(mockEvent);

            // parseFloat("") = NaN, NaN + 10 = NaN, Math.ceil(NaN) = NaN
            expect(mockClamp).toHaveBeenCalledWith(NaN, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("非数値文字列の場合、NaNが処理される", () => {
            mockElement.value = "abc";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = 5;

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(NaN, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("先頭が数値の場合、数値部分が使用される", () => {
            mockElement.value = "123abc";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = 7;
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(130, -Number.MAX_VALUE, Number.MAX_VALUE); // 123 + 7 = 130
        });

    });

    describe("movementX のエッジケース（Y座標でもX移動を使用）", () => {

        test("非常に大きな移動量が処理される", () => {
            mockElement.value = "100";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = 999999;
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(1000099, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("非常に小さな移動量が処理される", () => {
            mockElement.value = "100";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = -999999;
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(-999899, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("小数点の移動量が処理される", () => {
            mockElement.value = "100";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = 2.5;
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(103, -Number.MAX_VALUE, Number.MAX_VALUE); // Math.ceil(102.5) = 103
        });

    });

    describe("referenceSettingのY座標移動量計算", () => {

        test("pivotYが0の場合の移動量計算", () => {
            mockClamp.mockReturnValue(300);
            mockReferenceSetting.pivotY = 0;

            execute(mockEvent);

            expect(mockReferenceSetting.movementY).toBe(300); // 300 - 0
        });

        test("pivotYが負の値の場合の移動量計算", () => {
            mockClamp.mockReturnValue(100);
            mockReferenceSetting.pivotY = -50;

            execute(mockEvent);

            expect(mockReferenceSetting.movementY).toBe(150); // 100 - (-50)
        });

        test("結果がpivotYと同じ場合、移動量は0", () => {
            mockClamp.mockReturnValue(75);
            mockReferenceSetting.pivotY = 75;

            execute(mockEvent);

            expect(mockReferenceSetting.movementY).toBe(0); // 75 - 75
        });

    });

    describe("処理順序の確認", () => {

        test("requestAnimationFrame内の処理が正しい順序で実行される", () => {
            const callOrder: string[] = [];

            mockClamp.mockImplementation((value: number) => {
                callOrder.push("clamp");
                return value;
            });

            mockReferenceSettingUpdateYUseCase.mockImplementation(() => {
                callOrder.push("updateYUseCase");
            });

            mockScreenReferencePointDeployElementUseCase.mockImplementation(() => {
                callOrder.push("deployElement");
            });

            execute(mockEvent);

            expect(callOrder).toEqual([
                "clamp",
                "updateYUseCase",
                "deployElement"
            ]);
        });

    });

    describe("clamp処理の確認", () => {

        test("計算結果が範囲内の場合、そのまま使用される", () => {
            mockClamp.mockReturnValue(250);

            execute(mockEvent);

            expect(mockElement.value).toBe("250");
            expect(mockReferenceSettingUpdateYUseCase).toHaveBeenCalledWith(mockMovieClip, 250);
        });

        test("clampによる値の制限が正しく反映される", () => {
            mockClamp.mockReturnValue(1000); // clamp後の値

            execute(mockEvent);

            expect(mockElement.value).toBe("1000");
            expect(mockReferenceSettingUpdateYUseCase).toHaveBeenCalledWith(mockMovieClip, 1000);
        });

    });

    describe("Y座標特有の処理確認", () => {

        test("Y座標更新UseCaseが呼び出される", () => {
            mockClamp.mockReturnValue(300);

            execute(mockEvent);

            expect(mockReferenceSettingUpdateYUseCase).toHaveBeenCalledWith(mockMovieClip, 300);
            // X座標更新UseCaseは呼び出されないことを暗示的に確認
        });

        test("referenceSettingのY座標関連プロパティが更新される", () => {
            mockClamp.mockReturnValue(200);
            mockReferenceSetting.pivotY = 100;

            execute(mockEvent);

            expect(mockReferenceSetting.movementY).toBe(100); // 200 - 100
            // movementXは更新されないことを確認（undefinedのまま）
            expect(mockReferenceSetting.movementX).toBeUndefined();
        });

        test("Y座標でもX方向の移動量を使用することを確認", () => {
            // これはY座標入力でも水平ドラッグで値を変更する仕様の確認
            mockElement.value = "50";
            mockWorkSpace.scale = 1;
            mockEvent.movementX = 25; // Y座標処理でmovementXを使用
            mockEvent.movementY = 100; // movementYがあっても使用されない
            mockClamp.mockImplementation((value: number) => value);

            execute(mockEvent);

            // movementXが使用されることを確認
            expect(mockClamp).toHaveBeenCalledWith(75, -Number.MAX_VALUE, Number.MAX_VALUE); // 50 + 25
        });

    });

    describe("カーソル設定の確認", () => {

        test("Y座標でもew-resizeカーソルが設定される", () => {
            execute(mockEvent);

            expect(mockSetCursor).toHaveBeenCalledWith("ew-resize");
        });

        test("movementXが0の場合でもカーソルは設定される", () => {
            mockEvent.movementX = 0;

            execute(mockEvent);

            expect(mockSetCursor).toHaveBeenCalledWith("ew-resize");
        });

    });

});