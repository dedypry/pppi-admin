import { CheckCircle, CircleXIcon } from "lucide-react"

export default function ToggleCheck({isActive}:{isActive:boolean}){

    if(isActive) return <CheckCircle size={20} className="text-success" />

    return <CircleXIcon size={20} className="text-danger" />
}
