import * as React from "react";
import * as ReactDOM from "react-dom";
import AppContainer from "./containers/AppContainer";

(ReactDOM as any).unstable_createRoot(
    document.getElementById("app")
).render(<AppContainer />);
