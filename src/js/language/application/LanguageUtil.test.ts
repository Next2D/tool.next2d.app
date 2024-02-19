import {
    $getMapping,
    $setMapping,
    $replace,
    $sprintf
} from "./LanguageUtil";

describe("LanguageTest", () =>
{
    test("$getMapping and $setMapping and $replace test", () =>
    {
        expect($getMapping().size).toBe(0);

        $setMapping([
            ["{{テスト}}", "てすと"]
        ]);

        expect($getMapping().size).toBe(1);
        expect($replace("{{テスト}}")).toBe("てすと");
    });

    test("$sprintf test", () =>
    {
        const value = "%sを%sに変更";
        expect(value).toBe("%sを%sに変更");
        expect($sprintf(value, "before", "after")).toBe("beforeをafterに変更");
    });
});