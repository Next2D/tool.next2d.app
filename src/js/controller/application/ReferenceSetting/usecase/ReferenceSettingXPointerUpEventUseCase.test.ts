import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

// モックの設定（vi.hoistedを使用してhoistingの問題を解決）
const { 
    mockSetCursor, 
    mockClamp, 
    mockGetCurrentWorkSpace, 
    mockReferenceSettingXPointerMoveEventUseCase,
    mockExternalReference,
    mockExternalReferenceConstructor,
    mockReferenceSetting
} = vi.hoisted(() => {
    const mockExternalReference = {
        setX: vi.fn().mockResolvedValue(undefined)
    };
    
    return {
        mockSetCursor: vi.fn(),
        mockClamp: vi.fn((value: number, min: number, max: number) => Math.max(min, Math.min(max, value))),
        mockGetCurrentWorkSpace: vi.fn(),
        mockReferenceSettingXPointerMoveEventUseCase: vi.fn(),
        mockExternalReference,
        mockExternalReferenceConstructor: vi.fn(() => mockExternalReference),
        mockReferenceSetting: {
            beforeX: 0,
            pivotX: 0,
            movementX: 0
        }
    };
});

vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        POINTER_MOVE: "pointermove",
        POINTER_UP: "pointerup",
        POINTER_LEAVE: "pointerleave",
        POINTER_CANCEL: "pointercancel"
    }
}));

vi.mock("./ReferenceSettingXPointerMoveEventUseCase", () => ({
    execute: mockReferenceSettingXPointerMoveEventUseCase
}));

vi.mock("@/external/controller/domain/model/ExternalReference", () => ({
    ExternalReference: mockExternalReferenceConstructor
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: mockReferenceSetting
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: mockClamp,
    $setCursor: mockSetCursor
}));

import { execute } from "./ReferenceSettingXPointerUpEventUseCase";

