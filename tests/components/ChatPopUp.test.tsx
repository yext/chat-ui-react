// issue with testing library + React 18: https://github.com/testing-library/react-testing-library/issues/1216
/* eslint-disable testing-library/no-unnecessary-act */

import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import { ChatPopUp } from "../../src"

it("toggles display and hide css classes when click on popup button", async () => {
  render(<ChatPopUp panel={<div>My Panel</div>} customCssClasses={{
    panel__display: "display-css",
    panel__hidden: "hidden-css",
  }}/>)
  expect(screen.getByLabelText("Popup Panel")).toHaveClass("hidden-css");

  const popupButton = screen.getByLabelText("Chat Popup Button");
  await act(() => userEvent.click(popupButton));
  expect(screen.getByLabelText("Popup Panel")).toHaveClass("display-css");
})