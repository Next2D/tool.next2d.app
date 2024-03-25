import { execute } from "./ExternalLayerGetLayerModeService";

describe("ExternalLayerGetLayerModeServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute("normal")).toBe(0);
        expect(execute("mask")).toBe(1);
        expect(execute("mask_in")).toBe(2);
        expect(execute("guide")).toBe(3);
        expect(execute("guide_in")).toBe(4);
    });
});