import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PermissionsProviderWrapper } from "@/components/auth/permissions-provider-wrapper";
import { AppSidebar } from "@/components/layout/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { userContextSchema, type UserContextData } from "@/lib/validations/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Verificação profunda de integridade da sessão no banco de dados
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Extração e validação do cookie de contexto (user_context) codificado em Base64
  const cookieStore = await cookies();
  const contextCookie = cookieStore.get("user_context")?.value;

  let initialContext: UserContextData | null = null;

  if (contextCookie) {
    try {
      const decodedJson = Buffer.from(contextCookie, "base64").toString("utf-8");
      const parsed = JSON.parse(decodedJson);
      const validation = userContextSchema.safeParse(parsed);
      if (validation.success) {
        initialContext = validation.data;
      }
    } catch {
      // Falha ao parsear cookie - fallback construído a partir dos dados do banco
    }
  }

  // 3. Fallback: Constrói o contexto inicial diretamente da entidade segura do banco
  if (!initialContext) {
    initialContext = {
      id: user.id,
      name: user.name,
      email: user.email,
      tenantId: user.tenantId,
      tenantName: user.tenant.name,
      accessGroup: user.accessGroup?.name ?? null,
      permissions: (user.accessGroup?.permissions as Record<string, string[]>) ?? {},
    };
  }

  return (
    <PermissionsProviderWrapper initialContext={initialContext}>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col pb-24 md:pb-6">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {children}
              </div>
            </div>
          </div>
          <BottomNavigation />
        </SidebarInset>
      </SidebarProvider>
    </PermissionsProviderWrapper>
  );
}
