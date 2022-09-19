describe("EventType.js test", () =>
{
    it("addEventListener test", () =>
    {
        const eventDispatcher = new EventDispatcher();

        const callback = function ()
        {
            return "callback";
        };

        expect(eventDispatcher._$events.has(EventType.MOUSE_DOWN)).toBe(false);

        // イベントを登録
        eventDispatcher.addEventListener(
            EventType.MOUSE_DOWN, callback
        );

        expect(eventDispatcher._$events.has(EventType.MOUSE_DOWN)).toBe(true);
        expect(eventDispatcher._$events.get(EventType.MOUSE_DOWN).length).toBe(1);

        const eventFunction = eventDispatcher._$events.get(EventType.MOUSE_DOWN)[0];
        expect(eventFunction === callback).toBe(true);
    });

    it("dispatchEvent test", () =>
    {
        const eventDispatcher = new EventDispatcher();

        let result = "ng";
        const callback = () =>
        {
            result = "ok";
        };

        expect(result).toBe("ng");

        // イベントを登録
        eventDispatcher.addEventListener(
            EventType.MOUSE_DOWN, callback
        );

        eventDispatcher.dispatchEvent(EventType.MOUSE_DOWN);
        expect(result).toBe("ok");
    });
});
