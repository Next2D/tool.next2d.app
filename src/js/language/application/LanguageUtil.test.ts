import {
    $getMapping,
    $setMapping,
    $replace
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
});