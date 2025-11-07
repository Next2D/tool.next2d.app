import { execute } from "./ScreenOrderMenuInitializeRegisterEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenOrderMenuFrontPointerDownEventService } from "@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuFrontPointerDownEventService";
import { execute as screenOrderMenuFrontOnePointerDownEventService } from "@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuFrontOnePointerDownEventService";
import { execute as screenOrderMenuBackOnePointerDownEventService } from "@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuBackOnePointerDownEventService";
import { execute as screenOrderMenuBackPointerDownEventService } from "@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuBackPointerDownEventService";
import {
    $SCREEN_ORDER_FRONT_ID,
    $SCREEN_ORDER_FRONT_ONE_ID,
    $SCREEN_ORDER_BACK_ONE_ID,
    $SCREEN_ORDER_BACK_ID
} from "@/config/ScreenOrderMenuConfig";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuFrontPointerDownEventService");
vi.mock("@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuFrontOnePointerDownEventService");
vi.mock("@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuBackOnePointerDownEventService");
vi.mock("@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuBackPointerDownEventService");

describe("ScreenOrderMenuInitializeRegisterEventUseCase", () =>
{
    let mockFrontElement: HTMLElement;
    let mockFrontOneElement: HTMLElement;
    let mockBackOneElement: HTMLElement;
    let mockBackElement: HTMLElement;

    beforeEach(() =>
    {
        mockFrontElement = document.createElement("div");
        mockFrontElement.id = $SCREEN_ORDER_FRONT_ID;
        mockFrontElement.addEventListener = vi.fn();

        mockFrontOneElement = document.createElement("div");
        mockFrontOneElement.id = $SCREEN_ORDER_FRONT_ONE_ID;
        mockFrontOneElement.addEventListener = vi.fn();

        mockBackOneElement = document.createElement("div");
        mockBackOneElement.id = $SCREEN_ORDER_BACK_ONE_ID;
        mockBackOneElement.addEventListener = vi.fn();

        mockBackElement = document.createElement("div");
        mockBackElement.id = $SCREEN_ORDER_BACK_ID;
        mockBackElement.addEventListener = vi.fn();

        document.body.appendChild(mockFrontElement);
        document.body.appendChild(mockFrontOneElement);
        document.body.appendChild(mockBackOneElement);
        document.body.appendChild(mockBackElement);
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });

    it("should register all screen order menu event listeners", () =>
    {
        execute();

        expect(mockFrontElement.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_DOWN,
            screenOrderMenuFrontPointerDownEventService
        );
        expect(mockFrontOneElement.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_DOWN,
            screenOrderMenuFrontOnePointerDownEventService
        );
        expect(mockBackOneElement.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_DOWN,
            screenOrderMenuBackOnePointerDownEventService
        );
        expect(mockBackElement.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_DOWN,
            screenOrderMenuBackPointerDownEventService
        );
    });

    it("should not throw error if front element does not exist", () =>
    {
        document.getElementById($SCREEN_ORDER_FRONT_ID)?.remove();

        expect(() => execute()).not.toThrow();
        expect(mockFrontOneElement.addEventListener).toHaveBeenCalled();
        expect(mockBackOneElement.addEventListener).toHaveBeenCalled();
        expect(mockBackElement.addEventListener).toHaveBeenCalled();
    });

    it("should not throw error if front one element does not exist", () =>
    {
        document.getElementById($SCREEN_ORDER_FRONT_ONE_ID)?.remove();

        expect(() => execute()).not.toThrow();
        expect(mockFrontElement.addEventListener).toHaveBeenCalled();
        expect(mockBackOneElement.addEventListener).toHaveBeenCalled();
        expect(mockBackElement.addEventListener).toHaveBeenCalled();
    });

    it("should not throw error if back one element does not exist", () =>
    {
        document.getElementById($SCREEN_ORDER_BACK_ONE_ID)?.remove();

        expect(() => execute()).not.toThrow();
        expect(mockFrontElement.addEventListener).toHaveBeenCalled();
        expect(mockFrontOneElement.addEventListener).toHaveBeenCalled();
        expect(mockBackElement.addEventListener).toHaveBeenCalled();
    });

    it("should not throw error if back element does not exist", () =>
    {
        document.getElementById($SCREEN_ORDER_BACK_ID)?.remove();

        expect(() => execute()).not.toThrow();
        expect(mockFrontElement.addEventListener).toHaveBeenCalled();
        expect(mockFrontOneElement.addEventListener).toHaveBeenCalled();
        expect(mockBackOneElement.addEventListener).toHaveBeenCalled();
    });

    it("should not throw error if all elements do not exist", () =>
    {
        document.body.innerHTML = "";

        expect(() => execute()).not.toThrow();
    });
});
