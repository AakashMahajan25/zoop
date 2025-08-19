import RepairMediaUpload from "@/components/RepairMediaUpload";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function page(){
    return(
        <ProtectedRoute>
            <RepairMediaUpload />
        </ProtectedRoute>
    )
}