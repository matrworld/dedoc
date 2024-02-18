import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import type { CSSProperties, FC, MouseEvent, PropsWithChildren, ReactElement } from 'react';

import {
    type Adapter,
    type MessageSignerWalletAdapterProps,
    type SignerWalletAdapterProps,
    type SignInMessageSignerWalletAdapterProps,
    type WalletAdapterProps,
    type WalletName,
    type WalletReadyState,
} from '@solana/wallet-adapter-base';

import { useWalletMultiButton } from './useWalletMultiButton';
import { useWalletModal } from "./useWalletModal";
import { useWalletConnectButton } from "./useWalletConnectButton";

type Props = ButtonProps & {
    labels?: Omit<
        { [TButtonState in ReturnType<typeof useWalletMultiButton>['buttonState']]: string },
        'connected' | 'disconnecting'
    > & {
        'copy-address': string;
        copied: string;
        'change-wallet': string;
        disconnect: string;
    };
};

const LABELS = {
    'change-wallet': 'Change wallet',
    connecting: 'Connecting ...',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': 'Select Wallet',
} as const;

export type ButtonProps = PropsWithChildren<{
    className?: string;
    disabled?: boolean;
    endIcon?: ReactElement;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    startIcon?: ReactElement;
    style?: CSSProperties;
    tabIndex?: number;
}>;

export const Button: FC<ButtonProps> = (props) => {
    return (
        <button
            className={`btn btn-outline`}
            disabled={props.disabled}
            style={props.style}
            onClick={props.onClick}
            tabIndex={props.tabIndex || 0}
            type="button"
        >
            {props.startIcon && <i className="wallet-adapter-button-start-icon">{props.startIcon}</i>}
            {props.children}
            {props.endIcon && <i className="wallet-adapter-button-end-icon">{props.endIcon}</i>}
        </button>
    );
};


export interface Wallet {
    adapter: Adapter;
    readyState: WalletReadyState;
}

export interface WalletIconProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    wallet: { adapter: Pick<Wallet['adapter'], 'icon' | 'name'> } | null;
}
export const WalletIcon: FC<WalletIconProps> = ({ wallet, ...props }) => {
    return wallet && <img src={wallet.adapter.icon} alt={`${wallet.adapter.name} icon`} {...props} />;
};


export function BaseWalletConnectionButton({ walletIcon, walletName, ...props }: React.ComponentProps<typeof Button> & {
    walletIcon?: string;
    walletName?: WalletName;
}) {
    return (
        <Button
            {...props}
            className="wallet-adapter-button-trigger"
            startIcon={
                walletIcon && walletName ? (
                    <WalletIcon wallet={{ adapter: { icon: walletIcon, name: walletName } }} />
                ) : undefined
            }
        />
    );
}

export function BaseWalletConnectButton({ children, disabled, labels, onClick, ...props }: ButtonProps & {
    labels: { [TButtonState in ReturnType<typeof useWalletConnectButton>['buttonState']]: string };
}) {
    const { buttonDisabled, buttonState, onButtonClick, walletIcon, walletName } = useWalletConnectButton();
    return (
        <BaseWalletConnectionButton
            {...props}
            disabled={disabled || buttonDisabled}
            onClick={(e) => {
                if (onClick) {
                    onClick(e);
                }
                if (e.defaultPrevented) {
                    return;
                }
                if (onButtonClick) {
                    onButtonClick();
                }
            }}
            walletIcon={walletIcon}
            walletName={walletName}
        >
            {children ? children : labels[buttonState]}
        </BaseWalletConnectionButton>
    );
}

export function WalletMultiButton({ children, labels = LABELS, ...props }: Props) {
    const { setVisible: setModalVisible } = useWalletModal();
    const { buttonState, onConnect, onDisconnect, publicKey, walletIcon, walletName } = useWalletMultiButton({
        onSelectWallet() {
            setModalVisible(true);
        },
    });
    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const ref = useRef<HTMLUListElement>(null);
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) return;

            setMenuOpen(false);
        };

        // @ts-ignore - TODO
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
             // @ts-ignore - TODO
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, []);
    const content = useMemo(() => {
        if (children) {
            return children;
        } else if (publicKey) {
            const base58 = publicKey.toBase58();
            return base58.slice(0, 4) + '..' + base58.slice(-4);
        } else if (buttonState === 'connecting' || buttonState === 'has-wallet') {
            return labels[buttonState];
        } else {
            return labels['no-wallet'];
        }
    }, [buttonState, children, labels, publicKey]);
    return (
        <div className="wallet-adapter-dropdown">
            <BaseWalletConnectionButton
                {...props}
                aria-expanded={menuOpen}
                style={{ pointerEvents: menuOpen ? 'none' : 'auto', ...props.style }}
                onClick={() => {
                    switch (buttonState) {
                        case 'no-wallet':
                            setModalVisible(true);
                            break;
                        case 'has-wallet':
                            if (onConnect) {
                                onConnect();
                            }
                            break;
                        case 'connected':
                            setMenuOpen(true);
                            break;
                    }
                }}
                walletIcon={walletIcon}
                walletName={walletName}
            >
                {content}
            </BaseWalletConnectionButton>
            <ul
                aria-label="dropdown-list"
                className={`wallet-adapter-dropdown-list ${menuOpen && 'wallet-adapter-dropdown-list-active'}`}
                ref={ref}
                role="menu"
            >
                {publicKey ? (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={async () => {
                            await navigator.clipboard.writeText(publicKey.toBase58());
                            setCopied(true);
                            setTimeout(() => setCopied(false), 400);
                        }}
                        role="menuitem"
                    >
                        {copied ? labels['copied'] : labels['copy-address']}
                    </li>
                ) : null}
                <li
                    className="wallet-adapter-dropdown-list-item"
                    onClick={() => {
                        setModalVisible(true);
                        setMenuOpen(false);
                    }}
                    role="menuitem"
                >
                    {labels['change-wallet']}
                </li>
                {onDisconnect ? (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={() => {
                            onDisconnect();
                            setMenuOpen(false);
                        }}
                        role="menuitem"
                    >
                        {labels['disconnect']}
                    </li>
                ) : null}
            </ul>
        </div>
    );
}
