import { execute } from "./ScreenTabKeyPressEventService";

describe("ScreenTabKeyPressEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");

        let prevent = true;
        let state = "on";
        let blur = "off";
        const eventMock = {
            "key": "Enter",
            "currentTarget": {
                "blur": () => 
                {
                    blur = "on";
                }
            },
            "stopPropagation": () =>
            {
                state = "off";
            },
            "preventDefault": () =>
            {
                prevent = false;
            }
        };

        expect(prevent).toBe(true);
        expect(state).toBe("on");
        expect(blur).toBe("off");
        
        execute(eventMock);

        expect(prevent).toBe(false);
        expect(state).toBe("off");
        expect(blur).toBe("on");
    });
});