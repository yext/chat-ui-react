import { useComposedCssClasses } from "../../src/hooks/useComposedCssClasses";
import { renderHook } from "@testing-library/react";
import * as tailwindMerge from "tailwind-merge";

describe("when there are no custom classes", () => {
  const builtInCssClasses = { container: "block p-1" };

  it("is a pass through", () => {
    const spy = jest.spyOn(tailwindMerge, "twMerge");
    const { result } = renderHook(() =>
      useComposedCssClasses(builtInCssClasses)
    );
    expect(spy).toHaveBeenCalledTimes(0);
    expect(result.current).toEqual(builtInCssClasses);
  });

  it("is a pass through when custom classes is a blank object", () => {
    const spy = jest.spyOn(tailwindMerge, "twMerge");
    const { result } = renderHook(() =>
      useComposedCssClasses(builtInCssClasses, {})
    );
    expect(spy).toHaveBeenCalledTimes(0);
    expect(result.current).toEqual(builtInCssClasses);
  });
});

it("merges classes without conflicts", () => {
  const builtInCssClasses = { container: "px-4 text-slate-700" };
  const customClasses = { container: "text-red-200 mb-3" };
  const { result } = renderHook(() =>
    useComposedCssClasses(builtInCssClasses, customClasses)
  );
  expect(result.current).toEqual({
    container: "px-4 text-red-200 mb-3",
  });
});

it("does not call twMerge when builtInClass is a blank string", () => {
  const spy = jest.spyOn(tailwindMerge, "twMerge");
  const builtInCssClasses = { container: "" };
  const customClasses = { container: "p-2" };
  const { result } = renderHook(() =>
    useComposedCssClasses(builtInCssClasses, customClasses)
  );
  expect(spy).toHaveBeenCalledTimes(0);
  expect(result.current).toEqual({
    container: "p-2",
  });
});

it("merges nested classes", () => {
  const spy = jest.spyOn(tailwindMerge, "twMerge");
  const builtInCssClasses = {
    container: {
      button: "bg-green-100 p-10",
      subcontainer1: {
        button1: "bg-red-100 p-10",
        subContainer2: {
          button2: "bg-blue-100 p-10",
        },
      },
    },
  };
  const customClasses = {
    container: {
      button: "p-0",
      subcontainer1: {
        button1: "p-1",
        subContainer2: {
          button2: "p-2",
        },
      },
    },
  };
  const { result } = renderHook(() =>
    useComposedCssClasses(builtInCssClasses, customClasses)
  );
  expect(spy).toHaveBeenCalled();
  expect(result.current).toEqual({
    container: {
      button: "bg-green-100 p-0",
      subcontainer1: {
        button1: "bg-red-100 p-1",
        subContainer2: {
          button2: "bg-blue-100 p-2",
        },
      },
    },
  });
});

it("takes custom classes with builtin is an empty object", () => {
  const builtInCssClasses = {
    container: {},
  };
  const customClasses = {
    container: {
      button: "p-0",
    },
  };
  const { result } = renderHook(() =>
    useComposedCssClasses(builtInCssClasses, customClasses)
  );
  expect(result.current).toEqual({
    container: {
      button: "p-0",
    },
  });
});

it("takes builtin classes with custom is an empty object", () => {
  const customClasses = {
    container: {},
  };
  const builtInCssClasses = {
    container: {
      button: "p-0",
    },
  };
  const { result } = renderHook(() =>
    useComposedCssClasses(builtInCssClasses, customClasses)
  );
  expect(result.current).toEqual({
    container: {
      button: "p-0",
    },
  });
});
