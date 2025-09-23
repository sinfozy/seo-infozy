import VerifyEmailPage from "@/components/pages/VerifyEmailPage";

export default async function Page({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = (await searchParams).email ?? null;
  return <VerifyEmailPage email={email} />;
}
