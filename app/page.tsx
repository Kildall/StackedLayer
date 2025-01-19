

import { Landing } from "@/components/views/Landing";
import { env } from "@/lib/env";

export default function Home() {
  const { FILE_MAX_FILE_SIZE_MB, SECRET_MAX_LENGTH } = env;
  return <Landing maxFileSizeMB={FILE_MAX_FILE_SIZE_MB} maxSecretLength={SECRET_MAX_LENGTH} />;
}
