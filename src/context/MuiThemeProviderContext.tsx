import { headers } from "next/headers";
import MuiThemeClient from "./ThemeMuiContext"; // Import your Client Component

export default async function MuiThemeProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();

  const theme = (headersList.get("x-theme") as "light" | "dark") || "light";

  return <MuiThemeClient theme={theme}>{children}</MuiThemeClient>;
}