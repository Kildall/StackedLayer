import { useEffect, useState, type FC } from "react";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { secretSubmissionFormSchema, type SecretSubmissionFormValues } from "@/schemas/islands/forms/secret-submission-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "hooks/use-toast";


interface SecretSubmissionFormProps {
  onSubmit: (values: SecretSubmissionFormValues) => Promise<void>;
  maxSecretLength: number;
}


export const SecretSubmissionForm: FC<SecretSubmissionFormProps> = ({ onSubmit, maxSecretLength }) => {
  const [isErrorButton, setIsErrorButton] = useState(false);
  const { toast } = useToast();
  const form = useForm<SecretSubmissionFormValues>({
    resolver: zodResolver(secretSubmissionFormSchema),
    defaultValues: {
      secret: "",
    }
  });

  const remainingChars = maxSecretLength - form.watch("secret").length;

  const handleSubmit = async (values: SecretSubmissionFormValues) => {
    try {
      await onSubmit(values);
      toast({
        title: "Secret saved successfully",
        description: "Your secret has been saved and is ready to share.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error saving secret",
        description: "There was an error saving your secret. Please try again.",
        variant: "destructive",
      });
      setIsErrorButton(true);
      setTimeout(() => {
        setIsErrorButton(false);
      }, 1500);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="secret"
            render={({ field }) => (
              <div className="relative">

                <Textarea
                  placeholder="Type your secret message here..."
                  className="min-h-[150px] max-h-[250px]"
                  maxLength={maxSecretLength}
                  {...field}
                />
                {
                  form.formState.errors.secret ? (
                    <FormMessage className="text-sm mt-1 text-destructive font-normal" />
                  ) : (
                    <div
                      className={`text-sm mt-1 text-right ${remainingChars < 100 ? 'text-destructive' : 'text-muted-foreground'}`}
                    >
                      {remainingChars} characters remaining
                    </div>
                  )
                }
              </div>
            )}
          />

          <Button
            type="submit"
            className="w-full transition-all duration-300"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {
              isErrorButton ? (
                <div className="flex items-center gap-2 text-destructive">
                  <X className="h-4 w-4" />
                  Failed to save
                </div>
              ) : (
                form.formState.isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Save Secret"
                )
              )
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};