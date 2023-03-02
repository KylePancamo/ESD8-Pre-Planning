export function hasPermissions(userPermissions: number , permissions: number) {
    return (userPermissions & permissions) == permissions;
}