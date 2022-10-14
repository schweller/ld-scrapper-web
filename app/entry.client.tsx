import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { hydrate as hydrateReactDom } from "react-dom"

// function hydrate() {
//   startTransition(() => {
//     hydrateRoot(
//       document,
//       <StrictMode>
//         <RemixBrowser />
//       </StrictMode>
//     );
//   });
// }

function hydrate() {
  hydrateReactDom(<RemixBrowser/>, document)
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
