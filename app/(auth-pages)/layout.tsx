export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-7xl flex flex-col gap-12 items-start -translate-y-8">{children}</div>
      </div>
  );
}
