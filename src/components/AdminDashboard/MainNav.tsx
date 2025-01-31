import Link from "next/link";
import { currentRole } from "@/lib/auth";
import { UserRoles } from "@/next-auth.d";
import { cn } from "@/lib/utils";

export async function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const role = await currentRole();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="#"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      {role === UserRoles.ROLE_ADMIN && (
        <>
          <Link
            href="?view=customers"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Customers
          </Link>
          <Link
            href="?view=staff"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Staff
          </Link>
          <Link
            href="?view=settings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Settings
          </Link>
        </>
      )}
    </nav>
  );
}
