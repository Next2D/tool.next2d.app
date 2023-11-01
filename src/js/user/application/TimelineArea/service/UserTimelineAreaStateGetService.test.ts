import { UserTimelineAreaStateGetService } from "../../../../interface/UserTimelineAreaStateGetService";
import { execute } from "./UserTimelineAreaStateGetService";

describe("UserTimelineAreaStateGetServiceTest", () =>
{
    test("execute test", () =>
    {
        const object: UserTimelineAreaStateGetService = execute();
        expect(object.state).toBe("fixed");
        expect(object.offsetLeft).toBe(0);
        expect(object.offsetTop).toBe(0);
        expect(object.width).toBe(0);
        expect(object.height).toBe(0);
    });
});