export function hasPermissions(userPermissions: number | undefined , permissions: number) {
    if (userPermissions === undefined) {
        return false;
    }
    return (userPermissions & permissions) == permissions;
}