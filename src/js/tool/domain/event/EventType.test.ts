import { EventType } from "./EventType";

describe("EventTypeTest", () =>
{
    test("static test", () =>
    {
        expect(EventType.POINTER_DOWN).toBe("pointerdown");
        expect(EventType.POINTER_UP).toBe("pointerup");
        expect(EventType.POINTER_MOVE).toBe("pointermove");
        expect(EventType.START).toBe("start");
        expect(EventType.END).toBe("end");
        expect(EventType.CHANGE).toBe("change");
        expect(EventType.POINTER_OVER).toBe("pointerover");
        expect(EventType.POINTER_OUT).toBe("pointerout");
        expect(EventType.KEY_DOWN).toBe("keydown");
        expect(EventType.POINTER_LEAVE).toBe("pointerleave");
    });
});