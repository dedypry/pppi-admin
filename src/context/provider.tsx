import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Suspense } from "react";

import { persistor, store } from "../stores";
import Loading from "../components/loading/Loading";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Suspense fallback={<Loading />}>
          <HeroUIProvider navigate={navigate} useHref={useHref}>
            <ToastProvider
              placement="top-right"
              toastProps={{
                radius: "md",
                color: "primary",
                variant: "solid",
                timeout: 3000,
                hideIcon: true,
                classNames: {
                  closeButton:
                    "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
                  title: "text-white font-bold text-[20px]",
                  description: "text-white",
                },
              }}
            />
            {children}
          </HeroUIProvider>
        </Suspense>
      </PersistGate>
    </ReduxProvider>
  );
}
