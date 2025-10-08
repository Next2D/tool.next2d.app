import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import type { IPivotType } from "../../../../interface/IPivotType";

// モックの設定（vi.hoistedを使用してhoistingの問題を解決）
const {
    mockUpdateCellValueService,
    mockUpdateXService,
    mockUpdateYService,
    mockReferenceSetting
} = vi.hoisted(() => {
    return {
        mockUpdateCellValueService: vi.fn(),
        mockUpdateXService: vi.fn(),
        mockUpdateYService: vi.fn(),
        mockReferenceSetting: {
            pivotX: 0,
            pivotY: 0,
            pivot: "middle-center"
        }
    };
});

vi.mock("../service/ReferenceSettingUpdateCellValueService", () => ({
    execute: mockUpdateCellValueService
}));

vi.mock("../service/ReferenceSettingUpdateXService", () => ({
    execute: mockUpdateXService
}));

vi.mock("../service/ReferenceSettingUpdateYService", () => ({
    execute: mockUpdateYService
}));

vi.mock("@/controller/domain/model/ReferenceSetting", () => ({
    referenceSetting: mockReferenceSetting
}));

import { execute } from "./ReferenceSettingUpdateElementUseCase";

describe("ReferenceSettingUpdateElementUseCase", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        // mockReferenceSettingのリセット
        mockReferenceSetting.pivotX = 0;
        mockReferenceSetting.pivotY = 0;
        mockReferenceSetting.pivot = "middle-center";
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("正常系", () => {

        test("全てのサービスが正しい引数で呼ばれる", () => {
            const pivot: IPivotType = "top-left";
            const x = 100;
            const y = 200;

            execute(pivot, x, y);

            expect(mockUpdateCellValueService).toHaveBeenCalledWith(pivot);
            expect(mockUpdateXService).toHaveBeenCalledWith(x);
            expect(mockUpdateYService).toHaveBeenCalledWith(y);
        });

        test("referenceSettingのpivotXとpivotYが更新される", () => {
            const pivot: IPivotType = "bottom-right";
            const x = 150.5;
            const y = 250.75;

            execute(pivot, x, y);

            expect(mockReferenceSetting.pivotX).toBe(x);
            expect(mockReferenceSetting.pivotY).toBe(y);
        });

        test("各サービスが1回ずつ呼ばれる", () => {
            const pivot: IPivotType = "middle-center";
            const x = 0;
            const y = 0;

            execute(pivot, x, y);

            expect(mockUpdateCellValueService).toHaveBeenCalledTimes(1);
            expect(mockUpdateXService).toHaveBeenCalledTimes(1);
            expect(mockUpdateYService).toHaveBeenCalledTimes(1);
        });

        test("処理が正しい順序で実行される", () => {
            const callOrder: string[] = [];

            mockUpdateCellValueService.mockImplementation(() => callOrder.push("updateCellValue"));
            mockUpdateXService.mockImplementation(() => callOrder.push("updateX"));
            mockUpdateYService.mockImplementation(() => callOrder.push("updateY"));

            const pivot: IPivotType = "top-center";
            const x = 75;
            const y = 125;

            execute(pivot, x, y);

            expect(callOrder).toEqual([
                "updateCellValue",
                "updateX",
                "updateY"
            ]);
        });

    });

    describe("様々なpivot値でのテスト", () => {

        test("全てのpivot値で正しく動作する", () => {
            const pivotValues: IPivotType[] = [
                "top-left", "top-center", "top-right",
                "middle-left", "middle-center", "middle-right",
                "bottom-left", "bottom-center", "bottom-right"
            ];

            pivotValues.forEach((pivot, index) => {
                const x = index * 10;
                const y = index * 20;

                // モックをリセット
                vi.clearAllMocks();

                execute(pivot, x, y);

                expect(mockUpdateCellValueService).toHaveBeenCalledWith(pivot);
                expect(mockUpdateXService).toHaveBeenCalledWith(x);
                expect(mockUpdateYService).toHaveBeenCalledWith(y);
                expect(mockReferenceSetting.pivotX).toBe(x);
                expect(mockReferenceSetting.pivotY).toBe(y);
            });
        });

    });

    describe("様々な座標値でのテスト", () => {

        test("正の整数座標で正しく動作する", () => {
            const pivot: IPivotType = "middle-center";
            const x = 100;
            const y = 200;

            execute(pivot, x, y);

            expect(mockUpdateXService).toHaveBeenCalledWith(100);
            expect(mockUpdateYService).toHaveBeenCalledWith(200);
            expect(mockReferenceSetting.pivotX).toBe(100);
            expect(mockReferenceSetting.pivotY).toBe(200);
        });

        test("負の座標で正しく動作する", () => {
            const pivot: IPivotType = "top-left";
            const x = -50;
            const y = -75;

            execute(pivot, x, y);

            expect(mockUpdateXService).toHaveBeenCalledWith(-50);
            expect(mockUpdateYService).toHaveBeenCalledWith(-75);
            expect(mockReferenceSetting.pivotX).toBe(-50);
            expect(mockReferenceSetting.pivotY).toBe(-75);
        });

        test("小数点を含む座標で正しく動作する", () => {
            const pivot: IPivotType = "bottom-right";
            const x = 123.456;
            const y = 789.012;

            execute(pivot, x, y);

            expect(mockUpdateXService).toHaveBeenCalledWith(123.456);
            expect(mockUpdateYService).toHaveBeenCalledWith(789.012);
            expect(mockReferenceSetting.pivotX).toBe(123.456);
            expect(mockReferenceSetting.pivotY).toBe(789.012);
        });

        test("0の座標で正しく動作する", () => {
            const pivot: IPivotType = "middle-left";
            const x = 0;
            const y = 0;

            execute(pivot, x, y);

            expect(mockUpdateXService).toHaveBeenCalledWith(0);
            expect(mockUpdateYService).toHaveBeenCalledWith(0);
            expect(mockReferenceSetting.pivotX).toBe(0);
            expect(mockReferenceSetting.pivotY).toBe(0);
        });

        test("非常に大きな数値で正しく動作する", () => {
            const pivot: IPivotType = "top-right";
            const x = 9999999.999;
            const y = -8888888.888;

            execute(pivot, x, y);

            expect(mockUpdateXService).toHaveBeenCalledWith(9999999.999);
            expect(mockUpdateYService).toHaveBeenCalledWith(-8888888.888);
            expect(mockReferenceSetting.pivotX).toBe(9999999.999);
            expect(mockReferenceSetting.pivotY).toBe(-8888888.888);
        });

    });

    describe("複数回実行のテスト", () => {

        test("連続して実行しても正しく動作する", () => {
            // 1回目の実行
            execute("top-left", 10, 20);
            
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("top-left");
            expect(mockUpdateXService).toHaveBeenCalledWith(10);
            expect(mockUpdateYService).toHaveBeenCalledWith(20);
            expect(mockReferenceSetting.pivotX).toBe(10);
            expect(mockReferenceSetting.pivotY).toBe(20);

            // モックをリセット
            vi.clearAllMocks();

            // 2回目の実行
            execute("bottom-right", 100, 200);
            
            expect(mockUpdateCellValueService).toHaveBeenCalledWith("bottom-right");
            expect(mockUpdateXService).toHaveBeenCalledWith(100);
            expect(mockUpdateYService).toHaveBeenCalledWith(200);
            expect(mockReferenceSetting.pivotX).toBe(100);
            expect(mockReferenceSetting.pivotY).toBe(200);
        });

        test("同じ値で複数回実行しても正しく動作する", () => {
            const pivot: IPivotType = "middle-center";
            const x = 50;
            const y = 60;

            // 3回同じ値で実行
            execute(pivot, x, y);
            execute(pivot, x, y);
            execute(pivot, x, y);

            expect(mockUpdateCellValueService).toHaveBeenCalledTimes(3);
            expect(mockUpdateXService).toHaveBeenCalledTimes(3);
            expect(mockUpdateYService).toHaveBeenCalledTimes(3);
            
            // 最後の値が設定されている
            expect(mockReferenceSetting.pivotX).toBe(x);
            expect(mockReferenceSetting.pivotY).toBe(y);
        });

    });

    describe("referenceSettingの状態変更確認", () => {

        test("既存のpivotXとpivotYが上書きされる", () => {
            // 初期値を設定
            mockReferenceSetting.pivotX = 999;
            mockReferenceSetting.pivotY = 888;

            const pivot: IPivotType = "top-center";
            const x = 111;
            const y = 222;

            execute(pivot, x, y);

            expect(mockReferenceSetting.pivotX).toBe(111);
            expect(mockReferenceSetting.pivotY).toBe(222);
        });

        test("pivotX、pivotY以外のプロパティは変更されない", () => {
            // 他のプロパティを設定
            mockReferenceSetting.pivot = "initial-pivot";
            mockReferenceSetting.someOtherProperty = "initial-value";

            const pivot: IPivotType = "bottom-left";
            const x = 333;
            const y = 444;

            execute(pivot, x, y);

            // pivotXとpivotYのみ変更される
            expect(mockReferenceSetting.pivotX).toBe(333);
            expect(mockReferenceSetting.pivotY).toBe(444);
            // 他のプロパティは変更されない
            expect(mockReferenceSetting.pivot).toBe("initial-pivot");
            expect(mockReferenceSetting.someOtherProperty).toBe("initial-value");
        });

    });

    describe("サービスの依存関係確認", () => {

        test("各サービスが独立して呼ばれる", () => {
            const pivot: IPivotType = "middle-right";
            const x = 555;
            const y = 666;

            execute(pivot, x, y);

            // 各サービスが正しい引数で独立して呼ばれる
            expect(mockUpdateCellValueService).toHaveBeenCalledWith(pivot);
            expect(mockUpdateCellValueService).not.toHaveBeenCalledWith(x);
            expect(mockUpdateCellValueService).not.toHaveBeenCalledWith(y);

            expect(mockUpdateXService).toHaveBeenCalledWith(x);
            expect(mockUpdateXService).not.toHaveBeenCalledWith(pivot);
            expect(mockUpdateXService).not.toHaveBeenCalledWith(y);

            expect(mockUpdateYService).toHaveBeenCalledWith(y);
            expect(mockUpdateYService).not.toHaveBeenCalledWith(pivot);
            expect(mockUpdateYService).not.toHaveBeenCalledWith(x);
        });

        test.skip("サービスの実行がreferenceSettingの更新より先に行われる", () => {
            let servicesExecuted = false;
            let referenceSettingUpdated = false;

            mockUpdateCellValueService.mockImplementation(() => {
                servicesExecuted = true;
                expect(referenceSettingUpdated).toBe(false);
            });

            mockUpdateXService.mockImplementation(() => {
                expect(referenceSettingUpdated).toBe(false);
            });

            mockUpdateYService.mockImplementation(() => {
                expect(referenceSettingUpdated).toBe(false);
            });

            // referenceSettingの更新をフック
            const originalPivotXSetter = Object.getOwnPropertyDescriptor(mockReferenceSetting, 'pivotX')?.set;
            Object.defineProperty(mockReferenceSetting, 'pivotX', {
                set: (value) => {
                    referenceSettingUpdated = true;
                    expect(servicesExecuted).toBe(true);
                    if (originalPivotXSetter) originalPivotXSetter.call(mockReferenceSetting, value);
                },
                get: () => mockReferenceSetting._pivotX || 0,
                configurable: true
            });

            const pivot: IPivotType = "top-right";
            const x = 777;
            const y = 888;

            execute(pivot, x, y);
        });

    });

    describe("エッジケース", () => {

        test("NaN値でも処理される", () => {
            const pivot: IPivotType = "middle-center";
            const x = NaN;
            const y = NaN;

            execute(pivot, x, y);

            expect(mockUpdateXService).toHaveBeenCalledWith(NaN);
            expect(mockUpdateYService).toHaveBeenCalledWith(NaN);
            // NaNが設定されることを確認
            expect(isNaN(mockReferenceSetting.pivotX)).toBe(true);
            expect(isNaN(mockReferenceSetting.pivotY)).toBe(true);
        });

        test("Infinity値でも処理される", () => {
            const pivot: IPivotType = "bottom-center";
            const x = Infinity;
            const y = -Infinity;

            execute(pivot, x, y);

            expect(mockUpdateXService).toHaveBeenCalledWith(Infinity);
            expect(mockUpdateYService).toHaveBeenCalledWith(-Infinity);
            expect(mockReferenceSetting.pivotX).toBe(Infinity);
            expect(mockReferenceSetting.pivotY).toBe(-Infinity);
        });

    });

});