import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Modal, FlatList } from 'react-native';
import { Container } from '../Container';
import { Box, Text, useTheme } from '~/theme';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Dropdown from '../Dropdown';
import { Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { TextArea } from '../TextArea';
import VoiceRecord from '../VoiceRecord';
import ImagePicker from '../ImagePicker';
import { MapInput } from '../MapInput';
import { DateTimeSelector } from '../DateTimePicker';
import { format } from 'date-fns';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Button';
import { useAuth } from '~/lib/context/auth-context';
import { db } from '~/lib/db';
import { FieldsScoutPoints, NewFieldsScoutPoints, fieldsScoutPointsSchema } from '~/lib/db/schemas';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { syncScoutPoints } from '~/lib/context/fields-detail-context';
import { useQueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { time } from 'drizzle-orm/mysql-core';
// Define the methods you want to expose
export interface ScoutFormModalHandles {
  openModal: () => void;
  openModelWithData: (data: z.infer<typeof formSchema>) => void;
  closeModal: () => void;
}

const formSchema = z.object({
  category: z.string(),
  severity: z.string(),
  notes: z.string().optional(),
  createdOn: z.string(),
  location: z.tuple([z.number(), z.number()]),
  voiceNoteUri: z.string().optional(),
  photoUri: z.string().optional(),
});

const ScoutFormModal = forwardRef<
  ScoutFormModalHandles,
  {
    isUpdate?: boolean;
    markerId?: string;
    fid: string;
  }
>(({ isUpdate, fid, markerId }, ref) => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const categories = useMemo(() => {
    return [
      {
        label: 'Insect',
        value: 'insect',
        icon: () => <FontAwesome name="bug" size={20} color={theme.colors.foreground} />,
      },
      {
        label: 'Disease',
        value: 'disease',
        icon: () => <FontAwesome5 name="virus" size={20} color={theme.colors.foreground} />,
      },
      {
        label: 'Growth',
        value: 'growth',
        icon: () => <Entypo name="leaf" size={20} color={theme.colors.foreground} />,
      },
      {
        label: 'Others',
        value: 'others',
        icon: () => (
          <Entypo name="dots-three-horizontal" size={20} color={theme.colors.foreground} />
        ),
      },
      {
        label: 'Dont Know',
        value: 'dont know',
        icon: () => <FontAwesome5 name="question" size={20} color={theme.colors.foreground} />,
      },
    ];
  }, []);

  const severities = useMemo(() => {
    return [
      {
        label: 'Early',
        value: 'early',
        icon: () => (
          <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.softWarning} />
        ),
      },
      {
        label: 'Moderate',
        value: 'moderate',
        icon: () => (
          <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.warning} />
        ),
      },
      {
        label: 'Late',
        value: 'late',
        icon: () => (
          <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.destructive} />
        ),
      },
    ];
  }, []);

  // Use `useImperativeHandle` to expose specific functions to the parent component
  useImperativeHandle(ref, () => ({
    openModal: () => {
      setOpen(true);
    },
    closeModal: () => {
      setOpen(false);
    },
    openModelWithData: (data) => {
      form.reset(data);
      setOpen(true);
    },
  }));

  const handleDateTimeChange = (event: any, mode: 'date' | 'time', selectedDate?: Date) => {
    const dateTime = new Date(form.watch('createdOn'));

    if (mode === 'date' && selectedDate) {
      // Update only the date part, preserve the time

      const currentDate = new Date(
        dateTime.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );

      form.setValue('createdOn', currentDate.toISOString());
    } else if (mode === 'time' && selectedDate) {
      // Update only the time part, preserve the date
      const newTime = new Date(dateTime);
      newTime.setHours(selectedDate.getHours());
      newTime.setMinutes(selectedDate.getMinutes());
      form.setValue('createdOn', newTime.toISOString());
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    const user = auth.user as UserData;

    let result: FieldsScoutPoints | undefined;

    Toast.show({
      type: 'info',
      text1: 'Adding Scout Point, Please Wait...',
    });

    console.log(data);
    if (isUpdate) {
      if (markerId === undefined) return console.log('Marker ID is undefined');

      const res = await db
        .update(fieldsScoutPointsSchema)
        .set({
          category: data.category,
          severity: data.severity,
          location: data.location,
          photosFiles: data.photoUri ? [data.photoUri] : [],
          voiceNoteFile: data.voiceNoteUri,
          notes: data.notes,
          lastUpdate: new Date().toISOString(),
          isDirty: true,
          isNew: false,
        })
        .where(eq(fieldsScoutPointsSchema.id, markerId))
        .returning();
      if (res[0]) result = res[0] as FieldsScoutPoints;
    } else {
      const dataToInsert: NewFieldsScoutPoints = {
        id: 'temp' + Math.random(),
        fieldId: fid,
        date: new Date(data.createdOn),
        category: data.category,
        severity: data.severity,
        isNew: true,
        isDirty: true,
        location: data.location,
        photosFiles: data.photoUri ? [data.photoUri] : [],
        lastUpdate: new Date(data.createdOn).toISOString(),
        voiceNoteFile: data.voiceNoteUri,
      };
      const res = await db.insert(fieldsScoutPointsSchema).values(dataToInsert).returning();
      if (res[0]) result = res[0] as FieldsScoutPoints;
    }

    if (result) {
      const { isConnected } = await NetInfo.fetch();
      if (isConnected) {
        try {
          const res = await syncScoutPoints(result, fid, user, isUpdate ? false : true);
          if (!res) {
            Toast.show({
              type: 'error',
              text1: 'Failed to Sync Scout Point',
            });
          }

          await queryClient.invalidateQueries({
            queryKey: ['l-field-scout-points', fid],
          });
          await queryClient.invalidateQueries({
            queryKey: ['l-field-single-scout-point', res?.id],
          });
          Toast.show({
            type: 'success',
            text1: 'Scout Point Synced',
          });

          //await 1 sec
          setTimeout(() => {
            setOpen(false);
          }, 1500);

          setOpen(false);
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Failed to Sync Scout Point',
          });
        }
      } else {
        Toast.show({
          type: 'info',
          text1: 'No Internet Connection',
          text2: 'Scout Point will be synced when internet is available',
        });
        setTimeout(() => {
          setOpen(false);
        }, 1500);

        setOpen(false);
      }
    }
  });

  return (
    <Modal visible={open} onRequestClose={() => setOpen(false)}>
      <ScrollView nestedScrollEnabled={true}>
        <Container>
          <Box rowGap="m_16">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text color="foreground" variant="title">
                {isUpdate ? 'Edit' : 'Add'} Scout Point
              </Text>
              <MaterialCommunityIcons
                name="close"
                size={36}
                color={theme.colors.foreground}
                onPress={() => setOpen(false)}
              />
            </Box>

            <Box gap="sm_12">
              <Text color="foreground">Category</Text>
              <Dropdown
                placeholder="Select Category"
                zIndex={100}
                item={categories}
                value={form.watch('category')}
                onValueChange={(value) => {
                  //@ts-ignore

                  form.setValue('category', value);
                }}
              />
            </Box>

            <Box gap="sm_12">
              <Text color="foreground">Severity</Text>
              <Dropdown
                placeholder="Select Severity"
                zIndex={50}
                item={severities}
                value={form.watch('severity')}
                onValueChange={(value) => {
                  //@ts-ignore
                  form.setValue('severity', value);
                }}
              />
            </Box>
            <Box gap="sm_12">
              <Text color="foreground">Notes</Text>
              <TextArea
                value={form.watch('notes')}
                height={125}
                onChangeText={(v) => form.setValue('notes', v)}
              />
            </Box>

            <Box gap="sm_12">
              <Text color="foreground">Voice Note</Text>
              <VoiceRecord
                onRecordingComplete={(uri) => {
                  form.setValue('voiceNoteUri', uri);
                }}
              />
            </Box>

            <Box gap="sm_12">
              <Text color="foreground">Image</Text>
              <ImagePicker
                onImageSelected={(uri) => {
                  form.setValue('photoUri', uri);
                }}
              />
            </Box>

            <MapInput
              onLocationSelect={(e) => {
                form.setValue('location', [
                  e.nativeEvent.coordinate.latitude,
                  e.nativeEvent.coordinate.longitude,
                ]);
              }}
            />

            <DateTimeSelector
              mode={'date'}
              onTimeChange={(e, d) => {
                handleDateTimeChange(e, 'date', d);
              }}
              selectedDate={
                form.watch('createdOn')
                  ? new Date(form.watch('createdOn')).toISOString()
                  : new Date().toISOString()
              }
            />

            <DateTimeSelector
              mode={'time'}
              onTimeChange={(e, d) => {
                handleDateTimeChange(e, 'time', d);
              }}
              selectedDate={
                form.watch('createdOn')
                  ? new Date(form.watch('createdOn')).toISOString()
                  : new Date().toISOString()
              }
            />

            <Text color="foreground">
              {form.watch('createdOn')
                ? format(new Date(form.watch('createdOn')), 'EE ,d MMM yyy HH:mm aaa')
                : 'Select Date'}
            </Text>
          </Box>

          <Box flexDirection="row">
            <Button
              width={'50%'}
              paddingTop="s_8"
              paddingRight="s_8"
              onPress={() => {
                setOpen(false);
              }}>
              <Text color="foreground">Cancel</Text>
            </Button>
            <Button
              variant="primary"
              paddingTop="s_8"
              paddingLeft="s_8"
              width={'50%'}
              onPress={() => {
                onSubmit();

                console.log(form.formState.errors);
              }}>
              <Text>Save</Text>
            </Button>
          </Box>
        </Container>
      </ScrollView>
      <Toast />
    </Modal>
  );
});

export default ScoutFormModal;
