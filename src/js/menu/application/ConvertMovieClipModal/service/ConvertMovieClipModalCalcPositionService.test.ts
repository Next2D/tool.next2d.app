import { execute } from "./ConvertMovieClipModalCalcPositionService";
import { $anchorFrac, $selectReference, $resetState } from "../ConvertMovieClipModalUtil";
import type { Character } from "@/core/domain/model/Character";
import type { IBounds } from "@/interface/IBounds";
import { describe, expect, it, beforeEach } from "vitest";

describe("ConvertMovieClipModalCalcPositionService", () =>
{
    beforeEach(() =>
    {
        $resetState();
    });

    it("should calculate position for top-left anchor", () =>
    {
        $selectReference("top-left");
        
        const character: Character = {
            x: 100,
            y: 200
        } as Character;
        
        const bounds: IBounds = {
            xMin: 10,
            xMax: 50,
            yMin: 20,
            yMax: 60
        };
        
        const result = execute(character, bounds);
        
        // top-left anchor is [0, 0]
        // offsetX = 10 + abs(50 - 10) * 0 = 10
        // offsetY = 20 + abs(60 - 20) * 0 = 20
        expect(result.x).toBe(90);  // 100 - 10
        expect(result.y).toBe(180); // 200 - 20
    });

    it("should calculate position for middle-center anchor", () =>
    {
        $selectReference("middle-center");
        
        const character: Character = {
            x: 100,
            y: 200
        } as Character;
        
        const bounds: IBounds = {
            xMin: 0,
            xMax: 40,
            yMin: 0,
            yMax: 60
        };
        
        const result = execute(character, bounds);
        
        // middle-center anchor is [0.5, 0.5]
        // offsetX = 0 + abs(40 - 0) * 0.5 = 20
        // offsetY = 0 + abs(60 - 0) * 0.5 = 30
        expect(result.x).toBe(80);  // 100 - 20
        expect(result.y).toBe(170); // 200 - 30
    });

    it("should calculate position for bottom-right anchor", () =>
    {
        $selectReference("bottom-right");
        
        const character: Character = {
            x: 150,
            y: 250
        } as Character;
        
        const bounds: IBounds = {
            xMin: 10,
            xMax: 50,
            yMin: 20,
            yMax: 80
        };
        
        const result = execute(character, bounds);
        
        // bottom-right anchor is [1, 1]
        // offsetX = 10 + abs(50 - 10) * 1 = 50
        // offsetY = 20 + abs(80 - 20) * 1 = 80
        expect(result.x).toBe(100); // 150 - 50
        expect(result.y).toBe(170); // 250 - 80
    });

    it("should handle negative bounds", () =>
    {
        $selectReference("middle-center");
        
        const character: Character = {
            x: 50,
            y: 50
        } as Character;
        
        const bounds: IBounds = {
            xMin: -20,
            xMax: 20,
            yMin: -30,
            yMax: 30
        };
        
        const result = execute(character, bounds);
        
        // offsetX = -20 + abs(20 - (-20)) * 0.5 = -20 + 20 = 0
        // offsetY = -30 + abs(30 - (-30)) * 0.5 = -30 + 30 = 0
        expect(result.x).toBe(50); // 50 - 0
        expect(result.y).toBe(50); // 50 - 0
    });

    it("should calculate position for all anchor positions", () =>
    {
        const character: Character = {
            x: 100,
            y: 100
        } as Character;
        
        const bounds: IBounds = {
            xMin: 0,
            xMax: 60,
            yMin: 0,
            yMax: 40
        };

        Object.keys($anchorFrac).forEach(anchorId =>
        {
            $selectReference(anchorId);
            const result = execute(character, bounds);
            
            expect(result).toHaveProperty("x");
            expect(result).toHaveProperty("y");
            expect(typeof result.x).toBe("number");
            expect(typeof result.y).toBe("number");
        });
    });
});
