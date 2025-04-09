import { execute } from "./TimelineLayerGetClassNameService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerGetClassNameServiceTest", () =>
{
    it("execute test", (): void =>
    {
        expect(execute(0)).toBe("timeline-layer-icon");
        expect(execute(1)).toBe("timeline-mask-icon");
        expect(execute(2)).toBe("timeline-mask-in-icon");
        expect(execute(3)).toBe("timeline-guide-icon");
        expect(execute(4)).toBe("timeline-guide-in-icon");
    });
});