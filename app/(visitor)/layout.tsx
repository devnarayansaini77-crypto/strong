import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function VisitorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
