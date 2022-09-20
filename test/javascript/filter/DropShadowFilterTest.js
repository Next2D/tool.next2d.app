describe("DropShadowFilter.js property test", () =>
{
    it("distance test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        // 初期値
        expect(dropShadowFilter.distance).toBe(4);

        // バリデーション
        dropShadowFilter.distance = -9999;
        expect(dropShadowFilter.distance).toBe(FilterController.MIN_DISTANCE);

        dropShadowFilter.distance = 9999;
        expect(dropShadowFilter.distance).toBe(FilterController.MAX_DISTANCE);
    });

    it("angle test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        // 初期値
        expect(dropShadowFilter.angle).toBe(45);

        // バリデーション
        dropShadowFilter.angle = -900;
        expect(dropShadowFilter.angle).toBe(-900 % 360);

        dropShadowFilter.angle = 900;
        expect(dropShadowFilter.angle).toBe(900 % 360);
    });

    it("color test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        // 初期値
        expect(dropShadowFilter.color).toBe(0);

        // バリデーション
        dropShadowFilter.color = -900;
        expect(dropShadowFilter.color).toBe(0);

        dropShadowFilter.color = 0xffffff + 10;
        expect(dropShadowFilter.color).toBe(0xffffff);
    });

    it("alpha test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        // 初期値
        expect(dropShadowFilter.alpha).toBe(100);

        // バリデーション
        dropShadowFilter.alpha = -900;
        expect(dropShadowFilter.alpha).toBe(0);

        dropShadowFilter.alpha = 0xffff;
        expect(dropShadowFilter.alpha).toBe(100);
    });

    it("strength test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        // 初期値
        expect(dropShadowFilter.strength).toBe(1);

        // バリデーション
        dropShadowFilter.strength = -900;
        expect(dropShadowFilter.strength).toBe(FilterController.MIN_STRENGTH);

        dropShadowFilter.strength = 0xffff;
        expect(dropShadowFilter.strength).toBe(FilterController.MAX_STRENGTH);
    });

    it("inner test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        // 初期値
        expect(dropShadowFilter.inner).toBe(false);

        // バリデーション
        dropShadowFilter.inner = true;
        expect(dropShadowFilter.inner).toBe(true);

        dropShadowFilter.inner = 0;
        expect(dropShadowFilter.inner).toBe(false);
    });

    it("hideObject test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        // 初期値
        expect(dropShadowFilter.hideObject).toBe(false);

        // バリデーション
        dropShadowFilter.hideObject = true;
        expect(dropShadowFilter.hideObject).toBe(true);

        dropShadowFilter.hideObject = 0;
        expect(dropShadowFilter.hideObject).toBe(false);
    });

    it("knockout test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        // 初期値
        expect(dropShadowFilter.knockout).toBe(false);

        // バリデーション
        dropShadowFilter.knockout = true;
        expect(dropShadowFilter.knockout).toBe(true);

        dropShadowFilter.knockout = 0;
        expect(dropShadowFilter.knockout).toBe(false);
    });
});

describe("BevelFilter.js function test", () =>
{
    it("toParamArray test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        const params = dropShadowFilter.toParamArray();
        expect(params[0]).toBe(null);
        expect(params[1]).toBe(4);
        expect(params[2]).toBe(45);
        expect(params[3]).toBe(0);
        expect(params[4]).toBe(1);
        expect(params[5]).toBe(4);
        expect(params[6]).toBe(4);
        expect(params[7]).toBe(1);
        expect(params[8]).toBe(1);
        expect(params[9]).toBe(false);
        expect(params[10]).toBe(false);
        expect(params[11]).toBe(false);
    });

    it("toObject test", () =>
    {
        const dropShadowFilter = new DropShadowFilter();

        const object = dropShadowFilter.toObject();
        expect(object.name).toBe("DropShadowFilter");
        expect(object.blurX).toBe(4);
        expect(object.blurY).toBe(4);
        expect(object.quality).toBe(1);
        expect(object.state).toBe(true);
        expect(object.distance).toBe(4);
        expect(object.angle).toBe(45);
        expect(object.color).toBe(0);
        expect(object.alpha).toBe(1);
        expect(object.strength).toBe(1);
        expect(object.inner).toBe(false);
        expect(object.hideObject).toBe(false);
        expect(object.knockout).toBe(false);
    });

});
