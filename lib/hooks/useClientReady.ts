"use client";

import * as React from "react";

export function useClientReady() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setReady(true);
  }, []);

  return ready;
}
