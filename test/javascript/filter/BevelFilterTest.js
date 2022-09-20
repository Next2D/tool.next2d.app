describe("BevelFilter.js property test", () =>
{
    it("distance test", () =>
    {
        const bevelFilter = new BevelFilter();

        // 初期値
        expect(bevelFilter.distance).toBe(4);

        // バリデーション
        bevelFilter.distance = -9999;
        expect(bevelFilter.distance).toBe(FilterController.MIN_DISTANCE);

        bevelFilter.distance = 9999;
        expect(bevelFilter.distance).toBe(FilterController.MAX_DISTANCE);
    });

    it("angle test", () =>
    {
        const bevelFilter = new BevelFilter();

        // 初期値
        expect(bevelFilter.angle).toBe(45);

        // バリデーション
        bevelFilter.angle = -900;
        expect(bevelFilter.angle).toBe(-900 % 360);

        bevelFilter.angle = 900;
        expect(bevelFilter.angle).toBe(900 % 360);
    });

    it("highlightColor test", () =>
    {
        const bevelFilter = new BevelFilter();

        // 初期値
        expect(bevelFilter.highlightColor).toBe(0xffffff);

        // バリデーション
        bevelFilter.highlightColor = -900;
        expect(bevelFilter.highlightColor).toBe(0);

        bevelFilter.highlightColor = 0xffffff + 10;
        expect(bevelFilter.highlightColor).toBe(0xffffff);
    });

    it("highlightAlpha test", () =>
    {
        const bevelFilter = new BevelFilter();

        // 初期値
        expect(bevelFilter.highlightAlpha).toBe(100);

        // バリデーション
        bevelFilter.highlightAlpha = -900;
        expect(bevelFilter.highlightAlpha).toBe(0);

        bevelFilter.highlightAlpha = 0xffff;
        expect(bevelFilter.highlightAlpha).toBe(100);
    });

    it("shadowColor test", () =>
    {
        const bevelFilter = new BevelFilter();

        // 初期値
        expect(bevelFilter.shadowColor).toBe(0);

        // バリデーション
        bevelFilter.shadowColor = -900;
        expect(bevelFilter.shadowColor).toBe(0);

        bevelFilter.shadowColor = 0xffffff + 10;
        expect(bevelFilter.shadowColor).toBe(0xffffff);
    });

    it("shadowAlpha test", () =>
    {
        const bevelFilter = new BevelFilter();

        // 初期値
        expect(bevelFilter.shadowAlpha).toBe(100);

        // バリデーション
        bevelFilter.shadowAlpha = -900;
        expect(bevelFilter.shadowAlpha).toBe(0);

        bevelFilter.shadowAlpha = 0xffff;
        expect(bevelFilter.shadowAlpha).toBe(100);
    });

    it("strength test", () =>
    {
        const bevelFilter = new BevelFilter();

        // 初期値
        expect(bevelFilter.strength).toBe(1);

        // バリデーション
        bevelFilter.strength = -900;
        expect(bevelFilter.strength).toBe(FilterController.MIN_STRENGTH);

        bevelFilter.strength = 0xffff;
        expect(bevelFilter.strength).toBe(FilterController.MAX_STRENGTH);
    });

    it("type test", () =>
    {
        const bevelFilter = new BevelFilter();

        // 初期値
        expect(bevelFilter.type).toBe("inner");

        // バリデーション
        bevelFilter.type = "FULL";
        expect(bevelFilter.type).toBe("full");

        bevelFilter.type = "oUTer";
        expect(bevelFilter.type).toBe("outer");

        bevelFilter.type = "inNER";
        expect(bevelFilter.type).toBe("inner");

        bevelFilter.type = "aaaa";
        expect(bevelFilter.type).toBe("full");
    });

    it("knockout test", () =>
    {
        const bevelFilter = new BevelFilter();

        // 初期値
        expect(bevelFilter.knockout).toBe(false);

        // バリデーション
        bevelFilter.knockout = true;
        expect(bevelFilter.knockout).toBe(true);

        bevelFilter.knockout = 0;
        expect(bevelFilter.knockout).toBe(false);
    });
});

describe("BevelFilter.js function test", () =>
{
    it("toParamArray test", () =>
    {
        const bevelFilter = new BevelFilter();

        const params = bevelFilter.toParamArray();
        expect(params[0]).toBe(null);
        expect(params[1]).toBe(4);
        expect(params[2]).toBe(45);
        expect(params[3]).toBe(16777215);
        expect(params[4]).toBe(1);
        expect(params[5]).toBe(0);
        expect(params[6]).toBe(1);
        expect(params[7]).toBe(4);
        expect(params[8]).toBe(4);
        expect(params[9]).toBe(1);
        expect(params[10]).toBe(1);
        expect(params[11]).toBe("inner");
        expect(params[12]).toBe(false);
    });

    it("toObject test", () =>
    {
        const bevelFilter = new BevelFilter();

        const object = bevelFilter.toObject();
        expect(object.name).toBe("BevelFilter");
        expect(object.blurX).toBe(4);
        expect(object.blurY).toBe(4);
        expect(object.quality).toBe(1);
        expect(object.state).toBe(true);
        expect(object.distance).toBe(4);
        expect(object.angle).toBe(45);
        expect(object.highlightColor).toBe(0xffffff);
        expect(object.highlightAlpha).toBe(1);
        expect(object.shadowColor).toBe(0);
        expect(object.shadowAlpha).toBe(1);
        expect(object.strength).toBe(1);
        expect(object.type).toBe("inner");
        expect(object.knockout).toBe(false);
    });

});

