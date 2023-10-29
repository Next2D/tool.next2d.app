import { execute } from "./UserTimelineAreaStateUpdateService";
import { execute as userTimelineAreaStateGetService } from "./UserTimelineAreaStateGetService";
import { UserAreaStateObjectImpl } from "../../../../interface/UserAreaStateObjectImpl";

describe("UserTimelineAreaStateUpdateServiceTest", () =>
{
    test("execute test", () =>
    {
        const mock: UserAreaStateObjectImpl = {
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0
        };

        expect(mock.state).toBe("fixed");
        expect(mock.offsetLeft).toBe(0);
        expect(mock.offsetTop).toBe(0);

        mock.state = "move";
        mock.offsetLeft = 10;
        mock.offsetTop = 20;

        execute(mock);

        const object: UserAreaStateObjectImpl = userTimelineAreaStateGetService();
        expect(object.state).toBe("move");
        expect(object.offsetLeft).toBe(10);
        expect(object.offsetTop).toBe(20);
    });
});