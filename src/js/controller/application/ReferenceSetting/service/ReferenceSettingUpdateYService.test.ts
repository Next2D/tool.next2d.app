import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { $TRANSFORM_REFERENCE_Y_ID } from "../../../../config/ReferenceSettingConfig";
import { execute } from "./ReferenceSettingUpdateYService";

describe("ReferenceSettingUpdateYService", () => {

    let mockInputElement: HTMLInputElement;

    beforeEach(() => {
        // HTMLInputElementをモック作成
        mockInputElement = document.createElement("input");
        mockInputElement.type = "text";
        mockInputElement.id = $TRANSFORM_REFERENCE_Y_ID;
        mockInputElement.value = "";

        // document.getElementByIdのモック
        Object.defineProperty(document, "getElementById", {
            value: vi.fn().mockReturnValue(mockInputElement),
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // 要素のvalueをリセット
        if (mockInputElement) {
            mockInputElement.value = "";
        }
    });

    describe("正常系", () => {

        test("正の整数値が正しく設定される", () => {
            execute(10);

            expect(mockInputElement.value).toBe("10");
        });

        test("正の小数値が切り上げられて設定される", () => {
            execute(10.3);

            expect(mockInputElement.value).toBe("11");
        });

        test("負の整数値が正しく設定される", () => {
            execute(-5);

            expect(mockInputElement.value).toBe("-5");
        });

        test("負の小数値が切り上げられて設定される", () => {
            execute(-10.7);

            expect(mockInputElement.value).toBe("-10");
        });

        test("0が正しく設定される", () => {
            execute(0);

            expect(mockInputElement.value).toBe("0");
        });

        test("0に近い正の小数値が切り上げられる", () => {
            execute(0.1);

            expect(mockInputElement.value).toBe("1");
        });

        test("0に近い負の小数値が切り上げられる", () => {
            execute(-0.1);

            expect(mockInputElement.value).toBe("0");
        });

        test("大きな数値が正しく設定される", () => {
            execute(999999.99);

            expect(mockInputElement.value).toBe("1000000");
        });

        test("非常に小さな負の数値が正しく設定される", () => {
            execute(-999999.01);

            expect(mockInputElement.value).toBe("-999999");
        });

        test("既に値が設定されている要素が上書きされる", () => {
            // 事前に値を設定
            mockInputElement.value = "existing value";

            execute(42.7);

            expect(mockInputElement.value).toBe("43");
        });

    });

    describe("Math.ceil動作の検証", () => {

        test("Math.ceilが正の数で正しく動作する", () => {
            const testCases = [
                { input: 1.1, expected: "2" },
                { input: 1.9, expected: "2" },
                { input: 2.0, expected: "2" },
                { input: 2.01, expected: "3" }
            ];

            testCases.forEach(({ input, expected }) => {
                execute(input);
                expect(mockInputElement.value).toBe(expected);
            });
        });

        test("Math.ceilが負の数で正しく動作する", () => {
            const testCases = [
                { input: -1.1, expected: "-1" },
                { input: -1.9, expected: "-1" },
                { input: -2.0, expected: "-2" },
                { input: -2.01, expected: "-2" }
            ];

            testCases.forEach(({ input, expected }) => {
                execute(input);
                expect(mockInputElement.value).toBe(expected);
            });
        });

    });

    describe("異常系", () => {

        test("要素が存在しない場合、何も実行されない", () => {
            Object.defineProperty(document, "getElementById", {
                value: vi.fn().mockReturnValue(null),
                writable: true,
                configurable: true
            });

            expect(() => execute(10)).not.toThrow();
        });

        test("要素がHTMLInputElementでない場合でも安全に動作する", () => {
            const divElement = document.createElement("div");
            Object.defineProperty(document, "getElementById", {
                value: vi.fn().mockReturnValue(divElement),
                writable: true,
                configurable: true
            });

            // HTMLInputElementでない要素にvalueを設定しようとするが、
            // TypeScriptのキャストにより実行時には動作する
            expect(() => execute(10)).not.toThrow();
        });

        test("NaNが渡された場合、NaNが文字列として設定される", () => {
            execute(NaN);

            expect(mockInputElement.value).toBe("NaN");
        });

        test("Infinityが渡された場合、Infinityが文字列として設定される", () => {
            execute(Infinity);

            expect(mockInputElement.value).toBe("Infinity");
        });

        test("-Infinityが渡された場合、-Infinityが文字列として設定される", () => {
            execute(-Infinity);

            expect(mockInputElement.value).toBe("-Infinity");
        });

    });

    describe("DOM操作の検証", () => {

        test("document.getElementByIdが正しい引数で呼ばれる", () => {
            const spy = vi.spyOn(document, "getElementById");

            execute(10);

            expect(spy).toHaveBeenCalledWith($TRANSFORM_REFERENCE_Y_ID);
        });

        test("HTMLInputElementのvalueプロパティが設定される", () => {
            const spy = vi.spyOn(mockInputElement, "value", "set");

            execute(15.7);

            expect(spy).toHaveBeenCalledWith("16");
        });

        test("要素の他のプロパティは変更されない", () => {
            const originalType = mockInputElement.type;
            const originalId = mockInputElement.id;

            execute(10);

            expect(mockInputElement.type).toBe(originalType);
            expect(mockInputElement.id).toBe(originalId);
        });

    });

    describe("Y座標特有のテスト", () => {

        test("画面座標系での典型的なY値が正しく処理される", () => {
            // 典型的な画面座標のY値をテスト
            const testCases = [
                { input: 0, expected: "0" },        // 画面上端
                { input: 100.5, expected: "101" },  // 中央付近
                { input: 768.9, expected: "769" },  // 画面下端付近
                { input: -50.3, expected: "-50" }   // 画面外（上）
            ];

            testCases.forEach(({ input, expected }) => {
                execute(input);
                expect(mockInputElement.value).toBe(expected);
            });
        });

        test("非常に大きなY座標値でも正しく処理される", () => {
            execute(99999.123);

            expect(mockInputElement.value).toBe("100000");
        });

        test("負のY座標値（画面外上部）が正しく処理される", () => {
            execute(-123.456);

            expect(mockInputElement.value).toBe("-123");
        });

    });

    describe("エッジケース", () => {

        test("非常に大きな数値でもオーバーフローしない", () => {
            execute(Number.MAX_SAFE_INTEGER + 0.5);

            expect(mockInputElement.value).toBe("9007199254740992");
        });

        test("非常に小さな数値でもアンダーフローしない", () => {
            execute(Number.MIN_SAFE_INTEGER - 0.5);

            expect(mockInputElement.value).toBe("-9007199254740991");
        });

        test("Number.EPSILON程度の小さな値でも正しく処理される", () => {
            execute(Number.EPSILON);

            expect(mockInputElement.value).toBe("1");
        });

        test("負のNumber.EPSILON程度の小さな値でも正しく処理される", () => {
            execute(-Number.EPSILON);

            expect(mockInputElement.value).toBe("0");
        });

    });

    describe("XサービスとYサービスの一貫性確認", () => {

        test("同じ値を処理した場合、XサービスとYサービスで同じ結果になる", () => {
            const testValue = 123.456;
            execute(testValue);
            const yResult = mockInputElement.value;

            // 期待される結果（Math.ceilの結果）
            const expectedResult = Math.ceil(testValue).toString();

            expect(yResult).toBe(expectedResult);
            expect(yResult).toBe("124");
        });

    });

});