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

    it("mouseDown and mouseMove and mouseUp test", () =>
    {
        const inputEvent = new InputEvent();

        const eventMock = {
            "preventDefault": () =>
            {
                return 0;
            },
            "stopPropagation": () =>
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
                },
                "id": "test-function",
                "value": 100
            },
            "screenX": 100
        };

        expect(inputEvent._$mouseMove).toBe(null);
        expect(inputEvent._$mouseUp).toBe(null);
        expect(eventMock.target.value).toBe(100);
        expect(eventMock.screenX).toBe(100);

        // マウスダウンで発動
        inputEvent.mouseDown(eventMock);
        expect(inputEvent._$pointX).toBe(eventMock.screenX);
        expect(inputEvent._$currentTarget).toBe(eventMock.target);
        expect(typeof inputEvent._$mouseMove).toBe("function");
        expect(typeof inputEvent._$mouseUp).toBe("function");
        expect(eventMock.target.style.cursor).toBe("auto");

        // マウス移動
        inputEvent.changeTestFunction = (value) =>
        {
            expect(value).toBe(150);

            // マウスアップデ終了
            inputEvent.mouseUp();
            expect(eventMock.target.style.cursor).toBe("");
            expect(typeof inputEvent._$mouseMove).toBe("function");
            expect(typeof inputEvent._$mouseUp).toBe("function");

            return value;
        };

        eventMock.screenX = 150;
        inputEvent.mouseMove(eventMock);
    });
});

describe("InputEvent.js focus test", () =>
{
    it("focusIn and focusOut test", () =>
    {
        const inputEvent = new InputEvent();

        // 初期値
        expect(inputEvent._$focus).toBe(false);
        expect(Util.$keyLock).toBe(false);

        // 関数コール後の変数値
        inputEvent.focusIn();
        expect(inputEvent._$focus).toBe(true);
        expect(Util.$keyLock).toBe(true);

        inputEvent.focusOut();
        expect(inputEvent._$saved).toBe(false);
        expect(inputEvent._$focus).toBe(false);
        expect(inputEvent._$currentTarget).toBe(null);
        expect(Util.$keyLock).toBe(false);
    });
});
