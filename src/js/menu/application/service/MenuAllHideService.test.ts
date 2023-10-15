import { $registerMenu } from "../Menu";
import { execute } from "./MenuAllHideService";

describe("MenuAllHideServiceTest", () =>
{
    test("execute test", () =>
    {
        let mock1State = "show";
        const mock1 = {
            "name": "mock1",
            "hide": () =>
            {
                mock1State = "hide";
            }
        };

        let mock2State = "show";
        const mock2 = {
            "name": "mock2",
            "hide": () =>
            {
                mock2State = "hide";
            }
        };

        expect(mock1State).toBe("show");
        expect(mock2State).toBe("show");
        $registerMenu(mock1);
        $registerMenu(mock2);

        execute();
        expect(mock1State).toBe("hide");
        expect(mock2State).toBe("hide");
    });
});