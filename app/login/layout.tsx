import QueryProvider from "@/components/providers/QueryProvider";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
