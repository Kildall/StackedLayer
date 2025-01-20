import NextAuth, { Awaitable, NextAuthOptions, RequestInternal, User } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/db/prisma"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      authorize: function (_credentials: Record<"username" | "password", string>, _req: Pick<RequestInternal, "body" | "query" | "headers" | "method">): Awaitable<User | null> {
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        return user
      }
    })
  ],
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)