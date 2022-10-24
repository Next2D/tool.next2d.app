describe("FilterController.js property test", () =>
{
    it("default test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const filterController = new FilterController();
        expect(filterController._$filterId).toBe(0);
        expect(filterController._$filters.size).toBe(0);

        Util.$workSpaces.length = 0;
    });

    it("MIN_BLUR test", () =>
    {
        expect(FilterController.MIN_BLUR).toBe(0);
    });

    it("MAX_BLUR test", () =>
    {
        expect(FilterController.MAX_BLUR).toBe(255);
    });

    it("MIN_ALPHA test", () =>
    {
        expect(FilterController.MIN_ALPHA).toBe(0);
    });

    it("MAX_ALPHA test", () =>
    {
        expect(FilterController.MAX_ALPHA).toBe(100);
    });

    it("MIN_STRENGTH test", () =>
    {
        expect(FilterController.MIN_STRENGTH).toBe(0);
    });

    it("MAX_STRENGTH test", () =>
    {
        expect(FilterController.MAX_STRENGTH).toBe(255);
    });

    it("MIN_ROTATE test", () =>
    {
        expect(FilterController.MIN_ROTATE).toBe(-360);
    });

    it("MAX_ROTATE test", () =>
    {
        expect(FilterController.MAX_ROTATE).toBe(360);
    });

    it("MIN_DISTANCE test", () =>
    {
        expect(FilterController.MIN_DISTANCE).toBe(-255);
    });

    it("MAX_DISTANCE test", () =>
    {
        expect(FilterController.MAX_DISTANCE).toBe(255);
    });

    it("MIN_COLOR test", () =>
    {
        expect(FilterController.MIN_COLOR).toBe(0);
    });

    it("MAX_COLOR test", () =>
    {
        expect(FilterController.MAX_COLOR).toBe(0xffffff);
    });

    it("MIN_QUALITY test", () =>
    {
        expect(FilterController.MIN_QUALITY).toBe(0);
    });

    it("MAX_QUALITY test", () =>
    {
        expect(FilterController.MAX_QUALITY).toBe(16);
    });
});

describe("FilterController.js function test", () =>
{
    it("default test", () =>
    {

    });
});
