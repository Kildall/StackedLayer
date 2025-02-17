import { useState, type FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { User } from "@/db/schema";
import { createAndUploadSecret } from "@/islands/secrets/CreateSecret";
import { SecretSubmissionForm } from "@/islands/forms/SecretSubmissionForm";
import type { SecretSubmissionFormValues } from "@/schemas/islands/forms/secret-submission-form";
import type { SecretURL } from "@/types/islands/secrets/secrets";
import { SecretSuccess } from "@/islands/landing/SecretSuccess";

enum SecretInputState {
  Input = "input",
  Success = "success",
  Fail = "fail",
}

interface SecretInputProps {
  onBack: () => void;
  maxSecretLength: number;
  user?: User;
}

export const SecretInputIsland: FC<SecretInputProps> = ({ onBack, maxSecretLength }) => {
  const [state, setState] = useState<SecretInputState>(SecretInputState.Input);
  const [secretURL, setSecretURL] = useState<SecretURL | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  const handleSubmit = async (values: SecretSubmissionFormValues) => {
    if (!values.secret.trim()) return;
    const secretBytes = new TextEncoder().encode(values.secret);
    const { id, key, expiresAt } = await createAndUploadSecret(secretBytes, "text");
    setState(SecretInputState.Success);
    setExpiryDate(expiresAt.toISOString());
    setSecretURL({ id, key });
  };


  return (
    <Card className="p-6 min-h-[250px] flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Type Secret</h1>
      </div>

      <div className="flex-1">
        {state === SecretInputState.Input && (
          <SecretSubmissionForm onSubmit={handleSubmit} maxSecretLength={maxSecretLength} />
        )}
        {state === SecretInputState.Success && secretURL && (
          <SecretSuccess secretURL={secretURL} expiryDate={expiryDate ?? ""} type="text"  />
        )}
      </div>
    </Card>
  );
};