"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AlertTriangle, Info } from "lucide-react";

type Options = {
  title: string;
  message?: string;
  confirmText?: string;
  danger?: boolean;
};

type State = (Options & { kind: "confirm" | "alert" }) | null;

type DialogApi = {
  confirmBox: (options: Options) => Promise<boolean>;
  alertBox: (options: Options) => Promise<void>;
};

const DialogContext = createContext<DialogApi>({
  confirmBox: async () => false,
  alertBox: async () => {},
});

export function useDialog() {
  return useContext(DialogContext);
}

export default function DialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<State>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const open = useCallback(
    (kind: "confirm" | "alert", options: Options) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setState({ kind, ...options });
      }),
    []
  );

  const confirmBox = useCallback(
    (options: Options) => open("confirm", options),
    [open]
  );

  const alertBox = useCallback(
    async (options: Options) => {
      await open("alert", options);
    },
    [open]
  );

  function close(result: boolean) {
    resolver.current?.(result);
    resolver.current = null;
    setState(null);
  }

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resolver.current?.(false);
        resolver.current = null;
        setState(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  return (
    <DialogContext.Provider value={{ confirmBox, alertBox }}>
      {children}

      {state && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-ink/40 backdrop-blur-sm"
          onClick={() => close(false)}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="pop-in card w-full max-w-sm p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  state.danger ? "bg-coral/20 text-coral" : "bg-lilac/40 text-grape"
                }`}
              >
                {state.danger ? <AlertTriangle size={28} /> : <Info size={28} />}
              </span>

              <h2 className="font-display mt-4 text-2xl font-semibold">
                {state.title}
              </h2>
              {state.message && (
                <p className="mt-2 text-sm font-semibold text-ink/70">
                  {state.message}
                </p>
              )}

              <div className="mt-6 flex justify-center gap-3">
                {state.kind === "confirm" ? (
                  <>
                    <button onClick={() => close(false)} className="btn-light">
                      Keep it
                    </button>
                    <button
                      onClick={() => close(true)}
                      className={
                        state.danger
                          ? "inline-flex items-center justify-center rounded-full bg-coral px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-6px_rgba(255,93,143,0.6)] transition hover:scale-105 active:scale-95"
                          : "btn-primary"
                      }
                    >
                      {state.confirmText ?? "Yes"}
                    </button>
                  </>
                ) : (
                  <button onClick={() => close(true)} className="btn-primary px-8">
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}