describe("ReferenceSettingXPointerUpEventUseCase", () => {

    let mockEvent: any;
    let mockElement: any;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockReferencePosition: any;

    beforeEach(() => {
        // モックをリセット
        vi.clearAllMocks();
        
        // mockReferenceSettingをリセット
        mockReferenceSetting.beforeX = 100;
        mockReferenceSetting.pivotX = 50;
        mockReferenceSetting.movementX = 0;

        // HTMLInputElementのモック
        mockElement = {
            value: "200",
            releasePointerCapture: vi.fn(),
            removeEventListener: vi.fn(),
            focus: vi.fn()
        };

        // referencePositionのモック
        mockReferencePosition = {
            x: 200,
            y: 0
        };

        // characterのモック
        mockCharacter = {
            referencePosition: mockReferencePosition
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
        mockExternalReference.setX.mockResolvedValue(undefined);
        mockClamp.mockImplementation((value, min, max) => Math.max(min, Math.min(max, value)));

        // PointerEventのモック
        mockEvent = {
            pointerId: 1,
            target: mockElement,
            stopPropagation: vi.fn()
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("正常系", () => {

        test("ポインターアップ時の基本処理が実行される", async () => {
            mockClamp.mockReturnValue(200);

            await execute(mockEvent);

            expect(mockSetCursor).toHaveBeenCalledWith("auto");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        test("ポインターキャプチャが正しく解除される", async () => {
            mockEvent.pointerId = 5;
            mockClamp.mockReturnValue(200);

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(5);
        });

        test("全てのイベントリスナーが削除される", async () => {
            mockClamp.mockReturnValue(200);

            await execute(mockEvent);

            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointermove",
                mockReferenceSettingXPointerMoveEventUseCase
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
        });

        test("値が変更された場合、ExternalReferenceで更新される", async () => {
            mockClamp.mockReturnValue(300);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockExternalReferenceConstructor).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            expect(mockExternalReference.setX).toHaveBeenCalledWith(300);
        });

        test("要素の値が更新される", async () => {
            mockClamp.mockReturnValue(250);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.value).toBe("250");
        });

        test("移動量が正しく計算される", async () => {
            mockClamp.mockReturnValue(200);
            mockReferenceSetting.beforeX = 100;
            mockReferenceSetting.pivotX = 50;

            await execute(mockEvent);

            expect(mockReferenceSetting.movementX).toBe(150); // 200 - 50
        });

        test("変更前に元の値に戻してから更新される", async () => {
            mockClamp.mockReturnValue(300);
            mockReferenceSetting.beforeX = 150;
            mockReferencePosition.x = 300;

            await execute(mockEvent);

            expect(mockReferencePosition.x).toBe(150); // beforeXで一度戻す
            expect(mockExternalReference.setX).toHaveBeenCalledWith(300); // 最終値で更新
        });

        test("処理完了後に要素にフォーカスが当たる", async () => {
            mockClamp.mockReturnValue(400);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalled();
        });

    });

    describe("値が変更されていない場合の早期リターン", () => {

        test("beforeXと同じ値の場合、フォーカス後に早期リターンする", async () => {
            mockClamp.mockReturnValue(100);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalled();
            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockExternalReference.setX).not.toHaveBeenCalled();
        });

        test("Math.ceil後の値がbeforeXと同じ場合、早期リターンする", async () => {
            mockElement.value = "100.7";
            mockClamp.mockReturnValue(101); // Math.ceil(100.7) = 101
            mockReferenceSetting.beforeX = 101;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalled();
            expect(mockExternalReference.setX).not.toHaveBeenCalled();
        });

    });

    describe("早期リターンの条件", () => {

        test("eventのtargetがnullの場合、何も実行されない", async () => {
            mockEvent.target = null;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetCursor).toHaveBeenCalledWith("auto"); // カーソルリセットは実行される
        });

        test("eventのtargetがundefinedの場合、何も実行されない", async () => {
            mockEvent.target = undefined;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockSetCursor).toHaveBeenCalledWith("auto");
        });

        test("レイヤーが存在しない場合、処理が中断される", async () => {
            mockClamp.mockReturnValue(500);
            mockReferenceSetting.beforeX = 100;
            mockMovieClip.getLayer.mockReturnValue(null);

            await execute(mockEvent);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockExternalReference.setX).not.toHaveBeenCalled();
        });

        test("キャラクターが存在しない場合、処理が中断される", async () => {
            mockClamp.mockReturnValue(600);
            mockReferenceSetting.beforeX = 100;
            mockLayer.getCharacter.mockReturnValue(null);

            await execute(mockEvent);

            expect(mockExternalReference.setX).not.toHaveBeenCalled();
        });

        test("複数選択の場合、ExternalReferenceは使用されない", async () => {
            mockClamp.mockReturnValue(700);
            mockReferenceSetting.beforeX = 100;
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);

            await execute(mockEvent);

            expect(mockExternalReference.setX).not.toHaveBeenCalled();
            expect(mockElement.focus).toHaveBeenCalled();
        });

    });

    describe("Math.ceil とクランプ処理", () => {

        test("小数点以下切り上げが正しく動作する", async () => {
            mockElement.value = "123.4";
            mockClamp.mockImplementation((value: number) => value);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(124, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("負の値の切り上げが正しく動作する", async () => {
            mockElement.value = "-123.8";
            mockClamp.mockImplementation((value: number) => value);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(-123, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("整数値の場合、そのまま処理される", async () => {
            mockElement.value = "150";
            mockClamp.mockImplementation((value: number) => value);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(150, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

    });

    describe("parseFloatのエッジケース", () => {

        test("空文字列の場合、NaNが処理される", async () => {
            mockElement.value = "";
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(NaN, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("非数値文字列の場合、NaNが処理される", async () => {
            mockElement.value = "abc";
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(NaN, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("先頭が数値の場合、数値部分が使用される", async () => {
            mockElement.value = "789xyz";
            mockClamp.mockImplementation((value: number) => value);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockClamp).toHaveBeenCalledWith(789, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

    });

    describe("selectedDepthsの処理", () => {

        test("selectedDepthsから正しくdepthが取得される", async () => {
            mockClamp.mockReturnValue(800);
            mockReferenceSetting.beforeX = 100;
            mockMovieClip.selectedDepths = new Map([[3, [7]]]);

            await execute(mockEvent);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(3);
        });

        test("正しいパラメータでキャラクターが取得される", async () => {
            mockClamp.mockReturnValue(900);
            mockReferenceSetting.beforeX = 100;
            mockMovieClip.selectedDepths = new Map([[2, [5, 8, 11]]]);

            await execute(mockEvent);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5); // currentFrame, values[0]
        });

    });

    describe("非同期処理の確認", () => {

        test("ExternalReference.setXが非同期で実行される", async () => {
            mockClamp.mockReturnValue(1000);
            mockReferenceSetting.beforeX = 100;
            mockExternalReference.setX.mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve(undefined), 10))
            );

            await execute(mockEvent);

            expect(mockExternalReference.setX).toHaveBeenCalledWith(1000);
        });

        test("ExternalReference.setXでエラーが発生してもthrowされる", async () => {
            mockClamp.mockReturnValue(1100);
            mockReferenceSetting.beforeX = 100;
            mockExternalReference.setX.mockRejectedValue(new Error("Test error"));

            await expect(execute(mockEvent)).rejects.toThrow("Test error");
        });

    });

    describe("referencePosition復元処理の確認", () => {

        test("変更前に正確にbeforeXで復元される", async () => {
            mockClamp.mockReturnValue(300);
            mockReferenceSetting.beforeX = 150;
            mockReferencePosition.x = 300; // 現在の値

            const originalX = mockReferencePosition.x;

            await execute(mockEvent);

            // beforeXで復元されることを確認
            expect(mockReferencePosition.x).toBe(150);
            // 最終的にExternalReference.setXが呼ばれることを確認
            expect(mockExternalReference.setX).toHaveBeenCalledWith(300);
        });

        test("beforeXが0の場合も正しく復元される", async () => {
            mockClamp.mockReturnValue(100);
            mockReferenceSetting.beforeX = 0;
            mockReferencePosition.x = 100;

            await execute(mockEvent);

            expect(mockReferencePosition.x).toBe(0);
            expect(mockExternalReference.setX).toHaveBeenCalledWith(100);
        });

        test("beforeXが負の値の場合も正しく復元される", async () => {
            mockClamp.mockReturnValue(50);
            mockReferenceSetting.beforeX = -25;
            mockReferencePosition.x = 50;

            await execute(mockEvent);

            expect(mockReferencePosition.x).toBe(-25);
            expect(mockExternalReference.setX).toHaveBeenCalledWith(50);
        });

    });

    describe("移動量計算の確認", () => {

        test("pivotXが0の場合の移動量計算", async () => {
            mockClamp.mockReturnValue(200);
            mockReferenceSetting.beforeX = 100;
            mockReferenceSetting.pivotX = 0;

            await execute(mockEvent);

            expect(mockReferenceSetting.movementX).toBe(200); // 200 - 0
        });

        test("pivotXが負の値の場合の移動量計算", async () => {
            mockClamp.mockReturnValue(100);
            mockReferenceSetting.beforeX = 50;
            mockReferenceSetting.pivotX = -30;

            await execute(mockEvent);

            expect(mockReferenceSetting.movementX).toBe(130); // 100 - (-30)
        });

        test("結果がpivotXと同じ場合、移動量は0", async () => {
            mockClamp.mockReturnValue(75);
            mockReferenceSetting.beforeX = 50;
            mockReferenceSetting.pivotX = 75;

            await execute(mockEvent);

            expect(mockReferenceSetting.movementX).toBe(0); // 75 - 75
        });

    });

    describe("フォーカス処理の確認", () => {

        test("値変更時もフォーカスが当たる", async () => {
            mockClamp.mockReturnValue(500);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalledTimes(1);
        });

        test("早期リターン時もフォーカスが当たる", async () => {
            mockClamp.mockReturnValue(100);
            mockReferenceSetting.beforeX = 100;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalledTimes(1);
        });

    });

});