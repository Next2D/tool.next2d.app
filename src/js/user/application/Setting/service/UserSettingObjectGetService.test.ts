import { IUserSettingIObject } from "../../../../interface/IUserSettingIObject";
import { execute } from "./UserSettingObjectGetService";
import { describe, expect, it } from "vitest";

describe("UserSettingObjectGetServiceTest", () =>
{
    it("execute test", () =>
    {
        const object: IUserSettingIObject = execute();
        expect(object.layer).toBe(false);
        expect(object.modal).toBe(true);
        expect(object.type).toBe("zlib");
    });
});