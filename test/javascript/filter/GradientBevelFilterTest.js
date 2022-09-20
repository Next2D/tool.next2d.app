describe("GradientBevelFilter.js property test", () =>
{
    it("distance test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        // 初期値
        expect(gradientBevelFilter.distance).toBe(4);

        // バリデーション
        gradientBevelFilter.distance = -9999;
        expect(gradientBevelFilter.distance).toBe(FilterController.MIN_DISTANCE);

        gradientBevelFilter.distance = 9999;
        expect(gradientBevelFilter.distance).toBe(FilterController.MAX_DISTANCE);
    });

    it("angle test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        // 初期値
        expect(gradientBevelFilter.angle).toBe(45);

        // バリデーション
        gradientBevelFilter.angle = -900;
        expect(gradientBevelFilter.angle).toBe(-900 % 360);

        gradientBevelFilter.angle = 900;
        expect(gradientBevelFilter.angle).toBe(900 % 360);
    });

    it("colors test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        // 初期値
        expect(gradientBevelFilter.colors.length).toBe(3);

        const colors = [0xff00ff, 0x00ffff, 0xffff00];
        gradientBevelFilter.colors = colors;
        for (let idx = 0; idx < colors.length; ++idx) {
            expect(gradientBevelFilter.colors[idx]).toBe(colors[idx]);
        }
    });

    it("alphas test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        // 初期値
        expect(gradientBevelFilter.alphas.length).toBe(3);

        const alphas = [0.2, 0.5, 0.8];
        gradientBevelFilter.alphas = alphas;
        for (let idx = 0; idx < alphas.length; ++idx) {
            expect(gradientBevelFilter.alphas[idx]).toBe(alphas[idx] * 100);
        }
    });

    it("alphas test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        // 初期値
        expect(gradientBevelFilter.ratios.length).toBe(3);

        const ratios = [50 / 255, 100 / 255, 200 / 255];
        gradientBevelFilter.ratios = ratios;
        for (let idx = 0; idx < ratios.length; ++idx) {
            expect(gradientBevelFilter.ratios[idx]).toBe(ratios[idx] * 255);
        }
    });

    it("strength test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        // 初期値
        expect(gradientBevelFilter.strength).toBe(1);

        // バリデーション
        gradientBevelFilter.strength = -900;
        expect(gradientBevelFilter.strength).toBe(FilterController.MIN_STRENGTH);

        gradientBevelFilter.strength = 0xffff;
        expect(gradientBevelFilter.strength).toBe(FilterController.MAX_STRENGTH);
    });

    it("type test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        // 初期値
        expect(gradientBevelFilter.type).toBe("inner");

        // バリデーション
        gradientBevelFilter.type = "FULL";
        expect(gradientBevelFilter.type).toBe("full");

        gradientBevelFilter.type = "inNER";
        expect(gradientBevelFilter.type).toBe("inner");

        gradientBevelFilter.type = "oUTer";
        expect(gradientBevelFilter.type).toBe("outer");

        gradientBevelFilter.type = "aaaa";
        expect(gradientBevelFilter.type).toBe("inner");
    });

    it("knockout test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        // 初期値
        expect(gradientBevelFilter.knockout).toBe(false);

        // バリデーション
        gradientBevelFilter.knockout = true;
        expect(gradientBevelFilter.knockout).toBe(true);

        gradientBevelFilter.knockout = 0;
        expect(gradientBevelFilter.knockout).toBe(false);
    });
});

describe("GradientBevelFilter.js function test", () =>
{
    it("toParamArray test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        const params = gradientBevelFilter.toParamArray();
        expect(params[0]).toBe(null);
        expect(params[1]).toBe(4);
        expect(params[2]).toBe(45);
        expect(params[3].length).toBe(3);
        expect(params[4].length).toBe(3);
        expect(params[5].length).toBe(3);
        expect(params[6]).toBe(4);
        expect(params[7]).toBe(4);
        expect(params[8]).toBe(1);
        expect(params[9]).toBe(1);
        expect(params[10]).toBe("inner");
        expect(params[11]).toBe(false);
    });

    it("toObject test", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();

        const object = gradientBevelFilter.toObject();
        expect(object.name).toBe("GradientBevelFilter");
        expect(object.blurX).toBe(4);
        expect(object.blurY).toBe(4);
        expect(object.quality).toBe(1);
        expect(object.state).toBe(true);
        expect(object.distance).toBe(4);
        expect(object.angle).toBe(45);
        expect(object.strength).toBe(1);
        expect(object.colors.length).toBe(3);
        expect(object.alphas.length).toBe(3);
        expect(object.ratios.length).toBe(3);
        expect(object.type).toBe("inner");
        expect(object.knockout).toBe(false);
    });

});
