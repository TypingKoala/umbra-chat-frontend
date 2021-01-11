import { render, screen } from "@testing-library/react";

import App from "../../App";
import { BrowserRouter } from "react-router-dom";
import { ReactElement } from "react";

const renderWithRouter = (ui: ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)

  return render(ui, { wrapper: BrowserRouter })
}

it("goes to the verify handler when the route is /verify", () => {
  renderWithRouter(<App />, { route: "/verify" })
  expect(screen.getByText('Logging you in...')).toBeInTheDocument();
});
