
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FavoriteRoomList from "@/components/favorite-room/FavoriteRoomList"

export default function FavoritesPage() {
    return (
        <ProtectedRoute allowedRoles={["Customer"]}>
            <FavoriteRoomList />
        </ProtectedRoute>
    );
}
