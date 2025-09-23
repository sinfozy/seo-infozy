import ResetPasswordPage from "@/components/pages/ResetPasswordPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <ResetPasswordPage
      email={resolvedSearchParams.email}
      token={resolvedSearchParams.token}
    />
  );
}
