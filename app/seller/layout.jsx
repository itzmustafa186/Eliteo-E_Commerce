import SellerNavbar from "@/components/seller/Navbar";
import SellerFooter from "@/components/seller/Footer";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {

  const { userId } = await auth();

    // Not logged in
    if (!userId) {
        redirect("/");
    }

    const user = await currentUser();

    // Not a seller
    if (user?.publicMetadata?.role !== "seller") {
        redirect("/");
    }

  
  return (
    <div className="min-h-screen bg-gray-50">
      <SellerNavbar />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-[calc(100vh-4rem)] mt-14">
        {children}
      </main>

      <SellerFooter />
    </div>
  );
}