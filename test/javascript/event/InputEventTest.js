describe("InputEvent.js test", () =>
{
    it("default check", () =>
    {
        const inputEvent = new InputEvent();
        expect(inputEvent._$saved).toBe(false);
        expect(inputEvent._$focus).toBe(false);
        expect(inputEvent._$currentEvent).toBe(null);
        expect(inputEvent._$currentTarget).toBe(null);
        expect(inputEvent._$mouseMove).toBe(null);
        expect(inputEvent._$mouseUp).toBe(null);
    });
});

describe("InputEvent.js changeFunction test", () =>
{
    it("changeFunction test", () =>
    {
        const inputEvent = new InputEvent();

        let result = "";
        expect(result).toBe("");

        inputEvent.changeTestFunction = (value) =>
        {
            result = value;
        };

        inputEvent.changeFunction("test-function", "test");
        expect(result).toBe("test");
    });
});


describe("InputEvent.js mouse test", () =>
{
    it("mouseOver test", () =>
    {
        const inputEvent = new InputEvent();

        const eventMock = {
            "stopPropagation": () =>
            {
                return 0;
            },
            "target": {
                "style": {
                    "cursor": "auto"
                },
                "value": 100
            }
        };

        expect(eventMock.target.style.cursor).toBe("auto");
        expect(eventMock.target.value).toBe(100);

        inputEvent.mouseOver(eventMock);
        expect(eventMock.target.style.cursor).toBe("ew-resize");
        expect(inputEvent._$currentValue).toBe(eventMock.target.value);
    });

    it("mouseOut test", () =>
    {
        const inputEvent = new InputEvent();

        const eventMock = {
            "stopPropagation": () =>
            {
                return 0;
            },
            "target": {
                "style": {
                    "cursor": "auto"
                }
            }
        };

        expect(eventMock.target.style.cursor).toBe("auto");
        inputEvent.mouseOut(eventMock);
        expect(eventMock.target.style.cursor).toBe("");
    });

    it("mouseDown test", () =>
    {
        const inputEvent = new InputEvent();

        const eventMock = {
            "preventDefault": () =>
            {
                return 0;
            },
            "target": {
                "style": {
                    "cursor": "auto"
                },
                "focus": () =>
                {
                    return 0;
                }
            },
            "screenX": 100
        };

        expect(inputEvent._$mouseMove).toBe(null);
        expect(inputEvent._$mouseUp).toBe(null);
        expect(eventMock.screenX).toBe(100);

        inputEvent.mouseDown(eventMock);
        expect(inputEvent._$pointX).toBe(eventMock.screenX);
        expect(inputEvent._$currentTarget).toBe(eventMock.target);
        expect(typeof inputEvent._$mouseMove).toBe("function");
        expect(typeof inputEvent._$mouseUp).toBe("function");
        expect(eventMock.target.style.cursor).toBe("auto");

        inputEvent.mouseUp();
        expect(eventMock.target.style.cursor).toBe("");
    });

});
