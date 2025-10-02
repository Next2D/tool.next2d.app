import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./TransformSettingUpdateElementUseCase";

// サービスのモック
const mockTransformSettingUpdateXElementService = vi.fn();
const mockTransformSettingUpdateYElementService = vi.fn();
const mockTransformSettingUpdateWidthElementService = vi.fn();
const mockTransformSettingUpdateHeightElementService = vi.fn();
const mockTransformSettingUpdateScaleXElementService = vi.fn();
const mockTransformSettingUpdateScaleYElementService = vi.fn();
const mockTransformSettingUpdateRotationElementService = vi.fn();

vi.mock("../service/TransformSettingUpdateXElementService", () => ({
    execute: mockTransformSettingUpdateXElementService
}));

vi.mock("../service/TransformSettingUpdateYElementService", () => ({
    execute: mockTransformSettingUpdateYElementService
}));

vi.mock("../service/TransformSettingUpdateWidthElementService", () => ({
    execute: mockTransformSettingUpdateWidthElementService
}));

vi.mock("../service/TransformSettingUpdateHeightElementService", () => ({
    execute: mockTransformSettingUpdateHeightElementService
}));

vi.mock("../service/TransformSettingUpdateScaleXElementService", () => ({
    execute: mockTransformSettingUpdateScaleXElementService
}));

vi.mock("../service/TransformSettingUpdateScaleYElementService", () => ({
    execute: mockTransformSettingUpdateScaleYElementService
}));

vi.mock("../service/TransformSettingUpdateRotationElementService", () => ({
    execute: mockTransformSettingUpdateRotationElementService
}));

