import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email === process.env.ADMIN_EMAIL) return true;

      try {
        const res = await fetch(
          `${process.env.API_URL}/adminUsers/check?email=${encodeURIComponent(user.email)}`,
          { cache: 'no-store' },
        );
        if (!res.ok) return false;
        const { allowed } = await res.json();
        return allowed;
      } catch {
        return false;
      }
    },
  },
});
