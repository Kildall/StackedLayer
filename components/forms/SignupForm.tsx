import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TooltipContent, Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { InfoIcon } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  })
}).refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });


export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to StackedLayer</CardTitle>
          <CardDescription>
            Sign up with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full">
                <SiGithub />
                Sign up with GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <SiGoogle />
                Sign up with Google
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email">
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center gap-2 group hover:cursor-pointer">
                                    <span>Email</span>
                                    <InfoIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="m-2 z-10">
                                  <div className="bg-primary text-xs font-normal p-2 text-background rounded-md">
                                    Your email will be used to sign in to your account.
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@stackedlayer.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-400 font-normal" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password">
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center gap-2 group hover:cursor-pointer">
                                    <span>Password</span>
                                    <InfoIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="m-2 z-10">
                                  <div className="bg-primary text-xs font-normal p-2 text-background rounded-md">
                                    Your password must be at least 8 characters long.
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input id="password" type="password" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs text-red-400 font-normal" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
                          <FormControl>
                            <Input id="confirm-password" type="password" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs text-red-400 font-normal" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign up
                  </Button>
                </div>
                <div className="text-center text-sm mt-2">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </Form>
          </div>
          <div className="text-balance text-center text-xs text-muted-foreground mt-4">
            By clicking continue, you agree to our <Link href="/terms" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link>{" "}
            and <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
