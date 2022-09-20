describe("GlowFilter.js property test", () =>
{
    it("color test", () =>
    {
        const glowFilter = new GlowFilter();

        // 初期値
        expect(glowFilter.color).toBe(0);

        // バリデーション
        glowFilter.color = -900;
        expect(glowFilter.color).toBe(0);

        glowFilter.color = 0xffffff + 10;
        expect(glowFilter.color).toBe(0xffffff);
    });

    it("alpha test", () =>
    {
        const glowFilter = new GlowFilter();

        // 初期値
        expect(glowFilter.alpha).toBe(100);

        // バリデーション
        glowFilter.alpha = -900;
        expect(glowFilter.alpha).toBe(0);

        glowFilter.alpha = 0xffff;
        expect(glowFilter.alpha).toBe(100);
    });

    it("strength test", () =>
    {
        const glowFilter = new GlowFilter();

        // 初期値
        expect(glowFilter.strength).toBe(1);

        // バリデーション
        glowFilter.strength = -900;
        expect(glowFilter.strength).toBe(FilterController.MIN_STRENGTH);

        glowFilter.strength = 0xffff;
        expect(glowFilter.strength).toBe(FilterController.MAX_STRENGTH);
    });

    it("inner test", () =>
    {
        const glowFilter = new GlowFilter();

        // 初期値
        expect(glowFilter.inner).toBe(false);

        // バリデーション
        glowFilter.inner = true;
        expect(glowFilter.inner).toBe(true);

        glowFilter.inner = 0;
        expect(glowFilter.inner).toBe(false);
    });

    it("knockout test", () =>
    {
        const glowFilter = new GlowFilter();

        // 初期値
        expect(glowFilter.knockout).toBe(false);

        // バリデーション
        glowFilter.knockout = true;
        expect(glowFilter.knockout).toBe(true);

        glowFilter.knockout = 0;
        expect(glowFilter.knockout).toBe(false);
    });
});

describe("GlowFilter.js function test", () =>
{
    it("toParamArray test", () =>
    {
        const glowFilter = new GlowFilter();

        const params = glowFilter.toParamArray();
        expect(params[0]).toBe(null);
        expect(params[1]).toBe(0);
        expect(params[2]).toBe(1);
        expect(params[3]).toBe(4);
        expect(params[4]).toBe(4);
        expect(params[5]).toBe(1);
        expect(params[6]).toBe(1);
        expect(params[7]).toBe(false);
        expect(params[8]).toBe(false);
    });

    it("toObject test", () =>
    {
        const glowFilter = new GlowFilter();

        const object = glowFilter.toObject();
        expect(object.name).toBe("GlowFilter");
        expect(object.blurX).toBe(4);
        expect(object.blurY).toBe(4);
        expect(object.quality).toBe(1);
        expect(object.state).toBe(true);
        expect(object.color).toBe(0);
        expect(object.alpha).toBe(1);
        expect(object.strength).toBe(1);
        expect(object.inner).toBe(false);
        expect(object.knockout).toBe(false);
    });

});