describe("TransformSettingUpdateElementUseCase", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("正常系", () => {
        it("すべての値を正しく更新サービスに渡す", () => {
            const x = 100;
            const y = 200;
            const width = 300;
            const height = 400;
            const scaleX = 1.5;
            const scaleY = 2.0;
            const rotation = 45;

            execute(x, y, width, height, scaleX, scaleY, rotation);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(200);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(300);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(400);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(150); // 1.5 * 100
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(200); // 2.0 * 100
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(45);
        });

        it("すべてのサービスが1回ずつ呼ばれる", () => {
            execute(0, 0, 0, 0, 0, 0, 0);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledTimes(1);
        });

        it("0の値でも正しく処理される", () => {
            execute(0, 0, 0, 0, 0, 0, 0);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(0);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(0);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(0);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(0);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(0); // 0 * 100
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(0); // 0 * 100
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(0);
        });

        it("負の値でも正しく処理される", () => {
            execute(-50, -100, -200, -300, -1.5, -2.0, -90);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(-50);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(-100);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(-200);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(-300);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(-150); // -1.5 * 100
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(-200); // -2.0 * 100
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(-90);
        });

        it("小数点の値でも正しく処理される", () => {
            execute(10.5, 20.7, 30.3, 40.9, 0.75, 0.85, 22.5);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(10.5);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(20.7);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(30.3);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(40.9);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(75); // 0.75 * 100
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(85); // 0.85 * 100
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(22.5);
        });

        it("非常に大きな値でも正しく処理される", () => {
            execute(
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER
            );

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER * 100);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER * 100);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
        });

        it("非常に小さな値でも正しく処理される", () => {
            execute(
                Number.MIN_SAFE_INTEGER,
                Number.MIN_SAFE_INTEGER,
                Number.MIN_SAFE_INTEGER,
                Number.MIN_SAFE_INTEGER,
                Number.MIN_SAFE_INTEGER,
                Number.MIN_SAFE_INTEGER,
                Number.MIN_SAFE_INTEGER
            );

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER * 100);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER * 100);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(Number.MIN_SAFE_INTEGER);
        });
    });

    describe("スケール値の変換", () => {
        it("scaleX が 1.0 の場合、100 として渡される", () => {
            execute(0, 0, 0, 0, 1.0, 0, 0);

            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(100);
        });

        it("scaleY が 1.0 の場合、100 として渡される", () => {
            execute(0, 0, 0, 0, 0, 1.0, 0);

            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(100);
        });

        it("scaleX が 0.5 の場合、50 として渡される", () => {
            execute(0, 0, 0, 0, 0.5, 0, 0);

            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(50);
        });

        it("scaleY が 2.5 の場合、250 として渡される", () => {
            execute(0, 0, 0, 0, 0, 2.5, 0);

            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(250);
        });

        it("scaleX と scaleY が同じ値の場合", () => {
            execute(0, 0, 0, 0, 1.5, 1.5, 0);

            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(150);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(150);
        });

        it("scaleX と scaleY が異なる値の場合", () => {
            execute(0, 0, 0, 0, 0.8, 1.2, 0);

            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(80);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(120);
        });

        it("非常に小さなスケール値（0.01）", () => {
            execute(0, 0, 0, 0, 0.01, 0.01, 0);

            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(1);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(1);
        });

        it("非常に大きなスケール値（100）", () => {
            execute(0, 0, 0, 0, 100, 100, 0);

            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(10000);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(10000);
        });
    });

    describe("回転値の処理", () => {
        it("rotation が 0 度の場合", () => {
            execute(0, 0, 0, 0, 0, 0, 0);

            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(0);
        });

        it("rotation が 90 度の場合", () => {
            execute(0, 0, 0, 0, 0, 0, 90);

            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(90);
        });

        it("rotation が 180 度の場合", () => {
            execute(0, 0, 0, 0, 0, 0, 180);

            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(180);
        });

        it("rotation が 360 度の場合", () => {
            execute(0, 0, 0, 0, 0, 0, 360);

            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(360);
        });

        it("rotation が負の値の場合", () => {
            execute(0, 0, 0, 0, 0, 0, -45);

            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(-45);
        });

        it("rotation が 360 度を超える場合", () => {
            execute(0, 0, 0, 0, 0, 0, 450);

            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(450);
        });

        it("rotation が小数点の場合", () => {
            execute(0, 0, 0, 0, 0, 0, 22.5);

            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(22.5);
        });
    });

    describe("複数回の呼び出し", () => {
        it("2回呼び出した場合、各サービスが2回呼ばれる", () => {
            execute(10, 20, 30, 40, 1.0, 1.5, 45);
            execute(50, 60, 70, 80, 2.0, 2.5, 90);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledTimes(2);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledTimes(2);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledTimes(2);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledTimes(2);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledTimes(2);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledTimes(2);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledTimes(2);
        });

        it("複数回呼び出しで最後の値が正しく渡される", () => {
            execute(10, 20, 30, 40, 1.0, 1.0, 0);
            execute(100, 200, 300, 400, 2.0, 2.5, 90);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenLastCalledWith(100);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenLastCalledWith(200);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenLastCalledWith(300);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenLastCalledWith(400);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenLastCalledWith(200);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenLastCalledWith(250);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenLastCalledWith(90);
        });
    });

    describe("サービス呼び出しの順序", () => {
        it("サービスが正しい順序で呼ばれる", () => {
            const callOrder: string[] = [];

            mockTransformSettingUpdateXElementService.mockImplementation(() => {
                callOrder.push("x");
            });
            mockTransformSettingUpdateYElementService.mockImplementation(() => {
                callOrder.push("y");
            });
            mockTransformSettingUpdateWidthElementService.mockImplementation(() => {
                callOrder.push("width");
            });
            mockTransformSettingUpdateHeightElementService.mockImplementation(() => {
                callOrder.push("height");
            });
            mockTransformSettingUpdateScaleXElementService.mockImplementation(() => {
                callOrder.push("scaleX");
            });
            mockTransformSettingUpdateScaleYElementService.mockImplementation(() => {
                callOrder.push("scaleY");
            });
            mockTransformSettingUpdateRotationElementService.mockImplementation(() => {
                callOrder.push("rotation");
            });

            execute(10, 20, 30, 40, 1.0, 1.5, 45);

            expect(callOrder).toEqual(["x", "y", "width", "height", "scaleX", "scaleY", "rotation"]);
        });
    });

    describe("エラーハンドリング", () => {
        it("xElementService でエラーが発生した場合", () => {
            mockTransformSettingUpdateXElementService.mockImplementation(() => {
                throw new Error("xElementService failed");
            });

            expect(() => execute(10, 20, 30, 40, 1.0, 1.5, 45)).toThrow("xElementService failed");
        });

        it("yElementService でエラーが発生した場合", () => {
            mockTransformSettingUpdateYElementService.mockImplementation(() => {
                throw new Error("yElementService failed");
            });

            expect(() => execute(10, 20, 30, 40, 1.0, 1.5, 45)).toThrow("yElementService failed");
        });

        it("widthElementService でエラーが発生した場合", () => {
            mockTransformSettingUpdateWidthElementService.mockImplementation(() => {
                throw new Error("widthElementService failed");
            });

            expect(() => execute(10, 20, 30, 40, 1.0, 1.5, 45)).toThrow("widthElementService failed");
        });

        it("heightElementService でエラーが発生した場合", () => {
            mockTransformSettingUpdateHeightElementService.mockImplementation(() => {
                throw new Error("heightElementService failed");
            });

            expect(() => execute(10, 20, 30, 40, 1.0, 1.5, 45)).toThrow("heightElementService failed");
        });

        it("scaleXElementService でエラーが発生した場合", () => {
            mockTransformSettingUpdateScaleXElementService.mockImplementation(() => {
                throw new Error("scaleXElementService failed");
            });

            expect(() => execute(10, 20, 30, 40, 1.0, 1.5, 45)).toThrow("scaleXElementService failed");
        });

        it("scaleYElementService でエラーが発生した場合", () => {
            mockTransformSettingUpdateScaleYElementService.mockImplementation(() => {
                throw new Error("scaleYElementService failed");
            });

            expect(() => execute(10, 20, 30, 40, 1.0, 1.5, 45)).toThrow("scaleYElementService failed");
        });

        it("rotationElementService でエラーが発生した場合", () => {
            mockTransformSettingUpdateRotationElementService.mockImplementation(() => {
                throw new Error("rotationElementService failed");
            });

            expect(() => execute(10, 20, 30, 40, 1.0, 1.5, 45)).toThrow("rotationElementService failed");
        });

        it("中間でエラーが発生した場合、それ以降のサービスは呼ばれない", () => {
            mockTransformSettingUpdateWidthElementService.mockImplementation(() => {
                throw new Error("width failed");
            });

            expect(() => execute(10, 20, 30, 40, 1.0, 1.5, 45)).toThrow("width failed");

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingUpdateHeightElementService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateScaleXElementService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateScaleYElementService).not.toHaveBeenCalled();
            expect(mockTransformSettingUpdateRotationElementService).not.toHaveBeenCalled();
        });
    });

    describe("エッジケース", () => {
        it("Infinity 値でも処理される", () => {
            execute(Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity, Infinity);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(Infinity);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(-Infinity);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(Infinity);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(-Infinity);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(Infinity);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(-Infinity);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(Infinity);
        });

        it("NaN 値でも処理される", () => {
            execute(NaN, NaN, NaN, NaN, NaN, NaN, NaN);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(NaN);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(NaN);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(NaN);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(NaN);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalled();
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(NaN);

            // NaN * 100 = NaN なので、NaN が渡される
            const scaleXCall = mockTransformSettingUpdateScaleXElementService.mock.calls[0][0];
            const scaleYCall = mockTransformSettingUpdateScaleYElementService.mock.calls[0][0];
            expect(Number.isNaN(scaleXCall)).toBe(true);
            expect(Number.isNaN(scaleYCall)).toBe(true);
        });
    });

    describe("パフォーマンステスト", () => {
        it("高速に実行される", () => {
            const start = performance.now();
            execute(10, 20, 30, 40, 1.0, 1.5, 45);
            const end = performance.now();
            const duration = end - start;

            // 1ms以内で完了することを期待
            expect(duration).toBeLessThan(1);
        });

        it("大量の呼び出しでもパフォーマンスが安定している", () => {
            const start = performance.now();
            
            for (let i = 0; i < 1000; i++) {
                execute(i, i, i, i, i * 0.1, i * 0.1, i);
            }
            
            const end = performance.now();
            const duration = end - start;

            // 1000回の呼び出しが100ms以内で完了することを期待
            expect(duration).toBeLessThan(100);
            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledTimes(1000);
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際の変形設定更新シナリオ：オブジェクトの移動", () => {
            // シナリオ：オブジェクトを(50, 100)に移動
            execute(50, 100, 200, 150, 1.0, 1.0, 0);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(50);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(200);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(150);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(0);
        });

        it("実際の変形設定更新シナリオ：オブジェクトのリサイズ", () => {
            // シナリオ：オブジェクトを400x300にリサイズ
            execute(0, 0, 400, 300, 1.0, 1.0, 0);

            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(400);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(300);
        });

        it("実際の変形設定更新シナリオ：オブジェクトのスケール変更", () => {
            // シナリオ：オブジェクトを150%にスケール
            execute(0, 0, 100, 100, 1.5, 1.5, 0);

            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(150);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(150);
        });

        it("実際の変形設定更新シナリオ：オブジェクトの回転", () => {
            // シナリオ：オブジェクトを45度回転
            execute(100, 100, 200, 200, 1.0, 1.0, 45);

            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(45);
        });

        it("実際の変形設定更新シナリオ：複合的な変形", () => {
            // シナリオ：移動、リサイズ、スケール、回転をすべて適用
            execute(150, 250, 300, 200, 1.2, 0.8, 30);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(150);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(250);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(300);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(200);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(120);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(80);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(30);
        });

        it("実際の変形設定更新シナリオ：リセット操作", () => {
            // シナリオ：すべての値を初期値にリセット
            execute(0, 0, 100, 100, 1.0, 1.0, 0);

            expect(mockTransformSettingUpdateXElementService).toHaveBeenCalledWith(0);
            expect(mockTransformSettingUpdateYElementService).toHaveBeenCalledWith(0);
            expect(mockTransformSettingUpdateWidthElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateHeightElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateScaleXElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateScaleYElementService).toHaveBeenCalledWith(100);
            expect(mockTransformSettingUpdateRotationElementService).toHaveBeenCalledWith(0);
        });
    });

    describe("値の型チェック", () => {
        it("すべてnumber型が渡されることを確認", () => {
            execute(10, 20, 30, 40, 1.5, 2.0, 45);

            const xCall = mockTransformSettingUpdateXElementService.mock.calls[0][0];
            const yCall = mockTransformSettingUpdateYElementService.mock.calls[0][0];
            const widthCall = mockTransformSettingUpdateWidthElementService.mock.calls[0][0];
            const heightCall = mockTransformSettingUpdateHeightElementService.mock.calls[0][0];
            const scaleXCall = mockTransformSettingUpdateScaleXElementService.mock.calls[0][0];
            const scaleYCall = mockTransformSettingUpdateScaleYElementService.mock.calls[0][0];
            const rotationCall = mockTransformSettingUpdateRotationElementService.mock.calls[0][0];

            expect(typeof xCall).toBe("number");
            expect(typeof yCall).toBe("number");
            expect(typeof widthCall).toBe("number");
            expect(typeof heightCall).toBe("number");
            expect(typeof scaleXCall).toBe("number");
            expect(typeof scaleYCall).toBe("number");
            expect(typeof rotationCall).toBe("number");
        });
    });
});
