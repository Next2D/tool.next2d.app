import { execute } from "./ExternalLayerGetLayerTypeService";

describe("ExternalLayerGetLayerTypeServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute(0)).toBe("normal");
        expect(execute(1)).toBe("mask");
        expect(execute(2)).toBe("mask_in");
        expect(execute(3)).toBe("guide");
        expect(execute(4)).toBe("guide_in");
    });
});