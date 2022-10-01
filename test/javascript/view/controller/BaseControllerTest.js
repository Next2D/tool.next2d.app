describe("BaseController.js property test", () =>
{
    it("property test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const baseController = new BaseController("test");

        // 初期値
        expect(baseController.name).toBe("test");
        expect(baseController._$saved).toBe(false);
        expect(baseController._$focus).toBe(false);
        expect(baseController._$pointX).toBe(0);
        expect(baseController._$pointY).toBe(0);
        expect(baseController._$currentValue).toBe(null);
        expect(baseController._$currentTarget).toBe(null);
        expect(baseController._$lockTarget).toBe(null);
        expect(baseController._$mouseMove).toBe(null);
        expect(baseController._$mouseUp).toBe(null);
        expect(baseController._$handler).toBe(null);

        Util.$workSpaces.length = 0;
    });
});

describe("BaseController.js function test", () =>
{
    it("focusIn and focusOut test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const baseController = new BaseController("test");
        expect(baseController._$focus).toBe(false);
        expect(baseController._$currentValue).toBe(null);
        expect(Util.$keyLock).toBe(false);

        baseController.focusIn({
            "target": {
                "value": "100"
            }
        });
        expect(baseController._$focus).toBe(true);
        expect(baseController._$currentValue).toBe(100);
        expect(Util.$keyLock).toBe(true);

        baseController.focusOut();
        expect(baseController._$focus).toBe(false);
        expect(baseController._$currentValue).toBe(null);
        expect(baseController._$currentTarget).toBe(null);
        expect(baseController._$lockTarget).toBe(null);
        expect(Util.$keyLock).toBe(false);

        Util.$workSpaces.length = 0;
    });

    it("mouseOver and mouseOut test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const baseController = new BaseController("test");

        const event = {
            "stopPropagation": () => { return 0 },
            "target": {
                "style": {
                    "cursor": "auto"
                }
            }
        };

        baseController._$focus = true;
        baseController._$currentTarget = "test";
        baseController._$currentValue  = "test";
        baseController.mouseOver(event);
        expect(event.target.style.cursor).toBe("auto");

        baseController._$focus = false;
        baseController._$currentTarget = null;
        baseController._$currentValue  = null;
        baseController.mouseOver(event);
        expect(event.target.style.cursor).toBe("ew-resize");

        baseController._$focus = true;
        baseController.mouseOut(event);
        expect(event.target.style.cursor).toBe("");

        Util.$workSpaces.length = 0;
    });

    it("mouseDown and mouseUp test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const baseController = new BaseController("test");

        let state = "off";

        const event = {
            "preventDefault": () => { state = "on" },
            "target": {
                "style": {
                    "cursor": "auto"
                },
                "value": "333",
                "focus": () => { return 1 }
            },
            "screenX": 100
        };

        baseController._$focus = true;
        baseController.mouseDown(event);
        expect(state).toBe("off");

        baseController._$focus = false;
        expect(baseController._$pointX).toBe(0);
        expect(baseController._$currentTarget).toBe(null);
        expect(baseController._$currentValue).toBe(null);
        expect(baseController._$mouseMove).toBe(null);
        expect(baseController._$mouseUp).toBe(null);

        baseController.mouseDown(event);
        expect(state).toBe("on");
        expect(baseController._$pointX).toBe(100);
        expect(baseController._$currentTarget).toBe(event.target);
        expect(baseController._$currentValue).toBe(333);
        expect(typeof baseController._$mouseMove).toBe("function");
        expect(typeof baseController._$mouseUp).toBe("function");

        expect(event.target.style.cursor).toBe("auto");
        baseController.mouseUp(event);
        expect(event.target.style.cursor).toBe("");

        Util.$workSpaces.length = 0;
    });

    it("mouseMove test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const baseController = new BaseController("test");

        const event = {
            "preventDefault": () => {
                const workSpaces = new WorkSpace();
                Util.$activeWorkSpaceId = Util.$workSpaces.length;
                Util.$workSpaces.push(workSpaces);
            },
            "screenX": 100
        };

        baseController._$focus = false;
        baseController._$currentTarget = {
            "value": "333",
            "id": "test"
        };

        baseController.changeTest = () =>
        {
            expect(baseController._$currentTarget.value).toBe("333");
            Util.$workSpaces.length = 0;
        };
        baseController.mouseMove(event);

        Util.$workSpaces.length = 0;
    });
});
