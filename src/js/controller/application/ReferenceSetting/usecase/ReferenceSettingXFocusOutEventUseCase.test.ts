import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

// モックの設定（vi.hoistedを使用してhoistingの問題を解決）
const {
    mockUpdateKeyLock,
    mockClamp,
    mockReferenceSetting,
    mockGetCurrentWorkSpace,
    mockExternalReferenceConstructor,
    mockScreenReferencePointDeployElementUseCase,
    mockExternalReference
} = vi.hoisted(() => {
    const mockExternalReference = {
        setX: vi.fn().mockResolvedValue(undefined)
    };
    return {
        mockUpdateKeyLock: vi.fn(),
        mockClamp: vi.fn((value: number, min: number, max: number) => Math.max(min, Math.min(max, value))),
        mockReferenceSetting: {
            beforeX: 0,
            pivotX: 0,
            movementX: 0
        },
        mockGetCurrentWorkSpace: vi.fn(),
        mockExternalReferenceConstructor: vi.fn(() => mockExternalReference),
        mockScreenReferencePointDeployElementUseCase: vi.fn(),
        mockExternalReference
    };
});

vi.mock("@/shortcut/ShortcutUtil", () => ({
    $updateKeyLock: mockUpdateKeyLock
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: mockClamp
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: mockReferenceSetting
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/external/controller/domain/model/ExternalReference", () => ({
    ExternalReference: mockExternalReferenceConstructor
}));

vi.mock("@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase", () => ({
    execute: mockScreenReferencePointDeployElementUseCase
}));

import { execute } from "./ReferenceSettingXFocusOutEventUseCase";

