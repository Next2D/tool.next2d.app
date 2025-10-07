import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ColorSettingUpdateBlueOffsetElementValueService";
import { $COLOR_BLUE_OFFSET_ID } from "@/config/ColorSettingConfig";

describe("ColorSettingUpdateBlueOffsetElementValueService", () =>
{
    let mockElement: HTMLInputElement;

    beforeEach(() =>
    {
        // HTMLInputElementのモックを作成
        mockElement = document.createElement("input");
        mockElement.type = "number"; // BlueOffsetは負の値を許容するためnumber
        mockElement.id = $COLOR_BLUE_OFFSET_ID;

        // getElementByIdをモック
        vi.spyOn(document, "getElementById").mockReturnValue(mockElement);
    });

    afterEach(() =>
    {
        vi.restoreAllMocks();
    });

    describe("基本動作", () =>
    {
        it("要素が存在する場合、値が設定される", () =>
        {
            execute(50);

            expect(document.getElementById).toHaveBeenCalledWith($COLOR_BLUE_OFFSET_ID);
            expect(mockElement.value).toBe("50");
        });

        it("要素がnullの場合は早期リターン", () =>
        {
            vi.spyOn(document, "getElementById").mockReturnValue(null);

            expect(() => execute(50)).not.toThrow();
        });

        it("getElementByIdが1回だけ呼ばれる", () =>
        {
            execute(50);

            expect(document.getElementById).toHaveBeenCalledTimes(1);
        });

        it("$COLOR_BLUE_OFFSET_IDを使用して要素を取得する", () =>
        {
            execute(50);

            expect(document.getElementById).toHaveBeenCalledWith($COLOR_BLUE_OFFSET_ID);
        });
    });

    describe("値の設定", () =>
    {
        it("整数値がそのまま文字列として設定される", () =>
        {
            execute(75);

            expect(mockElement.value).toBe("75");
        });

        it("0が正しく設定される", () =>
        {
            execute(0);

            expect(mockElement.value).toBe("0");
        });

        it("100が正しく設定される", () =>
        {
            execute(100);

            expect(mockElement.value).toBe("100");
        });

        it("小数点を含む値は整数部分のみが設定される", () =>
        {
            execute(50.7);

            expect(mockElement.value).toBe("50");
        });

        it("小数点を含む値(切り捨て)", () =>
        {
            execute(99.9);

            expect(mockElement.value).toBe("99");
        });

        it("小数点を含む値(0.x)", () =>
        {
            execute(0.5);

            expect(mockElement.value).toBe("0");
        });

        it("負の値が正しく設定される", () =>
        {
            execute(-10);

            expect(mockElement.value).toBe("-10");
        });

        it("負の小数値は整数部分のみ", () =>
        {
            execute(-5.5);

            expect(mockElement.value).toBe("-5");
        });
    });

    describe("ビット演算の動作", () =>
    {
        it("ビットOR演算子で整数化される", () =>
        {
            execute(50.123456789);

            expect(mockElement.value).toBe("50");
        });

        it("1未満の正の値は0になる", () =>
        {
            execute(0.1);

            expect(mockElement.value).toBe("0");
        });

        it("1未満の正の値(0.99)", () =>
        {
            execute(0.99);

            expect(mockElement.value).toBe("0");
        });

        it("負の値のビットOR演算 (type='range'は-255に正規化)", () =>
        {
            mockElement.type = "range";
            mockElement.min = "-255";
            mockElement.max = "255";
            execute(-1);

            // -1 | 0 = -1、type='range'でmin/maxが設定されていれば負の値も許容
            expect(mockElement.value).toBe("-1");
        });

        it("負の小数値のビットOR演算 (type='range'で整数化)", () =>
        {
            mockElement.type = "range";
            mockElement.min = "-255";
            mockElement.max = "255";
            execute(-10.5);

            // -10.5 | 0 = -10
            expect(mockElement.value).toBe("-10");
        });

        it("type='number'で負の値のビットOR演算", () =>
        {
            mockElement.type = "number";
            execute(-1);

            // -1 | 0 = -1、type='number'は生の値を受け取る
            expect(mockElement.value).toBe("-1");
        });

        it("type='number'で負の小数値のビットOR演算", () =>
        {
            mockElement.type = "number";
            execute(-10.5);

            // -10.5 | 0 = -10、type='number'は生の値を受け取る
            expect(mockElement.value).toBe("-10");
        });

        it("大きな整数値 (type='range'は255に正規化)", () =>
        {
            mockElement.type = "range";
            mockElement.min = "-255";
            mockElement.max = "255";
            execute(9999);

            // type='range'は-255~255の範囲に自動正規化
            expect(mockElement.value).toBe("255");
        });

        it("大きな小数値 (type='range'は255に正規化)", () =>
        {
            mockElement.type = "range";
            mockElement.min = "-255";
            mockElement.max = "255";
            execute(9999.999);

            // type='range'は-255~255の範囲に自動正規化
            expect(mockElement.value).toBe("255");
        });

        it("type='number'で大きな整数値", () =>
        {
            mockElement.type = "number";
            execute(9999);

            // type='number'は生の値を受け取る
            expect(mockElement.value).toBe("9999");
        });

        it("type='number'で大きな小数値", () =>
        {
            mockElement.type = "number";
            execute(9999.999);

            // 9999.999 | 0 = 9999、type='number'は生の値を受け取る
            expect(mockElement.value).toBe("9999");
        });
    });

    describe("テンプレートリテラルの動作", () =>
    {
        it("数値が文字列に変換される", () =>
        {
            execute(42);

            expect(mockElement.value).toBe("42");
            expect(typeof mockElement.value).toBe("string");
        });

        it("0が文字列'0'に変換される", () =>
        {
            execute(0);

            expect(mockElement.value).toBe("0");
            expect(mockElement.value).not.toBe(0);
        });

        it("100が文字列'100'に変換される", () =>
        {
            execute(100);

            expect(mockElement.value).toBe("100");
            expect(typeof mockElement.value).toBe("string");
        });
    });

    describe("HTMLInputElementとの互換性", () =>
    {
        it("input要素のvalueプロパティが正しく設定される", () =>
        {
            const initialValue = mockElement.value;

            execute(80);

            expect(mockElement.value).not.toBe(initialValue);
            expect(mockElement.value).toBe("80");
        });

        it("type='range'の要素で動作する", () =>
        {
            mockElement.type = "range";

            execute(50);

            expect(mockElement.value).toBe("50");
        });

        it("type='number'の要素でも動作する", () =>
        {
            mockElement.type = "number";

            execute(50);

            expect(mockElement.value).toBe("50");
        });

        it("既存の値が上書きされる", () =>
        {
            mockElement.value = "25";

            execute(75);

            expect(mockElement.value).toBe("75");
        });

        it("複数回実行してもそれぞれ正しく設定される", () =>
        {
            execute(10);
            expect(mockElement.value).toBe("10");

            execute(20);
            expect(mockElement.value).toBe("20");

            execute(30);
            expect(mockElement.value).toBe("30");
        });
    });

    describe("エッジケース", () =>
    {
        it("blue = 0の場合", () =>
        {
            execute(0);

            expect(mockElement.value).toBe("0");
        });

        it("blue = 255の場合", () =>
        {
            execute(255);

            expect(mockElement.value).toBe("255");
        });

        it("blue = -255の場合", () =>
        {
            execute(-255);

            expect(mockElement.value).toBe("-255");
        });

        it("blue = 50.5の場合", () =>
        {
            execute(50.5);

            expect(mockElement.value).toBe("50");
        });

        it("blue = -50.5の場合", () =>
        {
            execute(-50.5);

            expect(mockElement.value).toBe("-50");
        });

        it("blue = 0.1の場合", () =>
        {
            execute(0.1);

            expect(mockElement.value).toBe("0");
        });

        it("blue = -0.1の場合", () =>
        {
            execute(-0.1);

            expect(mockElement.value).toBe("0");
        });

        it("blue = 99.99の場合", () =>
        {
            execute(99.99);

            expect(mockElement.value).toBe("99");
        });

        it("blue = -99.99の場合", () =>
        {
            execute(-99.99);

            expect(mockElement.value).toBe("-99");
        });

        it("blue = 1の場合", () =>
        {
            execute(1);

            expect(mockElement.value).toBe("1");
        });

        it("blue = -1の場合", () =>
        {
            execute(-1);

            expect(mockElement.value).toBe("-1");
        });

        it("blue = 100の場合", () =>
        {
            execute(100);

            expect(mockElement.value).toBe("100");
        });

        it("blue = -100の場合", () =>
        {
            execute(-100);

            expect(mockElement.value).toBe("-100");
        });
    });

    describe("型チェック", () =>
    {
        it("HTMLInputElementとしてキャストされる", () =>
        {
            execute(50);

            // valueプロパティが存在することを確認
            expect(mockElement).toHaveProperty("value");
            expect(mockElement.value).toBe("50");
        });

        it("要素がnullの場合はエラーを投げない", () =>
        {
            vi.spyOn(document, "getElementById").mockReturnValue(null);

            expect(() => execute(50)).not.toThrow();
        });
    });

    describe("実行結果", () =>
    {
        it("戻り値はundefined(void)", () =>
        {
            const result = execute(50);

            expect(result).toBeUndefined();
        });

        it("要素がnullの場合もundefinedを返す", () =>
        {
            vi.spyOn(document, "getElementById").mockReturnValue(null);

            const result = execute(50);

            expect(result).toBeUndefined();
        });
    });
});
