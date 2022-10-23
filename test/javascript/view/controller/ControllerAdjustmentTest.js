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

describe("ControllerAdjustment.js function test", () =>
{
    it("mouseDown test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const controllerAdjustment = new ControllerAdjustment();
        expect(controllerAdjustment._$pointX).toBe(0);
        expect(controllerAdjustment._$mouseMove).toBe(null);
        expect(controllerAdjustment._$mouseUp).toBe(null);

        controllerAdjustment.mouseDown({
            "preventDefault": () => { return true },
            "stopPropagation": () => { return true },
            "screenX": 100
        });
        expect(controllerAdjustment._$pointX).toBe(100);
        expect(typeof controllerAdjustment._$mouseMove).toBe("function");
        expect(typeof controllerAdjustment._$mouseUp).toBe("function");

        Util.$workSpaces.length = 0;
    });
});
