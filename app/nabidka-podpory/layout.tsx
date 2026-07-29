import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function SupportOfferLayout({ children }: { children: React.ReactNode }) { return <><Header /><main className="flex-1">{children}</main><Footer /></>; }
