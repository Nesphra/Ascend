import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Define publicly accessible routes
    const publicRoutes = ["/sign-in", "/sign-up", "/"];

    // If it's not a public route and user is not authenticated
    if (!publicRoutes.includes(pathname) && error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // // Redirect signed-in user from homepage to dashboard
    // if (pathname === "/" && user) {
    //   return NextResponse.redirect(new URL("/dashboard", request.url));
    // }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
