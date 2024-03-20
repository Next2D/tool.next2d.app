import { execute } from "./TimelineLayerGetClassNameService";

describe("TimelineLayerGetClassNameServiceTest", () =>
{
    test("execute test", (): void =>
    {
        expect(execute(0)).toBe("timeline-layer-icon");
        expect(execute(1)).toBe("timeline-mask-icon");
        expect(execute(2)).toBe("timeline-mask-in-icon");
        expect(execute(3)).toBe("timeline-guide-icon");
        expect(execute(4)).toBe("timeline-guide-in-icon");
        expect(execute(5)).toBe("timeline-folder-icon");
    });
});