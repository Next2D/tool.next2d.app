import { execute } from "./ExternalReferencePivotValidation";
import type { IPivotType } from "../../../../../interface/IPivotType";
import { describe, expect, it } from "vitest";

describe("ExternalReferencePivotValidationTest", () =>
{
    it("有効なpivot位置の検証テスト - Valid pivot position validation test", () =>
    {
        // 有効な9つの座標位置をテスト
        const validPivots: IPivotType[] = [
            "top-left",
            "top-center", 
            "top-right",
            "middle-left",
            "middle-center",
            "middle-right",
            "bottom-left",
            "bottom-center",
            "bottom-right"
        ];

        validPivots.forEach(pivot => {
            expect(execute(pivot)).toBe(true);
        });
    });

    it("無効なpivot位置の検証テスト - Invalid pivot position validation test", () =>
    {
        // 無効な座標位置をテスト
        const invalidPivots = [
            "invalid",
            "center",
            "left",
            "right", 
            "top",
            "bottom",
            "middle",
            "",
            "top-middle",
            "center-left",
            "bottom-top"
        ];

        invalidPivots.forEach(pivot => {
            expect(execute(pivot as IPivotType)).toBe(false);
        });
    });

    it("undefined/nullの場合の検証テスト - Undefined/null validation test", () =>
    {
        expect(execute(undefined as any)).toBe(false);
        expect(execute(null as any)).toBe(false);
    });

    it("空文字列の場合の検証テスト - Empty string validation test", () =>
    {
        expect(execute("" as IPivotType)).toBe(false);
    });

    it("大文字小文字が異なる場合の検証テスト - Case sensitivity validation test", () =>
    {
        expect(execute("TOP-LEFT" as IPivotType)).toBe(false);
        expect(execute("Top-Left" as IPivotType)).toBe(false);
        expect(execute("MIDDLE-CENTER" as IPivotType)).toBe(false);
    });

    it("ハイフンの位置が異なる場合の検証テスト - Different hyphen position validation test", () =>
    {
        expect(execute("topleft" as IPivotType)).toBe(false);
        expect(execute("top_left" as IPivotType)).toBe(false);
        expect(execute("top left" as IPivotType)).toBe(false);
    });
});
