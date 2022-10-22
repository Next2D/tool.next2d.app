describe("ControllerAdjustment.js property test", () =>
{
    it("default test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const controllerAdjustment = new ControllerAdjustment();
        expect(controllerAdjustment._$pointX).toBe(0);
        expect(controllerAdjustment._$mouseMove).toBe(null);
        expect(controllerAdjustment._$mouseUp).toBe(null);

        // 表示
        expect(document
            .documentElement
            .style
            .getPropertyValue("--controller-width"))
            .toBe(`${ControllerAdjustment.DEFAULT_SIZE}px`);

        Util.$workSpaces.length = 0;
    });

    it("DEFAULT_SIZE test", () =>
    {
        expect(ControllerAdjustment.DEFAULT_SIZE).toBe(360);
    });
});
