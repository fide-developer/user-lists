import { FiBriefcase, FiGlobe, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { DetailRow, Section } from "./page";
import Skeleton from "@/app/components/Skeleton";


export default function Loading() {
    return (
        <>
              <header className="space-y-1">
                <Skeleton className="h-9 w-60" />
                <Skeleton className="h-6 w-32" />
              </header>
              <div className="grid gap-6 md:grid-cols-2">
                <Section title="Contact" icon={<FiMail aria-hidden />}>
                  <DetailRow icon={<FiMail aria-hidden />} label="Email">
                    <Skeleton className="h-5 w-36" />
                  </DetailRow>
                  <DetailRow icon={<FiPhone aria-hidden />} label="Phone">
                    <Skeleton className="h-5 w-36" />
                  </DetailRow>
                  <DetailRow icon={<FiGlobe aria-hidden />} label="Website">
                    <Skeleton className="h-5 w-36" />
                  </DetailRow>
                </Section>
        
                <Section title="Address" icon={<FiMapPin aria-hidden />}>
                  <Skeleton className="h-5 w-[90%]" />
                  <Skeleton className="h-5 w-[70%]" />
                </Section>
        
                <Section
                  title="Company"
                  icon={<FiBriefcase aria-hidden />}
                  className="md:col-span-2"
                >
                  <Skeleton className="h-6 w-[50%]" />
                  <Skeleton className="h-5 w-[50%]" />
                  <Skeleton className="h-5 w-[50%]" />
                </Section>
              </div>
            </>
    )
}