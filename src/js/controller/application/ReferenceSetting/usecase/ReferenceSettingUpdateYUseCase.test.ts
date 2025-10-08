import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

// モックの設定（vi.hoistedを使用してhoistingの問題を解決）
const { mockUpdateCellValueService } = vi.hoisted(() => {
    return {
        mockUpdateCellValueService: vi.fn()
    };
});

vi.mock("@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateCellValueService", () => ({
    execute: mockUpdateCellValueService
}));

import { execute } from "./ReferenceSettingUpdateYUseCase";

describe("ReferenceSettingUpdateYUseCase", () => {

    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockReferencePosition: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // referencePositionのモック作成
        mockReferencePosition = {
            x: 0,
            y: 0,
            pivot: "middle-center",
            getLocalPosition: vi.fn().mockReturnValue({ x: 50, y: 100 })
        };

        // characterのモック作成
        mockCharacter = {
            referencePosition: mockReferencePosition
        };

        // layerのモック作成
        mockLayer = {
            getCharacter: vi.fn().mockReturnValue(mockCharacter)
        };

        // movieClipのモック作成
        mockMovieClip = {
            selectedDepths: new Map([[5, [10]]]),
            currentFrame: 1,
            isSingleSelectedOfDisplayObject: vi.fn().mockReturnValue(true),
            getLayer: vi.fn().mockReturnValue(mockLayer)
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("正常系", () => {

        test("単一選択でY座標が更新される", () => {
            const y = 200;

            execute(mockMovieClip, y);

            expect(mockCharacter.referencePosition.y).toBe(200);
        });

        test("pivotがnone以外の場合、ローカル位置が取得されX座標が設定される", () => {
            mockReferencePosition.pivot = "top-left";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 75, y: 125 });
            const y = 300;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.x).toBe(75);
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
            expect(mockReferencePosition.y).toBe(300);
        });

        test("pivotがnoneの場合、ローカル位置の取得は行われない", () => {
            mockReferencePosition.pivot = "none";
            const y = 400;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.getLocalPosition).not.toHaveBeenCalled();
            expect(mockUpdateCellValueService).not.toHaveBeenCalled();
            expect(mockReferencePosition.y).toBe(400);
        });

        test("pivotがundefinedでない場合、ローカル位置処理が実行される", () => {
            mockReferencePosition.pivot = undefined;
            const y = 500;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
            expect(mockReferencePosition.y).toBe(500);
        });

        test("正の小数点を含むY座標が正しく設定される", () => {
            const y = 123.456;

            execute(mockMovieClip, y);

            expect(mockCharacter.referencePosition.y).toBe(123.456);
        });

        test("負のY座標が正しく設定される", () => {
            const y = -789.123;

            execute(mockMovieClip, y);

            expect(mockCharacter.referencePosition.y).toBe(-789.123);
        });

        test("0のY座標が正しく設定される", () => {
            const y = 0;

            execute(mockMovieClip, y);

            expect(mockCharacter.referencePosition.y).toBe(0);
        });

    });

    describe("選択状態による条件分岐", () => {

        test("選択されたオブジェクトがない場合、何も実行されない", () => {
            mockMovieClip.selectedDepths = new Map();
            const y = 100;

            execute(mockMovieClip, y);

            expect(mockMovieClip.isSingleSelectedOfDisplayObject).not.toHaveBeenCalled();
            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockReferencePosition.y).toBe(0); // 初期値のまま
        });

        test("複数選択の場合、何も実行されない", () => {
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);
            const y = 200;

            execute(mockMovieClip, y);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockReferencePosition.y).toBe(0); // 初期値のまま
        });

        test("単一選択の場合のみ処理が実行される", () => {
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(true);
            const y = 300;

            execute(mockMovieClip, y);

            expect(mockMovieClip.getLayer).toHaveBeenCalled();
            expect(mockReferencePosition.y).toBe(300);
        });

    });

    describe("レイヤーとキャラクターの取得", () => {

        test("レイヤーが存在しない場合、何も実行されない", () => {
            mockMovieClip.getLayer.mockReturnValue(null);
            const y = 400;

            execute(mockMovieClip, y);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockReferencePosition.y).toBe(0); // 初期値のまま
        });

        test("キャラクターが存在しない場合、何も実行されない", () => {
            mockLayer.getCharacter.mockReturnValue(null);
            const y = 500;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.y).toBe(0); // 初期値のまま
        });

        test("正しいパラメータでレイヤーが取得される", () => {
            const y = 600;

            execute(mockMovieClip, y);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(5); // selectedDepths.keys().next().value
        });

        test("正しいパラメータでキャラクターが取得される", () => {
            const y = 700;

            execute(mockMovieClip, y);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 10); // currentFrame, values[0]
        });

    });

    describe("selectedDepthsの処理", () => {

        test("selectedDepthsから正しくdepthが取得される", () => {
            mockMovieClip.selectedDepths = new Map([[3, [7]]]);
            const y = 800;

            execute(mockMovieClip, y);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(3);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 7);
        });

        test("複数のdepth値がある場合、最初の値が使用される", () => {
            mockMovieClip.selectedDepths = new Map([[2, [5, 8, 11]]]);
            const y = 900;

            execute(mockMovieClip, y);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(2);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5); // values[0]
        });

    });

    describe("pivot処理のロジック", () => {

        test("pivotが'top-left'の場合、ローカル位置処理が実行される", () => {
            mockReferencePosition.pivot = "top-left";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 30, y: 40 });
            const y = 1000;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.x).toBe(30);
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
        });

        test("pivotが'bottom-right'の場合、ローカル位置処理が実行される", () => {
            mockReferencePosition.pivot = "bottom-right";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 60, y: 80 });
            const y = 1100;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.x).toBe(60);
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
        });

        test("pivotがnullの場合、ローカル位置処理が実行される", () => {
            mockReferencePosition.pivot = null;
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 90, y: 120 });
            const y = 1200;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.x).toBe(90);
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
        });

    });

    describe("getLocalPositionの戻り値処理", () => {

        test("getLocalPositionが小数点を含む値を返す場合", () => {
            mockReferencePosition.pivot = "middle-center";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 123.789, y: 456.123 });
            const y = 1300;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.x).toBe(123.789);
            expect(mockReferencePosition.y).toBe(1300);
        });

        test("getLocalPositionが負の値を返す場合", () => {
            mockReferencePosition.pivot = "top-center";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: -50, y: -75 });
            const y = 1400;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.x).toBe(-50);
            expect(mockReferencePosition.y).toBe(1400);
        });

        test("getLocalPositionが0を返す場合", () => {
            mockReferencePosition.pivot = "bottom-center";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 0, y: 0 });
            const y = 1500;

            execute(mockMovieClip, y);

            expect(mockReferencePosition.x).toBe(0);
            expect(mockReferencePosition.y).toBe(1500);
        });

    });

    describe("処理の流れの確認", () => {

        test("pivot処理→Y座標設定の順序で実行される", () => {
            const callOrder: string[] = [];
            
            mockReferencePosition.pivot = "middle-left";
            mockReferencePosition.getLocalPosition.mockImplementation(() => {
                callOrder.push("getLocalPosition");
                return { x: 100, y: 200 };
            });
            
            mockUpdateCellValueService.mockImplementation(() => {
                callOrder.push("updateCellValue");
            });

            // referencePosition.xとreferencePosition.yの設定を監視
            let xSet = false;
            let pivotSet = false;
            
            Object.defineProperty(mockReferencePosition, 'x', {
                set: (value) => {
                    callOrder.push(`set_x_${value}`);
                    xSet = true;
                },
                get: () => xSet ? 100 : 0,
                configurable: true
            });

            Object.defineProperty(mockReferencePosition, 'pivot', {
                set: (value) => {
                    callOrder.push(`set_pivot_${value}`);
                    pivotSet = true;
                },
                get: () => pivotSet ? "none" : "middle-left",
                configurable: true
            });

            Object.defineProperty(mockReferencePosition, 'y', {
                set: (value) => {
                    callOrder.push(`set_y_${value}`);
                },
                configurable: true
            });

            const y = 1600;
            execute(mockMovieClip, y);

            expect(callOrder).toEqual([
                "getLocalPosition",
                "set_x_100",
                "set_pivot_none",
                "updateCellValue",
                "set_y_1600"
            ]);
        });

    });

    describe("エッジケース", () => {

        test("NaN値のY座標でも処理される", () => {
            const y = NaN;

            execute(mockMovieClip, y);

            expect(isNaN(mockCharacter.referencePosition.y)).toBe(true);
        });

        test("Infinity値のY座標でも処理される", () => {
            const y = Infinity;

            execute(mockMovieClip, y);

            expect(mockCharacter.referencePosition.y).toBe(Infinity);
        });

        test("-Infinity値のY座標でも処理される", () => {
            const y = -Infinity;

            execute(mockMovieClip, y);

            expect(mockCharacter.referencePosition.y).toBe(-Infinity);
        });

        test("非常に大きな数値のY座標でも処理される", () => {
            const y = Number.MAX_SAFE_INTEGER;

            execute(mockMovieClip, y);

            expect(mockCharacter.referencePosition.y).toBe(Number.MAX_SAFE_INTEGER);
        });

        test("非常に小さな数値のY座標でも処理される", () => {
            const y = Number.MIN_SAFE_INTEGER;

            execute(mockMovieClip, y);

            expect(mockCharacter.referencePosition.y).toBe(Number.MIN_SAFE_INTEGER);
        });

    });

    describe("referencePositionがundefinedの場合", () => {

        test("referencePositionがundefinedの場合、エラーが発生する", () => {
            mockCharacter.referencePosition = undefined;
            const y = 1700;

            expect(() => execute(mockMovieClip, y)).toThrow();
        });

        test("referencePositionがnullの場合、エラーが発生する", () => {
            mockCharacter.referencePosition = null;
            const y = 1800;

            expect(() => execute(mockMovieClip, y)).toThrow();
        });

    });

});