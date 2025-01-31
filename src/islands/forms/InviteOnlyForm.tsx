import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TurnstileWidgetIsland } from '@/islands/components/Turnstile';

const formSchema = z.object({
  inviteCode: z.string().min(1, "Please enter an invite code"),
  validVerification: z.boolean().refine((data) => data === true, {
    message: "Please complete the Turnstile verification",
  }),
});

type InviteOnlyFormValues = z.infer<typeof formSchema>;

export function InviteOnlyFormIsland({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [cfToken, setCfToken] = useState("");

  const form = useForm<InviteOnlyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteCode: "",
      validVerification: false,
    }
  });

  const handleInviteSubmit = async (formData: InviteOnlyFormValues) => {
    try {
      const response = await fetch('/api/verify-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: formData.inviteCode, cf: cfToken }),
      });

      if (response.status === 404) {
        form.setError('inviteCode', {
          message: "Invitation not found",
        });
        return;
      }

      if (response.status === 400) {
        form.setError('inviteCode', {
          message: "Invitation already used",
        });
        return;
      }

      if (response.status === 200) {
        window.location.replace('/');
      }
    } catch (error) {
      form.setError('inviteCode', {
        message: "An error occurred. Please try again.",
      });
    }
  };

  const handleTurnstileVerify = async (token: string) => {
    setCfToken(token);
    form.setValue('validVerification', true);
  };

  const handleTurnstileExpired = (expired: boolean) => {
    if (expired) {
      form.setError('validVerification', {
        message: "Verification expired, please try again",
      });
      form.setValue('validVerification', false);
    } else {
      form.clearErrors('validVerification');
      form.setValue('validVerification', true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            <h2 className="text-2xl font-bold mb-2">Welcome</h2>
          </CardTitle>
          <CardDescription>
            <div className="flex items-center justify-center gap-2">
              Enter your invite code
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleInviteSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="PREM-0123-OCN9-3VHM-40ETZ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs font-normal" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validVerification"
                  render={({ field }) => (
                    <div className="flex flex-col justify-center">
                      <TurnstileWidgetIsland
                        setToken={handleTurnstileVerify}
                        setExpired={handleTurnstileExpired}
                        {...field}
                      />
                      <FormMessage className="text-red-400 text-xs font-normal" />
                    </div>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                >
                  Continue
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}