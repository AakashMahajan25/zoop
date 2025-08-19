import ClaimsDetails from "@/components/ClaimsDetails";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function page(){
    return(
        <ProtectedRoute>
            <>
            {/* <ClaimsDetails /> */}
            </>
        </ProtectedRoute>
    )
}