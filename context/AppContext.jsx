'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = "Rs."
    const router = useRouter()
    const { user } = useUser();
    const { getToken } = useAuth();
    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            if (user.publicMetadata.role === "seller") {
                setIsSeller(true)
            }
            const token = await getToken();

            const { data } = await axios.get("/api/user/data", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("User Data:", data.user);
            console.log("Cart:", data.user.CartItems);

            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems || {});
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addToCart = async (itemId) => {
        const product = products.find((p) => p._id === itemId);

        if (!product) {
            return toast.error("Product not found");
        }

        const currentQty = cartItems[itemId] || 0;

        if (product.stock <= 0) {
            return toast.error("This product is out of stock");
        }

        if (currentQty >= product.stock) {
            return toast.error(`Only ${product.stock} item(s) available`);
        }

        const cartData = structuredClone(cartItems || {});
        cartData[itemId] = currentQty + 1;

        setCartItems(cartData);

        if (!user) {
            localStorage.setItem("guestCart", JSON.stringify(cartData));
            toast.success("Item added to cart");
            return;
        }

        try {
            const token = await getToken();

            await axios.post(
                "/api/cart/update",
                { cartData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Item added");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };
    const updateCartQuantity = async (itemId, quantity) => {
        const product = products.find((p) => p._id === itemId);

        if (!product) return;

        if (quantity > product.stock) {
            return toast.error(`Only ${product.stock} item(s) available`);
        }

        const cartData = structuredClone(cartItems || {});

        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);

        if (!user) {
            localStorage.setItem("guestCart", JSON.stringify(cartData));
            return;
        }

        try {
            const token = await getToken();

            await axios.post(
                "/api/cart/update",
                { cartData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        console.log("Products:", products);
        console.log("Cart:", cartItems);

        for (const itemId in (cartItems || {})) {
            const itemInfo = products.find((product) => product._id === itemId);

            console.log(itemId, itemInfo);

            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[itemId];
            }
        }

        console.log("Total:", totalAmount);

        return totalAmount;
    };


    useEffect(() => {
        if (user) {
            fetchUserData()
        }
    }, [user])
    useEffect(() => {
        if (!user) {
            const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
            setCartItems(guestCart);
        }
    }, [user]);

    useEffect(() => {
        fetchProductData()
    }, [])
    const value = {
        user,
        getToken,

        currency,
        router,

        products,
        fetchProductData,

        isSeller,
        setIsSeller,

        userData,
        fetchUserData,

        cartItems,
        setCartItems,

        addToCart,
        updateCartQuantity,

        getCartCount,
        getCartAmount,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}