import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { useAuth } from '~/lib/context/auth-context';
import { Container } from '../Container';
import { Box, Text } from '~/theme';
import { InputField } from '../Input';
import { Button } from '../Button';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    await auth.authenticate(data.email, data.password);
    setLoading(false);
  });

  return (
    <Container>
      <Box flex={1} gap="sm_12" alignItems="center" justifyContent="center">
        <Box alignItems="flex-start" width={'100%'}>
          <Text variant="title" color="foreground">
            Welcome back to
          </Text>
          <Text variant="large" color="primary">
            FarmGURU
          </Text>
        </Box>

        <Box width={'100%'} gap="sm_12">
          <Text variant="label" color="foreground">
            Email
          </Text>
          <Controller
            control={form.control}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <InputField
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
              />
            )}
            name="email"
          />
        </Box>

        <Box width={'100%'} gap="sm_12">
          <Text variant="label" color="foreground">
            Password
          </Text>
          <Controller
            control={form.control}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <InputField onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry />
            )}
            name="password"
          />
        </Box>
        <Button width={'100%'} onPress={onSubmit} variant="primary">
          <Text>{loading ? 'Loading...' : 'Login'}</Text>
        </Button>
      </Box>
    </Container>
  );
}
