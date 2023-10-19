import { UserToolAreaStateObjectImpl } from "../../../interface/UserToolAreaStateObjectImpl";
import { execute } from "./UserToolAreaStateGetService";

describe("UserToolAreaStateGetServiceTest", () =>
{
    test("execute test", () =>
    {
        const object: UserToolAreaStateObjectImpl = execute();
        expect(object.state).toBe("fixed");
        expect(object.offsetLeft).toBe(0);
        expect(object.offsetTop).toBe(0);
    });
});