import RegisterClaims from "@/components/intimationSection/RegisterClaims";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function page(){
    return(
        <ProtectedRoute>
            <RegisterClaims />
        </ProtectedRoute>
    )
}