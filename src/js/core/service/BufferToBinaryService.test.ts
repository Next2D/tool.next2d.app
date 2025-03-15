import { execute } from "./BufferToBinaryService";
import { describe, expect, it } from "vitest";

describe("BufferToBinaryServiceTest", () =>
{
    it("execute test", () =>
    {
        const buffer = new Uint8Array([97, 98, 99]);
        const binary = execute(buffer);
        expect(binary.length).toBe(3);
        expect(binary[0]).toBe("a");
        expect(binary[1]).toBe("b");
        expect(binary[2]).toBe("c");
    });
});