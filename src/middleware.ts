import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getSession } from "./lib/auth";

// Rotas que não precisam de autenticação
const publicRoutes = [
  "/",
  "/Entrar",
  "/Cadastro",
  "/api/login",
  "/api/cadastro",
];

// Rotas que precisam de role admin
const adminRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se a rota é pública
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verificar se o usuário está autenticado
  const session = await getSession();

  if (!session) {
    // Redirecionar para a página de login se não estiver autenticado
    const url = new URL("/Entrar", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Verificar se a rota requer role admin
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (session.role !== "admin") {
      // Redirecionar para a página inicial se não for admin
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configurar quais rotas o middleware deve interceptar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
