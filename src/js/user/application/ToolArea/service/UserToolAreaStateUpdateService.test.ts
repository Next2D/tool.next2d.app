import { execute } from "./UserToolAreaStateUpdateService";
import { execute as userToolAreaStateGetService } from "./UserToolAreaStateGetService";
import { UserToolAreaStateObjectImpl } from "../../../../interface/UserToolAreaStateObjectImpl";

describe("UserToolAreaStateUpdateServiceTest", () =>
{
    test("execute test", () =>
    {
        const mock: UserToolAreaStateObjectImpl = {
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

        const object: UserToolAreaStateObjectImpl = userToolAreaStateGetService();
        expect(object.state).toBe("move");
        expect(object.offsetLeft).toBe(10);
        expect(object.offsetTop).toBe(20);
    });
});