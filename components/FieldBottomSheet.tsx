import React, { useMemo, forwardRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { ScrollView } from 'react-native-gesture-handler';
import { Container } from './Container';
import { useTheme } from '@shopify/restyle';
import { Theme } from '~/theme';

const FieldBottomSheet = forwardRef<BottomSheet, { children: React.ReactNode }>(
  ({ children }, ref) => {
    const theme = useTheme<Theme>();
    const snapPoints = useMemo(() => ['15%', '45%', '70%', '90%'], []);

    const handleIndicatorStyle = useMemo(
      () => ({
        backgroundColor: theme.colors.primary,
      }),
      [theme.colors.primary]
    );

    const handleStyle = useMemo(
      () => ({
        backgroundColor: theme.colors.background,
        shadowOpacity: 0,
        borderWidth: 0,
      }),
      [theme.colors.background]
    );

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        handleIndicatorStyle={handleIndicatorStyle}
        handleStyle={handleStyle}>
        <Container>
          <ScrollView>{children}</ScrollView>
        </Container>
      </BottomSheet>
    );
  }
);

export default FieldBottomSheet;
