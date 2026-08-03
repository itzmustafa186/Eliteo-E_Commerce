import connectDB from "@/config/db";
import Product from "@/models/product";
import CartClient from "@/components/CartClient";

export const revalidate = 60;

export default async function CartPage() {
  await connectDB();

  const products = await Product.find({}).lean();

  return (
    <CartClient
      products={JSON.parse(JSON.stringify(products))}
    />
  );
}