import { FiBriefcase, FiGlobe, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { DetailRow, Section } from "./page";
import Skeleton from "@/app/components/Skeleton";


export default function Loading() {
    return (
        <div className="flex w-full items-center justify-center">
          Opps... User not found!
        </div>
    )
}