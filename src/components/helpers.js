export function hasPermissions(userPermissions, permissions) {
    return (userPermissions & permissions) == permissions;
}