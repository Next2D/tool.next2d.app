import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ReferenceSettingYPointerUpEventUseCase";
import { execute as referenceSettingYPointerMoveEventUseCase } from "./ReferenceSettingYPointerMoveEventUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { ExternalReference } from "@/external/controller/domain/model/ExternalReference";

// モックの設定
vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        POINTER_MOVE: "pointermove",
        POINTER_UP: "pointerup",
        POINTER_LEAVE: "pointerleave",
        POINTER_CANCEL: "pointercancel"
    }
}));

vi.mock("./ReferenceSettingYPointerMoveEventUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("@/external/controller/domain/model/ExternalReference", () => ({
    ExternalReference: vi.fn()
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: vi.fn()
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: {
        beforeY: 0,
        pivotY: 0,
        movementY: 0
    }
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: vi.fn((value, min, max) => Math.max(min, Math.min(max, value))),
    $setCursor: vi.fn()
}));

describe("ReferenceSettingYPointerUpEventUseCase", () => {

    let mockEvent: any;
    let mockElement: any;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockReferencePosition: any;
    let mockExternalReference: any;

    beforeEach(() => {
        // モックをクリア
        vi.clearAllMocks();

        // referenceSettingの値を初期化
        (referenceSetting as any).beforeY = 100;
        (referenceSetting as any).pivotY = 50;
        (referenceSetting as any).movementY = 0;

        // ExternalReferenceのモック
        mockExternalReference = {
            setY: vi.fn().mockResolvedValue(undefined)
        };

        (ExternalReference as any).mockImplementation(function() { return mockExternalReference; });

        // HTMLInputElementのモック
        mockElement = {
            value: "200",
            releasePointerCapture: vi.fn(),
            removeEventListener: vi.fn(),
            focus: vi.fn()
        };

        // referencePositionのモック
        mockReferencePosition = {
            x: 0,
            y: 200
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

        ($getCurrentWorkSpace as any).mockReturnValue(mockWorkSpace);
        ($clamp as any).mockImplementation((value: number, min: number, max: number) => 
            Math.max(min, Math.min(max, value))
        );
        ($setCursor as any).mockImplementation(() => {});

        // PointerEventのモック
        mockEvent = {
            pointerId: 1,
            target: mockElement,
            stopPropagation: vi.fn()
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("正常系", () => {

        test("ポインターアップ時の基本処理が実行される", async () => {
            ($clamp as any).mockReturnValue(200);

            await execute(mockEvent);

            expect(($setCursor as any)).toHaveBeenCalledWith("auto");
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        test("ポインターキャプチャが正しく解除される", async () => {
            mockEvent.pointerId = 5;
            ($clamp as any).mockReturnValue(200);

            await execute(mockEvent);

            expect(mockElement.releasePointerCapture).toHaveBeenCalledWith(5);
        });

        test("全てのイベントリスナーが削除される", async () => {
            ($clamp as any).mockReturnValue(200);

            await execute(mockEvent);

            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointermove",
                (referenceSettingYPointerMoveEventUseCase as any)
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
            ($clamp as any).mockReturnValue(300);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect((ExternalReference as any)).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
            expect(mockExternalReference.setY).toHaveBeenCalledWith(300);
        });

        test("要素の値が更新される", async () => {
            ($clamp as any).mockReturnValue(250);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(mockElement.value).toBe("250");
        });

        test("Y座標の移動量が正しく計算される", async () => {
            ($clamp as any).mockReturnValue(200);
            (referenceSetting as any).beforeY = 100;
            (referenceSetting as any).pivotY = 50;

            await execute(mockEvent);

            expect((referenceSetting as any).movementY).toBe(150); // 200 - 50
        });

        test("変更前に元のY座標に戻してから更新される", async () => {
            ($clamp as any).mockReturnValue(300);
            (referenceSetting as any).beforeY = 150;
            mockReferencePosition.y = 300;

            await execute(mockEvent);

            expect(mockReferencePosition.y).toBe(150); // beforeYで一度戻す
            expect(mockExternalReference.setY).toHaveBeenCalledWith(300); // 最終値で更新
        });

        test("処理完了後に要素にフォーカスが当たる", async () => {
            ($clamp as any).mockReturnValue(400);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalled();
        });

    });

    describe("値が変更されていない場合の早期リターン", () => {

        test("beforeYと同じ値の場合、フォーカス後に早期リターンする", async () => {
            ($clamp as any).mockReturnValue(100);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalled();
            expect(($getCurrentWorkSpace as any)).not.toHaveBeenCalled();
            expect(mockExternalReference.setY).not.toHaveBeenCalled();
        });

        test("Math.ceil後の値がbeforeYと同じ場合、早期リターンする", async () => {
            mockElement.value = "100.7";
            ($clamp as any).mockReturnValue(101); // Math.ceil(100.7) = 101
            (referenceSetting as any).beforeY = 101;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalled();
            expect(mockExternalReference.setY).not.toHaveBeenCalled();
        });

    });

    describe("早期リターンの条件", () => {

        test("eventのtargetがnullの場合、何も実行されない", async () => {
            mockEvent.target = null;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(($setCursor as any)).toHaveBeenCalledWith("auto"); // カーソルリセットは実行される
        });

        test("eventのtargetがundefinedの場合、何も実行されない", async () => {
            mockEvent.target = undefined;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(($setCursor as any)).toHaveBeenCalledWith("auto");
        });

        test("レイヤーが存在しない場合、処理が中断される", async () => {
            ($clamp as any).mockReturnValue(500);
            (referenceSetting as any).beforeY = 100;
            mockMovieClip.getLayer.mockReturnValue(null);

            await execute(mockEvent);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockExternalReference.setY).not.toHaveBeenCalled();
        });

        test("キャラクターが存在しない場合、処理が中断される", async () => {
            ($clamp as any).mockReturnValue(600);
            (referenceSetting as any).beforeY = 100;
            mockLayer.getCharacter.mockReturnValue(null);

            await execute(mockEvent);

            expect(mockExternalReference.setY).not.toHaveBeenCalled();
        });

        test("複数選択の場合、ExternalReferenceは使用されない", async () => {
            ($clamp as any).mockReturnValue(700);
            (referenceSetting as any).beforeY = 100;
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);

            await execute(mockEvent);

            expect(mockExternalReference.setY).not.toHaveBeenCalled();
            expect(mockElement.focus).toHaveBeenCalled();
        });

    });

    describe("Math.ceil とクランプ処理", () => {

        test("小数点以下切り上げが正しく動作する", async () => {
            mockElement.value = "123.4";
            ($clamp as any).mockImplementation((value: number) => value);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(($clamp as any)).toHaveBeenCalledWith(124, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("負の値の切り上げが正しく動作する", async () => {
            mockElement.value = "-123.8";
            ($clamp as any).mockImplementation((value: number) => value);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(($clamp as any)).toHaveBeenCalledWith(-123, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("整数値の場合、そのまま処理される", async () => {
            mockElement.value = "150";
            ($clamp as any).mockImplementation((value: number) => value);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(($clamp as any)).toHaveBeenCalledWith(150, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

    });

    describe("parseFloatのエッジケース", () => {

        test("空文字列の場合、NaNが処理される", async () => {
            mockElement.value = "";
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(($clamp as any)).toHaveBeenCalledWith(NaN, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("非数値文字列の場合、NaNが処理される", async () => {
            mockElement.value = "abc";
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(($clamp as any)).toHaveBeenCalledWith(NaN, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

        test("先頭が数値の場合、数値部分が使用される", async () => {
            mockElement.value = "789xyz";
            ($clamp as any).mockImplementation((value: number) => value);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(($clamp as any)).toHaveBeenCalledWith(789, -Number.MAX_VALUE, Number.MAX_VALUE);
        });

    });

    describe("selectedDepthsの処理", () => {

        test("selectedDepthsから正しくdepthが取得される", async () => {
            ($clamp as any).mockReturnValue(800);
            (referenceSetting as any).beforeY = 100;
            mockMovieClip.selectedDepths = new Map([[3, [7]]]);

            await execute(mockEvent);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(3);
        });

        test("正しいパラメータでキャラクターが取得される", async () => {
            ($clamp as any).mockReturnValue(900);
            (referenceSetting as any).beforeY = 100;
            mockMovieClip.selectedDepths = new Map([[2, [5, 8, 11]]]);

            await execute(mockEvent);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5); // currentFrame, values[0]
        });

    });

    describe("非同期処理の確認", () => {

        test("ExternalReference.setYが非同期で実行される", async () => {
            ($clamp as any).mockReturnValue(1000);
            (referenceSetting as any).beforeY = 100;
            mockExternalReference.setY.mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve(undefined), 10))
            );

            await execute(mockEvent);

            expect(mockExternalReference.setY).toHaveBeenCalledWith(1000);
        });

        test("ExternalReference.setYでエラーが発生してもthrowされる", async () => {
            ($clamp as any).mockReturnValue(1100);
            (referenceSetting as any).beforeY = 100;
            mockExternalReference.setY.mockRejectedValue(new Error("Test error"));

            await expect(execute(mockEvent)).rejects.toThrow("Test error");
        });

    });

    describe("referencePosition復元処理の確認", () => {

        test("変更前に正確にbeforeYで復元される", async () => {
            ($clamp as any).mockReturnValue(300);
            (referenceSetting as any).beforeY = 150;
            mockReferencePosition.y = 300; // 現在の値

            await execute(mockEvent);

            // beforeYで復元されることを確認
            expect(mockReferencePosition.y).toBe(150);
            // 最終的にExternalReference.setYが呼ばれることを確認
            expect(mockExternalReference.setY).toHaveBeenCalledWith(300);
        });

        test("beforeYが0の場合も正しく復元される", async () => {
            ($clamp as any).mockReturnValue(100);
            (referenceSetting as any).beforeY = 0;
            mockReferencePosition.y = 100;

            await execute(mockEvent);

            expect(mockReferencePosition.y).toBe(0);
            expect(mockExternalReference.setY).toHaveBeenCalledWith(100);
        });

        test("beforeYが負の値の場合も正しく復元される", async () => {
            ($clamp as any).mockReturnValue(50);
            (referenceSetting as any).beforeY = -25;
            mockReferencePosition.y = 50;

            await execute(mockEvent);

            expect(mockReferencePosition.y).toBe(-25);
            expect(mockExternalReference.setY).toHaveBeenCalledWith(50);
        });

    });

    describe("Y座標移動量計算の確認", () => {

        test("pivotYが0の場合の移動量計算", async () => {
            ($clamp as any).mockReturnValue(200);
            (referenceSetting as any).beforeY = 100;
            (referenceSetting as any).pivotY = 0;

            await execute(mockEvent);

            expect((referenceSetting as any).movementY).toBe(200); // 200 - 0
        });

        test("pivotYが負の値の場合の移動量計算", async () => {
            ($clamp as any).mockReturnValue(100);
            (referenceSetting as any).beforeY = 50;
            (referenceSetting as any).pivotY = -30;

            await execute(mockEvent);

            expect((referenceSetting as any).movementY).toBe(130); // 100 - (-30)
        });

        test("結果がpivotYと同じ場合、移動量は0", async () => {
            ($clamp as any).mockReturnValue(75);
            (referenceSetting as any).beforeY = 50;
            (referenceSetting as any).pivotY = 75;

            await execute(mockEvent);

            expect((referenceSetting as any).movementY).toBe(0); // 75 - 75
        });

    });

    describe("フォーカス処理の確認", () => {

        test("値変更時もフォーカスが当たる", async () => {
            ($clamp as any).mockReturnValue(500);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalledTimes(1);
        });

        test("早期リターン時もフォーカスが当たる", async () => {
            ($clamp as any).mockReturnValue(100);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(mockElement.focus).toHaveBeenCalledTimes(1);
        });

    });

    describe("Y座標特有の処理確認", () => {

        test("Y座標用のPointerMoveEventUseCaseが削除される", async () => {
            ($clamp as any).mockReturnValue(300);

            await execute(mockEvent);

            expect(mockElement.removeEventListener).toHaveBeenCalledWith(
                "pointermove",
                (referenceSettingYPointerMoveEventUseCase as any)
            );
            // X座標用のハンドラーは削除されないことを確認（呼ばれていない）
        });

        test("Y座標のreferencePosition.yが操作される", async () => {
            ($clamp as any).mockReturnValue(400);
            (referenceSetting as any).beforeY = 200;

            await execute(mockEvent);

            // Y座標が beforeY で復元されることを確認
            expect(mockReferencePosition.y).toBe(200);
            // X座標は操作されないことを確認
            expect(mockReferencePosition.x).toBe(0); // 初期値のまま
        });

        test("ExternalReference.setYが呼び出される", async () => {
            ($clamp as any).mockReturnValue(500);
            (referenceSetting as any).beforeY = 100;

            await execute(mockEvent);

            expect(mockExternalReference.setY).toHaveBeenCalledWith(500);
            // setXは呼び出されないことを暗示的に確認
        });

        test("Y座標のreferenceSetting.movementYが更新される", async () => {
            ($clamp as any).mockReturnValue(300);
            (referenceSetting as any).beforeY = 100;
            (referenceSetting as any).pivotY = 100;

            await execute(mockEvent);

            expect((referenceSetting as any).movementY).toBe(200); // 300 - 100
            // movementXは更新されないことを確認（undefinedのまま）
            expect((referenceSetting as any).movementX).toBeUndefined();
        });

    });

    describe("イベントリスナー削除の詳細確認", () => {

        test("Y座標用のハンドラーが正しく削除される", async () => {
            ($clamp as any).mockReturnValue(600);

            await execute(mockEvent);

            const calls = mockElement.removeEventListener.mock.calls;
            expect(calls[0]).toEqual(["pointermove", (referenceSettingYPointerMoveEventUseCase as any)]);
            expect(calls[1]).toEqual(["pointerup", execute]);
            expect(calls[2]).toEqual(["pointerleave", execute]);
            expect(calls[3]).toEqual(["pointercancel", execute]);
        });

        test("4つすべてのイベントタイプが削除される", async () => {
            ($clamp as any).mockReturnValue(700);

            await execute(mockEvent);

            expect(mockElement.removeEventListener).toHaveBeenCalledTimes(4);
            
            const eventTypes = mockElement.removeEventListener.mock.calls.map((call: any) => call[0]);
            expect(eventTypes).toContain("pointermove");
            expect(eventTypes).toContain("pointerup");
            expect(eventTypes).toContain("pointerleave");
            expect(eventTypes).toContain("pointercancel");
        });

    });

});