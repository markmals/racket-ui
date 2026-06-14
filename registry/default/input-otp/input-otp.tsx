"use client";

// Classification: C — local implementation. No `input-otp` package; built on
// a single accessible <input> (inputMode="numeric", autoComplete="one-time-code")
// overlaid by `length` styled slot boxes driven by React state + context.

import { IconMinus } from "@tabler/icons-react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ComponentProps,
    type KeyboardEvent,
    type ReactNode,
} from "react";

import { cx } from "@/lib/cva";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface InputOTPContextValue {
    value: string;
    length: number;
    activeIndex: number;
    isDisabled: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
}

let InputOTPContext = createContext<InputOTPContextValue | null>(null);

function useInputOTPContext(): InputOTPContextValue {
    let ctx = useContext(InputOTPContext);
    if (!ctx) {
        throw new Error("InputOTPSlot / InputOTPGroup must be used inside InputOTP");
    }
    return ctx;
}

// ---------------------------------------------------------------------------
// InputOTP — root
// ---------------------------------------------------------------------------

export interface InputOTPProps {
    /** Total number of OTP digits. */
    length?: number;
    /** Controlled value. */
    value?: string;
    /** Default value for uncontrolled usage. */
    defaultValue?: string;
    /** Called whenever the value changes. */
    onChange?: (value: string) => void;
    /** Called when all slots are filled. */
    onComplete?: (value: string) => void;
    isDisabled?: boolean;
    className?: string;
    containerClassName?: string;
    /** The slot UI (InputOTPGroup / InputOTPSlot / InputOTPSeparator). */
    children?: ReactNode;
    /** Forwarded to the underlying <input> (e.g. name, form, id). */
    inputProps?: ComponentProps<"input">;
}

function InputOTP({
    length = 6,
    value: controlledValue,
    defaultValue = "",
    onChange,
    onComplete,
    isDisabled = false,
    className,
    containerClassName,
    children,
    inputProps,
}: InputOTPProps) {
    let isControlled = controlledValue !== undefined;
    let [internalValue, setInternalValue] = useState(defaultValue);
    let value = controlledValue !== undefined ? controlledValue : internalValue;

    let [activeIndex, setActiveIndex] = useState(-1);
    let inputRef = useRef<HTMLInputElement | null>(null);

    let setValue = useCallback(
        (next: string) => {
            if (!isControlled) setInternalValue(next);
            onChange?.(next);
            if (next.length === length) onComplete?.(next);
        },
        [isControlled, length, onChange, onComplete],
    );

    // Sync the hidden input's value when controlled externally
    useEffect(() => {
        if (inputRef.current && isControlled) {
            let native = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value",
            );
            native?.set?.call(inputRef.current, controlledValue ?? "");
        }
    }, [controlledValue, isControlled]);

    function handleInput(e: React.FormEvent<HTMLInputElement>) {
        let raw = e.currentTarget.value;
        // Only keep numeric characters, trim to length
        let next = raw.replace(/\D/g, "").slice(0, length);
        setValue(next);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        let caretPos = e.currentTarget.selectionStart ?? value.length;
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            let next = Math.max(0, caretPos - 1);
            inputRef.current?.setSelectionRange(next, next);
            setActiveIndex(next);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            let next = Math.min(length - 1, caretPos + 1);
            inputRef.current?.setSelectionRange(next, next);
            setActiveIndex(next);
        } else if (e.key === "Backspace") {
            if (value.length === 0) return;
            e.preventDefault();
            let deleteAt = caretPos > 0 ? caretPos - 1 : 0;
            let next = value.slice(0, deleteAt) + value.slice(deleteAt + 1);
            setValue(next);
            // Move caret back one
            requestAnimationFrame(() => {
                inputRef.current?.setSelectionRange(deleteAt, deleteAt);
                setActiveIndex(deleteAt);
            });
        }
    }

    function handleSelect(e: React.SyntheticEvent<HTMLInputElement>) {
        let pos = e.currentTarget.selectionStart;
        if (pos !== null) setActiveIndex(pos);
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
        // Move caret to end of entered digits (next empty slot)
        let pos = Math.min(value.length, length - 1);
        e.currentTarget.setSelectionRange(pos, pos);
        setActiveIndex(pos);
    }

    function handleBlur() {
        setActiveIndex(-1);
    }

    return (
        <InputOTPContext.Provider value={{ value, length, activeIndex, isDisabled, inputRef }}>
            <div
                className={cx(
                    "relative flex items-center gap-2 has-[input:disabled]:opacity-50",
                    containerClassName,
                )}
                data-disabled={isDisabled || undefined}
                data-slot="input-otp"
            >
                {/* The real accessible input — visually hidden, covers the container */}
                <input
                    aria-label="One-time password"
                    autoComplete="one-time-code"
                    className={cx(
                        "absolute inset-0 z-10 h-full w-full cursor-default opacity-0 disabled:cursor-not-allowed",
                        className,
                    )}
                    disabled={isDisabled}
                    inputMode="numeric"
                    maxLength={length}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onSelect={handleSelect}
                    ref={inputRef}
                    type="text"
                    value={value}
                    {...inputProps}
                />
                {/* Visible slot boxes (the hidden input above overlays them). */}
                {children}
            </div>
        </InputOTPContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// InputOTPGroup — flex row wrapper
// ---------------------------------------------------------------------------

function InputOTPGroup({ className, children, ...props }: ComponentProps<"div">) {
    return (
        <div className={cx("flex items-center", className)} data-slot="input-otp-group" {...props}>
            {children}
        </div>
    );
}

// ---------------------------------------------------------------------------
// InputOTPSlot — individual character box
// ---------------------------------------------------------------------------

export interface InputOTPSlotProps extends Omit<ComponentProps<"div">, "children"> {
    index: number;
}

function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
    let { value, activeIndex, isDisabled } = useInputOTPContext();

    let char = value[index] ?? "";
    let isActive = activeIndex === index && !isDisabled;
    // Show blinking caret when the slot is active and not yet filled
    let showCaret = isActive && char === "";

    return (
        <div
            aria-hidden="true"
            className={cx(
                "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-xs transition-all outline-none",
                "first:rounded-l-md first:border-l last:rounded-r-md",
                "dark:bg-input/30",
                // Active slot ring
                "data-[active]:z-10 data-[active]:border-ring data-[active]:ring-[3px] data-[active]:ring-ring/50",
                // Invalid propagation (parent can set aria-invalid)
                "aria-invalid:border-destructive",
                "data-[active]:aria-invalid:border-destructive data-[active]:aria-invalid:ring-destructive/20 dark:data-[active]:aria-invalid:ring-destructive/40",
                className,
            )}
            data-active={isActive || undefined}
            data-disabled={isDisabled || undefined}
            data-slot="input-otp-slot"
            {...props}
        >
            {char}
            {showCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// InputOTPSeparator — dash / dot between groups
// ---------------------------------------------------------------------------

function InputOTPSeparator({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cx("flex items-center", className)}
            data-slot="input-otp-separator"
            role="separator"
            {...props}
        >
            <IconMinus aria-hidden="true" className="size-4" />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
