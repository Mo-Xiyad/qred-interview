import { OverlayProvider } from '@gluestack-ui/overlay';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { ToastProvider } from '@gluestack-ui/toast';
import { colorScheme as colorSchemeNW } from 'nativewind';
import React from 'react';
import { ColorSchemeName, useColorScheme, ViewProps } from 'react-native';

import { config } from '@gluestack-ui/config';
type ModeType = 'light' | 'dark' | 'system';

const getColorSchemeName = (
  colorScheme: ColorSchemeName,
  mode: ModeType
): 'light' | 'dark' => {
  if (mode === 'system') {
    return colorScheme ?? 'light';
  }
  return mode;
};

export function UIProvider({
  mode = 'light',
  ...props
}: {
  mode?: 'light' | 'dark' | 'system';
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const colorScheme = useColorScheme();

  const colorSchemeName = getColorSchemeName(colorScheme, mode);

  colorSchemeNW.set(mode);

  return (
    <GluestackUIProvider config={config}>
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </GluestackUIProvider>
  );
}
