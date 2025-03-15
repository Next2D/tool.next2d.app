import {
    $getMapping,
    $setMapping,
    $replace,
    $sprintf
} from "./LanguageUtil";
import { describe, expect, it } from "vitest";

describe("LanguageTest", () =>
{
    it("$getMapping and $setMapping and $replace test", () =>
    {
        expect($getMapping().size).toBe(0);

        $setMapping([
            ["{{テスト}}", "てすと"]
        ]);

        expect($getMapping().size).toBe(1);
        expect($replace("{{テスト}}")).toBe("てすと");
    });

    it("$sprintf test", () =>
    {
        const value = "%s1を%s2に変更";
        expect(value).toBe("%s1を%s2に変更");
        expect($sprintf(value, "before", "after")).toBe("beforeをafterに変更");
    });
});