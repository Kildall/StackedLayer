import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form
} from "@/components/ui/form"
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons"
import { cn } from "@/lib/utils"
import { signIn } from "auth-astro/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from 'react'
import { TurnstileWidgetIsland } from '@/islands/components/Turnstile'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  validVerification: z.boolean().refine((data) => data === true, {
    message: "Please complete the Turnstile verification",
  }),
})

export type LoginFormValues = z.infer<typeof formSchema>

export type LoginFormProps = {
  inviteOnly?: boolean
}

export function LoginFormIsland({
  className,
  inviteOnly,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & LoginFormProps) {
  const [_, setIsTurnstileVerified] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      validVerification: false,
    },
  })

  const handleEmailSubmit = async (formData: LoginFormValues) => {
    if (!formData.validVerification) {
      form.setError('validVerification', {
        message: "Please complete the Turnstile verification",
      });
      return;
    }

    await signIn("resend", {
      email: formData.email,
      callbackUrl: '/'
    });
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: '/'
    });
  };

  const handleGithubSignIn = async () => {
    await signIn("github", {
      callbackUrl: '/'
    });
  };

  const handleTurnstileVerify = (isValid: boolean) => {
    setIsTurnstileVerified(isValid);
    form.setValue('validVerification', isValid);
  };

  const handleTurnstileExpired = (expired: boolean) => {
    if(expired) {
      form.setError('validVerification', {
        message: "Verification expired, please try again",
      });
      setIsTurnstileVerified(false);
    } else {
      form.clearErrors('validVerification');
      setIsTurnstileVerified(true);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            <h2 className="text-2xl font-bold mb-2">Welcome to StackedLayer</h2>
          </CardTitle>
          <CardDescription>
            <div className="flex items-center justify-center gap-2">
              Login with your GitHub or Google account
              {inviteOnly && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    You will need an invite code to finish setting up your account
                  </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full" onClick={handleGithubSignIn}>
                <SiGithub className="w-4 h-4 mr-2" />
                Login with GitHub
              </Button>
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <SiGoogle className="w-4 h-4 mr-2" />
                Login with Google
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@stackedlayer.com"
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
                        setValidVerification={handleTurnstileVerify}
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
                  Login with Email
                </Button>
              </form>
            </Form>
          </div>

          <div className="text-balance text-center text-xs text-muted-foreground mt-4">
            By clicking continue, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  )
}