import { UserRoles } from "@/next-auth.d";

type Role = UserRoles;
type Permission = (typeof ROLES)[keyof typeof ROLES][number];

const ROLES = {
  [UserRoles.ROLE_ADMIN]: [
    "create:user", "create:member",'create:department'
  ],
  [UserRoles.ROLE_MANAGER]: ["create:teammember", "create:workplan", 'update:report','view:members', 'create:workplan'],
    [UserRoles.ROLE_SENIORMANAGER]: [ 'create:sections', 'view:sections','view:department', 'division:reports'],
  [UserRoles.ROLE_USER]: ["view:comments",],
  [UserRoles.ROLE_SUPERADMIN]: [
    "create:user", "create:member", 'update:report','create:department','view:department'
  ],
} as const;

export function hasPermission(roles: Role[], permission: Permission) {
    return roles.some((role) =>
        (ROLES[role as keyof typeof ROLES] as readonly Permission[]).includes(permission)
      );
}
