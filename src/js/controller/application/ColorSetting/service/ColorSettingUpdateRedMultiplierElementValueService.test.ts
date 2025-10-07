import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ColorSettingUpdateRedMultiplierElementValueService";
import { $COLOR_RED_MULTIPLIER_ID } from "@/config/ColorSettingConfig";

describe("ColorSettingUpdateRedMultiplierElementValueService", () =>
{
    let mockElement: HTMLInputElement;

    beforeEach(() =>
    {
        // HTMLInputElementのモックを作成
        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.id = $COLOR_RED_MULTIPLIER_ID;

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

            expect(document.getElementById).toHaveBeenCalledWith($COLOR_RED_MULTIPLIER_ID);
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

        it("$COLOR_RED_MULTIPLIER_IDを使用して要素を取得する", () =>
        {
            execute(50);

            expect(document.getElementById).toHaveBeenCalledWith($COLOR_RED_MULTIPLIER_ID);
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

        it("負の値は0として設定される (type='range')", () =>
        {
            execute(-10);

            expect(mockElement.value).toBe("0");
        });

        it("負の小数値 (type='range')", () =>
        {
            execute(-5.5);

            expect(mockElement.value).toBe("0");
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

        it("負の値のビットOR演算 (type='range'は0に正規化)", () =>
        {
            mockElement.type = "range";
            execute(-1);

            // -1 | 0 = -1 だが、type='range'は0-100の範囲に自動正規化
            expect(mockElement.value).toBe("0");
        });

        it("負の小数値のビットOR演算 (type='range'は0に正規化)", () =>
        {
            mockElement.type = "range";
            execute(-10.5);

            // -10.5 | 0 = -10 だが、type='range'は0-100の範囲に自動正規化
            expect(mockElement.value).toBe("0");
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

        it("大きな整数値 (type='range'は100に正規化)", () =>
        {
            mockElement.type = "range";
            execute(9999);

            // type='range'は0-100の範囲に自動正規化
            expect(mockElement.value).toBe("100");
        });

        it("大きな小数値 (type='range'は100に正規化)", () =>
        {
            mockElement.type = "range";
            execute(9999.999);

            // type='range'は0-100の範囲に自動正規化
            expect(mockElement.value).toBe("100");
        });

        it("type='number'で大きな整数値", () =>
        {
            mockElement.type = "number";
            execute(9999);

            // type='number'は生の値を受け取る
            expect(mockElement.value).toBe("9999");
        });
    });

    describe("範囲内の値", () =>
    {
        it("1が正しく設定される", () =>
        {
            execute(1);

            expect(mockElement.value).toBe("1");
        });

        it("25が正しく設定される", () =>
        {
            execute(25);

            expect(mockElement.value).toBe("25");
        });

        it("50が正しく設定される", () =>
        {
            execute(50);

            expect(mockElement.value).toBe("50");
        });

        it("75が正しく設定される", () =>
        {
            execute(75);

            expect(mockElement.value).toBe("75");
        });

        it("99が正しく設定される", () =>
        {
            execute(99);

            expect(mockElement.value).toBe("99");
        });
    });

    describe("境界値", () =>
    {
        it("0が境界値として正しく設定される", () =>
        {
            execute(0);

            expect(mockElement.value).toBe("0");
        });

        it("100が境界値として正しく設定される", () =>
        {
            execute(100);

            expect(mockElement.value).toBe("100");
        });

        it("100を超える値 (type='range')", () =>
        {
            execute(101);

            // type='range'は0-100の範囲に自動正規化
            expect(mockElement.value).toBe("100");
        });

        it("負の値 (type='range')", () =>
        {
            execute(-1);

            // type='range'は0-100の範囲に自動正規化
            expect(mockElement.value).toBe("0");
        });
    });

    describe("要素の状態", () =>
    {
        it("要素のtype属性がrangeの場合", () =>
        {
            mockElement.type = "range";

            execute(50);

            expect(mockElement.value).toBe("50");
        });

        it("要素のtype属性がnumberの場合", () =>
        {
            mockElement.type = "number";

            execute(50);

            expect(mockElement.value).toBe("50");
        });

        it("要素が無効化されていても値は設定される", () =>
        {
            mockElement.disabled = true;

            execute(50);

            expect(mockElement.value).toBe("50");
        });

        it("要素が読み取り専用でも値は設定される", () =>
        {
            mockElement.readOnly = true;

            execute(50);

            expect(mockElement.value).toBe("50");
        });
    });

    describe("連続呼び出し", () =>
    {
        it("複数回呼び出しても正しく動作する", () =>
        {
            execute(25);
            expect(mockElement.value).toBe("25");

            execute(50);
            expect(mockElement.value).toBe("50");

            execute(75);
            expect(mockElement.value).toBe("75");
        });

        it("0から100まで連続して設定できる", () =>
        {
            execute(0);
            expect(mockElement.value).toBe("0");

            execute(100);
            expect(mockElement.value).toBe("100");

            execute(50);
            expect(mockElement.value).toBe("50");
        });
    });

    describe("エッジケース", () =>
    {
        it("NaN は 0 として設定される", () =>
        {
            execute(NaN);

            expect(mockElement.value).toBe("0");
        });

        it("Infinity (Infinity | 0 = 0、type='range'は0に正規化)", () =>
        {
            mockElement.type = "range";
            execute(Infinity);

            // Infinity | 0 = 0
            expect(mockElement.value).toBe("0");
        });

        it("-Infinity (type='range'は0に正規化)", () =>
        {
            mockElement.type = "range";
            execute(-Infinity);

            expect(mockElement.value).toBe("0");
        });

        it("非常に小さい正の値", () =>
        {
            execute(0.0001);

            expect(mockElement.value).toBe("0");
        });

        it("非常に大きい小数値 (type='range')", () =>
        {
            execute(999999.999);

            // type='range'は0-100の範囲に自動正規化
            expect(mockElement.value).toBe("100");
        });
    });

    describe("HTMLInputElementのキャスト", () =>
    {
        it("要素が正しくHTMLInputElementとして扱われる", () =>
        {
            execute(50);

            expect(mockElement).toBeInstanceOf(HTMLInputElement);
            expect(mockElement.value).toBe("50");
        });

        it("要素がHTMLInputElementでない場合でもエラーにならない", () =>
        {
            const divElement = document.createElement("div");
            divElement.id = $COLOR_RED_MULTIPLIER_ID;
            vi.spyOn(document, "getElementById").mockReturnValue(divElement as any);

            // エラーが発生しないことを確認
            expect(() => execute(50)).not.toThrow();
        });
    });

    describe("特殊な数値", () =>
        {
        it("50.5は50として設定される", () =>
        {
            execute(50.5);

            expect(mockElement.value).toBe("50");
        });

        it("99.999は99として設定される", () =>
        {
            execute(99.999);

            expect(mockElement.value).toBe("99");
        });

        it("0.9999は0として設定される", () =>
        {
            execute(0.9999);

            expect(mockElement.value).toBe("0");
        });

        it("33.33は33として設定される", () =>
        {
            execute(33.33);

            expect(mockElement.value).toBe("33");
        });

        it("66.66は66として設定される", () =>
        {
            execute(66.66);

            expect(mockElement.value).toBe("66");
        });
    });
});
