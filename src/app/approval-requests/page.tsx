import AdminClaimsSection from "@/components/adminSection/AdminClaimsSection";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function page(){
    return(
        <ProtectedRoute requiredRole={1}> {/* 1 = admin role */}
            <div>
                <AdminClaimsSection />
            </div>
        </ProtectedRoute>
    )
}