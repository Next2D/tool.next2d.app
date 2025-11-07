import { execute } from "./DetailModalRegisterFadeEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as detailModalFadeInUseCase } from "./DetailModalFadeInUseCase";
import { execute as detailModalFadeOutUseCase } from "./DetailModalFadeOutUseCase";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("./DetailModalFadeInUseCase");
vi.mock("./DetailModalFadeOutUseCase");

describe("DetailModalRegisterFadeEventUseCase", () =>
{
    let mockContainer: HTMLElement;

    beforeEach(() =>
    {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });

    it("should register events for all elements with data-detail attribute", async () =>
    {
        const element1 = document.createElement("button");
        element1.dataset.detail = "button1";
        element1.addEventListener = vi.fn();

        const element2 = document.createElement("div");
        element2.dataset.detail = "div1";
        element2.addEventListener = vi.fn();

        const element3 = document.createElement("span");
        element3.dataset.detail = "span1";
        element3.addEventListener = vi.fn();

        mockContainer.appendChild(element1);
        mockContainer.appendChild(element2);
        mockContainer.appendChild(element3);

        await execute(mockContainer);

        expect(element1.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OVER,
            detailModalFadeInUseCase
        );
        expect(element1.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OUT,
            detailModalFadeOutUseCase
        );

        expect(element2.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OVER,
            detailModalFadeInUseCase
        );
        expect(element2.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OUT,
            detailModalFadeOutUseCase
        );

        expect(element3.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OVER,
            detailModalFadeInUseCase
        );
        expect(element3.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OUT,
            detailModalFadeOutUseCase
        );
    });

    it("should work with Document as element", async () =>
    {
        const element = document.createElement("button");
        element.dataset.detail = "button";
        element.addEventListener = vi.fn();
        document.body.appendChild(element);

        await execute(document);

        expect(element.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OVER,
            detailModalFadeInUseCase
        );
        expect(element.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OUT,
            detailModalFadeOutUseCase
        );
    });

    it("should not throw error if no elements with data-detail exist", async () =>
    {
        await expect(execute(mockContainer)).resolves.not.toThrow();
    });

    it("should skip null elements", async () =>
    {
        const element1 = document.createElement("button");
        element1.dataset.detail = "button1";
        element1.addEventListener = vi.fn();
        mockContainer.appendChild(element1);

        const mockQuerySelectorAll = vi.fn().mockReturnValue([element1, null, undefined]);
        mockContainer.querySelectorAll = mockQuerySelectorAll;

        await expect(execute(mockContainer)).resolves.not.toThrow();

        expect(element1.addEventListener).toHaveBeenCalled();
    });

    it("should handle empty container", async () =>
    {
        await expect(execute(mockContainer)).resolves.not.toThrow();
    });

    it("should register events for nested elements", async () =>
    {
        const parent = document.createElement("div");
        const child = document.createElement("button");
        child.dataset.detail = "nested";
        child.addEventListener = vi.fn();

        parent.appendChild(child);
        mockContainer.appendChild(parent);

        await execute(mockContainer);

        expect(child.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OVER,
            detailModalFadeInUseCase
        );
        expect(child.addEventListener).toHaveBeenCalledWith(
            EventType.POINTER_OUT,
            detailModalFadeOutUseCase
        );
    });

    it("should not register events for elements without data-detail", async () =>
    {
        const elementWithoutDetail = document.createElement("button");
        elementWithoutDetail.addEventListener = vi.fn();

        const elementWithDetail = document.createElement("button");
        elementWithDetail.dataset.detail = "button1";
        elementWithDetail.addEventListener = vi.fn();

        mockContainer.appendChild(elementWithoutDetail);
        mockContainer.appendChild(elementWithDetail);

        await execute(mockContainer);

        expect(elementWithoutDetail.addEventListener).not.toHaveBeenCalled();
        expect(elementWithDetail.addEventListener).toHaveBeenCalledTimes(2);
    });
});
