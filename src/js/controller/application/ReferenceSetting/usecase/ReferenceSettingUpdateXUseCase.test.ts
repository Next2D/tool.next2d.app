import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ReferenceSettingUpdateXUseCase";

// モックの設定
vi.mock("@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateCellValueService", () => ({
    execute: vi.fn()
}));

describe("ReferenceSettingUpdateXUseCase", () => {

    let mockMovieClip: any;
    let mockLayer: any;
    let mockCharacter: any;
    let mockReferencePosition: any;
    let mockUpdateCellValueService: any;

    beforeEach(() => {
        // モックされた関数を設定
        mockUpdateCellValueService = vi.fn();
        
        // モックを適用
        vi.doMock("@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateCellValueService", () => ({
            execute: mockUpdateCellValueService
        }));

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
        vi.restoreAllMocks();
    });

    describe("正常系", () => {

        test("単一選択でX座標が更新される", () => {
            const x = 200;

            execute(mockMovieClip, x);

            expect(mockCharacter.referencePosition.x).toBe(200);
        });

        test("pivotがnone以外の場合、ローカル位置が取得されY座標が設定される", () => {
            mockReferencePosition.pivot = "top-left";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 75, y: 125 });
            const x = 300;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.y).toBe(125);
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
            expect(mockReferencePosition.x).toBe(300);
        });

        test("pivotがnoneの場合、ローカル位置の取得は行われない", () => {
            mockReferencePosition.pivot = "none";
            const x = 400;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.getLocalPosition).not.toHaveBeenCalled();
            expect(mockUpdateCellValueService).not.toHaveBeenCalled();
            expect(mockReferencePosition.x).toBe(400);
        });

        test("pivotがundefinedでない場合、ローカル位置処理が実行される", () => {
            mockReferencePosition.pivot = undefined;
            const x = 500;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
            expect(mockReferencePosition.x).toBe(500);
        });

        test("正の小数点を含むX座標が正しく設定される", () => {
            const x = 123.456;

            execute(mockMovieClip, x);

            expect(mockCharacter.referencePosition.x).toBe(123.456);
        });

        test("負のX座標が正しく設定される", () => {
            const x = -789.123;

            execute(mockMovieClip, x);

            expect(mockCharacter.referencePosition.x).toBe(-789.123);
        });

        test("0のX座標が正しく設定される", () => {
            const x = 0;

            execute(mockMovieClip, x);

            expect(mockCharacter.referencePosition.x).toBe(0);
        });

    });

    describe("選択状態による条件分岐", () => {

        test("選択されたオブジェクトがない場合、何も実行されない", () => {
            mockMovieClip.selectedDepths = new Map();
            const x = 100;

            execute(mockMovieClip, x);

            expect(mockMovieClip.isSingleSelectedOfDisplayObject).not.toHaveBeenCalled();
            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockReferencePosition.x).toBe(0); // 初期値のまま
        });

        test("複数選択の場合、何も実行されない", () => {
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(false);
            const x = 200;

            execute(mockMovieClip, x);

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockReferencePosition.x).toBe(0); // 初期値のまま
        });

        test("単一選択の場合のみ処理が実行される", () => {
            mockMovieClip.isSingleSelectedOfDisplayObject.mockReturnValue(true);
            const x = 300;

            execute(mockMovieClip, x);

            expect(mockMovieClip.getLayer).toHaveBeenCalled();
            expect(mockReferencePosition.x).toBe(300);
        });

    });

    describe("レイヤーとキャラクターの取得", () => {

        test("レイヤーが存在しない場合、何も実行されない", () => {
            mockMovieClip.getLayer.mockReturnValue(null);
            const x = 400;

            execute(mockMovieClip, x);

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockReferencePosition.x).toBe(0); // 初期値のまま
        });

        test("キャラクターが存在しない場合、何も実行されない", () => {
            mockLayer.getCharacter.mockReturnValue(null);
            const x = 500;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.x).toBe(0); // 初期値のまま
        });

        test("正しいパラメータでレイヤーが取得される", () => {
            const x = 600;

            execute(mockMovieClip, x);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(5); // selectedDepths.keys().next().value
        });

        test("正しいパラメータでキャラクターが取得される", () => {
            const x = 700;

            execute(mockMovieClip, x);

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 10); // currentFrame, values[0]
        });

    });

    describe("selectedDepthsの処理", () => {

        test("selectedDepthsから正しくdepthが取得される", () => {
            mockMovieClip.selectedDepths = new Map([[3, [7]]]);
            const x = 800;

            execute(mockMovieClip, x);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(3);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 7);
        });

        test("複数のdepth値がある場合、最初の値が使用される", () => {
            mockMovieClip.selectedDepths = new Map([[2, [5, 8, 11]]]);
            const x = 900;

            execute(mockMovieClip, x);

            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(2);
            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 5); // values[0]
        });

    });

    describe("pivot処理のロジック", () => {

        test("pivotが'top-left'の場合、ローカル位置処理が実行される", () => {
            mockReferencePosition.pivot = "top-left";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 30, y: 40 });
            const x = 1000;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.y).toBe(40);
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
        });

        test("pivotが'bottom-right'の場合、ローカル位置処理が実行される", () => {
            mockReferencePosition.pivot = "bottom-right";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 60, y: 80 });
            const x = 1100;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.y).toBe(80);
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
        });

        test("pivotがnullの場合、ローカル位置処理が実行される", () => {
            mockReferencePosition.pivot = null;
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 90, y: 120 });
            const x = 1200;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.getLocalPosition).toHaveBeenCalled();
            expect(mockReferencePosition.y).toBe(120);
            expect(mockReferencePosition.pivot).toBe("none");
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("none");
        });

    });

    describe("getLocalPositionの戻り値処理", () => {

        test("getLocalPositionが小数点を含む値を返す場合", () => {
            mockReferencePosition.pivot = "middle-center";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 123.789, y: 456.123 });
            const x = 1300;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.y).toBe(456.123);
            expect(mockReferencePosition.x).toBe(1300);
        });

        test("getLocalPositionが負の値を返す場合", () => {
            mockReferencePosition.pivot = "top-center";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: -50, y: -75 });
            const x = 1400;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.y).toBe(-75);
            expect(mockReferencePosition.x).toBe(1400);
        });

        test("getLocalPositionが0を返す場合", () => {
            mockReferencePosition.pivot = "bottom-center";
            mockReferencePosition.getLocalPosition.mockReturnValue({ x: 0, y: 0 });
            const x = 1500;

            execute(mockMovieClip, x);

            expect(mockReferencePosition.y).toBe(0);
            expect(mockReferencePosition.x).toBe(1500);
        });

    });

    describe("処理の流れの確認", () => {

        test("pivot処理→X座標設定の順序で実行される", () => {
            const callOrder: string[] = [];
            
            mockReferencePosition.pivot = "middle-left";
            mockReferencePosition.getLocalPosition.mockImplementation(() => {
                callOrder.push("getLocalPosition");
                return { x: 100, y: 200 };
            });
            
            mockUpdateCellValueService.mockImplementation(() => {
                callOrder.push("updateCellValue");
            });

            // referencePosition.yとreferencePosition.xの設定を監視
            let ySet = false;
            let pivotSet = false;
            
            Object.defineProperty(mockReferencePosition, 'y', {
                set: (value) => {
                    callOrder.push(`set_y_${value}`);
                    ySet = true;
                },
                get: () => ySet ? 200 : 0,
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

            Object.defineProperty(mockReferencePosition, 'x', {
                set: (value) => {
                    callOrder.push(`set_x_${value}`);
                },
                configurable: true
            });

            const x = 1600;
            execute(mockMovieClip, x);

            expect(callOrder).toEqual([
                "getLocalPosition",
                "set_y_200",
                "set_pivot_none",
                "updateCellValue",
                "set_x_1600"
            ]);
        });

    });

    describe("エッジケース", () => {

        test("NaN値のX座標でも処理される", () => {
            const x = NaN;

            execute(mockMovieClip, x);

            expect(isNaN(mockCharacter.referencePosition.x)).toBe(true);
        });

        test("Infinity値のX座標でも処理される", () => {
            const x = Infinity;

            execute(mockMovieClip, x);

            expect(mockCharacter.referencePosition.x).toBe(Infinity);
        });

        test("-Infinity値のX座標でも処理される", () => {
            const x = -Infinity;

            execute(mockMovieClip, x);

            expect(mockCharacter.referencePosition.x).toBe(-Infinity);
        });

        test("非常に大きな数値のX座標でも処理される", () => {
            const x = Number.MAX_SAFE_INTEGER;

            execute(mockMovieClip, x);

            expect(mockCharacter.referencePosition.x).toBe(Number.MAX_SAFE_INTEGER);
        });

        test("非常に小さな数値のX座標でも処理される", () => {
            const x = Number.MIN_SAFE_INTEGER;

            execute(mockMovieClip, x);

            expect(mockCharacter.referencePosition.x).toBe(Number.MIN_SAFE_INTEGER);
        });

    });

    describe("referencePositionがundefinedの場合", () => {

        test("referencePositionがundefinedの場合、エラーが発生する", () => {
            mockCharacter.referencePosition = undefined;
            const x = 1700;

            expect(() => execute(mockMovieClip, x)).toThrow();
        });

        test("referencePositionがnullの場合、エラーが発生する", () => {
            mockCharacter.referencePosition = null;
            const x = 1800;

            expect(() => execute(mockMovieClip, x)).toThrow();
        });

    });

});