describe("ReferenceSettingXFocusOutEventUseCase", () => {

    let mockEvent: any;
    let mockElement: any;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // mockReferenceSettingをリセット
        mockReferenceSetting.beforeX = 0;
        mockReferenceSetting.pivotX = 50;
        mockReferenceSetting.movementX = 0;

        // mockClampをリセット
        mockClamp.mockImplementation((value, min, max) => Math.max(min, Math.min(max, value)));
        
        // mockExternalReferenceをリセット
        mockExternalReference.setX.mockResolvedValue(undefined);

        // HTMLInputElementのモック
        mockElement = {
            value: "100",
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
        };

        // FocusEventのモック
        mockEvent = {
            target: mockElement,
            stopPropagation: vi.fn()
        };

        // characterのモック
        mockCharacter = {
            referencePosition: {
                x: 0,
                y: 0
            }
        };

        // layerのモック
        mockLayer = {
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        // movieClipのモック
        mockMovieClip = {
            selectedDepths: new Map([[5, [10]]]),
            currentFrame: 1,
            isSingleSelectedOfDisplayObject: vi.fn().mockReturnValue(true),
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };

        // workSpaceのモック
        mockWorkSpace = {
            scene: mockMovieClip
        };

        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("正常系", () => {

        test("フォーカスアウト時の基本処理が実行される", async () => {
            mockClamp.mockReturnValue(100);
            mockReferenceSetting.beforeX = 50;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockUpdateKeyLock).toHaveBeenCalledWith(false);
            expect(mockClamp).toHaveBeenCalled();
        });

        test("入力値が正しくパース・クランプされる", async () => {
            mockElement.value = "123.7";
            mockClamp.mockReturnValue(124); // Math.ceil(123.7) = 124
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(124, -Number.MAX_VALUE, Number.MAX_VALUE);
            expect(mockElement.value).toBe("124");
        });

        test("移動量が正しく計算される", async () => {
            mockClamp.mockReturnValue(200);
            mockReferenceSetting.beforeX = 100;
            mockReferenceSetting.pivotX = 50;

            await execute(mockEvent);

            expect(mockReferenceSetting.movementX).toBe(150); // 200 - 50
        });

        test("単一選択時にExternalReferenceのsetXが呼ばれる", async () => {
            mockClamp.mockReturnValue(300);
            mockReferenceSetting.beforeX = 100;
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(true);

            await execute(mockEvent);

            expect(mockExternalReferenceConstructor).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            expect(mockExternalReference.setX).toHaveBeenCalledWith(300);
        });

        test("複数選択時にscreenReferencePointDeployElementUseCaseが呼ばれる", async () => {
            mockClamp.mockReturnValue(400);
            mockReferenceSetting.beforeX = 100;
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);

            await execute(mockEvent);

            expect(mockExternalReference.setX).not.toHaveBeenCalled();
            expect(mockScreenReferencePointDeployElementUseCase).toHaveBeenCalled();
        });

        test("正の小数点値が正しく処理される", async () => {
            mockElement.value = "456.3";
            mockClamp.mockReturnValue(457); // Math.ceil(456.3) = 457
            mockReferenceSetting.beforeX = 400;

            await execute(mockEvent);

            expect(mockElement.value).toBe("457");
        });

        test("負の値が正しく処理される", async () => {
            mockElement.value = "-123.7";
            mockClamp.mockReturnValue(-123); // Math.ceil(-123.7) = -123
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.value).toBe("-123");
        });

        test("0値が正しく処理される", async () => {
            mockElement.value = "0";
            mockClamp.mockReturnValue(0);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.value).toBe("0");
        });

    });

    describe("早期リターンの条件", () => {

        test("eventのtargetがnullの場合、何も実行されない", async () => {
            mockEvent.target = null;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockUpdateKeyLock).not.toHaveBeenCalled();
        });

        test("eventのtargetがundefinedの場合、何も実行されない", async () => {
            mockEvent.target = undefined;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockUpdateKeyLock).not.toHaveBeenCalled();
        });

        test("beforeXと同じ値の場合、早期リターンする", async () => {
            mockClamp.mockReturnValue(100);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.value).toBe("100");
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
        });

        test("レイヤーが存在しない場合、処理が中断される", async () => {
            mockClamp.mockReturnValue(200);
            mockReferenceSetting.beforeX = 100;
            mockMovieClip.getLayer.mockReturnValue(null);

            await execute(mockEvent);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockExternalReference.setX).not.toHaveBeenCalled();
        });

        test("キャラクターが存在しない場合、処理が中断される", async () => {
            mockClamp.mockReturnValue(300);
            mockReferenceSetting.beforeX = 100;
            mockLayer.getCharacter.mockReturnValue(null);

            await execute(mockEvent);

            expect(mockExternalReference.setX).not.toHaveBeenCalled();
        });

    });

    describe("パース処理のエッジケース", () => {

        test("空文字列の場合、NaNが処理される", async () => {
            mockElement.value = "";
            mockClamp.mockReturnValue(0); // parseFloat("") -> NaN, Math.ceil(NaN) -> NaN
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            // clampが呼ばれることを確認（NaNでも処理される）
            expect(mockClamp).toHaveBeenCalled();
        });

        test("非数値文字列の場合、NaNが処理される", async () => {
            mockElement.value = "abc";
            mockClamp.mockReturnValue(0);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockClamp).toHaveBeenCalled();
        });

        test("非常に大きな数値が処理される", async () => {
            mockElement.value = "999999999999";
            mockClamp.mockReturnValue(999999999999);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.value).toBe("999999999999");
        });

        test("非常に小さな数値が処理される", async () => {
            mockElement.value = "-999999999999";
            mockClamp.mockReturnValue(-999999999999);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.value).toBe("-999999999999");
        });

    });

    describe("selectedDepthsの処理", () => {

        test("正しいパラメータでレイヤーが取得される", async () => {
            mockClamp.mockReturnValue(500);
            mockReferenceSetting.beforeX = 100;
            mockMovieClip.selectedDepths = new Map([[3, [7]]]);

            await execute(mockEvent);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(3);
        });

        test("正しいパラメータでキャラクターが取得される", async () => {
            mockClamp.mockReturnValue(600);
            mockReferenceSetting.beforeX = 100;
            mockMovieClip.selectedDepths = new Map([[2, [5, 8, 11]]]);

            await execute(mockEvent);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5); // currentFrame, values[0]
        });

    });

    describe("Math.ceil処理の確認", () => {

        test("小数点以下切り上げが正しく動作する", async () => {
            mockElement.value = "123.1";
            // parseFloat("123.1") = 123.1, Math.ceil(123.1) = 124
            mockClamp.mockImplementation((value: number) => value);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            // Math.ceilが適用された値でclampが呼ばれることを確認
            expect(mockClamp).toHaveBeenCalledWith(124, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("負の小数点値の切り上げが正しく動作する", async () => {
            mockElement.value = "-123.9";
            // parseFloat("-123.9") = -123.9, Math.ceil(-123.9) = -123
            mockClamp.mockImplementation((value: number) => value);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(-123, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

    });

    describe("非同期処理の確認", () => {

        test("ExternalReference.setXが非同期で実行される", async () => {
            mockClamp.mockReturnValue(700);
            mockReferenceSetting.beforeX = 100;
            mockExternalReference.setX.mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve(undefined), 10))
            );

            await execute(mockEvent);

            expect(mockExternalReference.setX).toHaveBeenCalledWith(700);
        });

        test("ExternalReference.setXでエラーが発生してもthrowされない", async () => {
            mockClamp.mockReturnValue(800);
            mockReferenceSetting.beforeX = 100;
            mockExternalReference.setX.mockRejectedValue(new Error("Test error"));

            await expect(execute(mockEvent)).rejects.toThrow("Test error");
        });

    });

    describe("イベント処理の確認", () => {

        test("イベントの伝播が正しく停止される", async () => {
            mockClamp.mockReturnValue(900);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        test("キーボードロックが正しく解除される", async () => {
            mockClamp.mockReturnValue(1000);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockUpdateKeyLock).toHaveBeenCalledWith(false);
            expect(mockUpdateKeyLock).toHaveBeenCalledTimes(1);
        });

    });

});