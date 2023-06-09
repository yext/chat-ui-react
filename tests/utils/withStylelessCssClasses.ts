import { withStylelessCssClasses } from "../../src/utils/withStylelessCssClasses";

it("generates styleless css classnames as expected", () => {
  const classes = withStylelessCssClasses("SomeComponent", {
    container: "",
    container__someSpecificField: "p-4",
    container__topField__subField: "border flex flex-col",
  });
  expect(classes).toEqual({
    container: "yext-chat-some-component__container",
    container__someSpecificField:
      "p-4 yext-chat-some-component__container__some-specific-field",
    container__topField__subField:
      "border flex flex-col yext-chat-some-component__container__top-field__sub-field",
  });
});

it("pass through fields of type object for child components to process", () => {
  const classes = withStylelessCssClasses("SomeComponent", {
    headerCssClasses: {
      container: "p-4",
    },
  });
  expect(classes).toEqual({
    headerCssClasses: {
      container: "p-4",
    },
  });
});
