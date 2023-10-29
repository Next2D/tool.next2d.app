import { UserAreaStateObjectImpl } from "../../../../interface/UserAreaStateObjectImpl";
import { execute } from "./UserTimelineAreaStateGetService";

describe("UserTimelineAreaStateGetServiceTest", () =>
{
    test("execute test", () =>
    {
        const object: UserAreaStateObjectImpl = execute();
        expect(object.state).toBe("fixed");
        expect(object.offsetLeft).toBe(0);
        expect(object.offsetTop).toBe(0);
    });
});