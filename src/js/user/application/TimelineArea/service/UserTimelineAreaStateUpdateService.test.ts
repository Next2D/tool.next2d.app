import { execute } from "./UserTimelineAreaStateUpdateService";
import { execute as userTimelineAreaStateGetService } from "./UserTimelineAreaStateGetService";
import { UserTimelineAreaStateObjectImpl } from "../../../../interface/UserTimelineAreaStateObjectImpl";

describe("UserTimelineAreaStateUpdateServiceTest", () =>
{
    test("execute test", () =>
    {
        const mock: UserTimelineAreaStateObjectImpl = {
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0,
            "width": 0,
            "height": 0
        };

        expect(mock.state).toBe("fixed");
        expect(mock.offsetLeft).toBe(0);
        expect(mock.offsetTop).toBe(0);
        expect(mock.width).toBe(0);
        expect(mock.height).toBe(0);

        mock.state = "move";
        mock.offsetLeft = 10;
        mock.offsetTop = 20;
        mock.width = 800;
        mock.height = 300;

        execute(mock);

        const object: UserTimelineAreaStateObjectImpl = userTimelineAreaStateGetService();
        expect(object.state).toBe("move");
        expect(object.offsetLeft).toBe(10);
        expect(object.offsetTop).toBe(20);
        expect(object.width).toBe(800);
        expect(object.height).toBe(300);
    });
});