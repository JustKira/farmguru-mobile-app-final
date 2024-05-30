import { FlashList } from '@shopify/flash-list';

import { Stack, useRouter } from 'expo-router';
import { Container } from '~/components/Container';
import FieldMapCardSelector from '~/components/FieldMapCardSelector';
import { useFieldsData } from '~/lib/context/fields-data-context';

export default function Home() {
  const fields = useFieldsData();

  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <Container>
        <FlashList
          data={fields.data}
          renderItem={({ item, index }) => {
            const position = item.position as [number, number];
            const coordinates = item.location as [number, number][];
            const initialRegion = {
              latitude: position[0],
              longitude: position[1],
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };

            const polygonCoordinates = coordinates.map((coordinate) => {
              return { latitude: coordinate[0], longitude: coordinate[1] };
            });
            return (
              <FieldMapCardSelector
                index={index}
                onPress={() => router.push(`/(tabs)/${item.id}`)}
                name={item.name ?? 'Name Not Found'}
                initialRegion={initialRegion}
                polyCoords={polygonCoordinates}
              />
            );
          }}
          estimatedItemSize={15}
        />
      </Container>
    </>
  );
}
