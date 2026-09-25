"use client";

import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const currency = "Rs.";

    const router = useRouter();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [cartItems, setCartItems] = useState({});

    /* =========================================================
       FETCH PRODUCTS
    ========================================================= */

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get("/api/product/list");

            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error("FETCH PRODUCT ERROR:", error);
        }
    };

    /* =========================================================
       FETCH USER DATA
    ========================================================= */

    const fetchUserData = async () => {
        try {
            if (!user) {
                setUserData(false);
                setIsSeller(false);
                return;
            }

            const role = user?.publicMetadata?.role;

            setIsSeller(role === "seller");

            const token = await getToken();

            if (!token) {
                setUserData(false);
                return;
            }

            const { data } = await axios.get("/api/user/data", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems || {});
            }
        } catch (error) {
            console.error("FETCH USER DATA ERROR:", error);
        }
    };

    /* =========================================================
       ADD TO CART
    ========================================================= */

    const addToCart = async (itemId) => {
        try {
            if (!user) {
                const updatedCart = {
                    ...cartItems,
                    [itemId]: (cartItems[itemId] || 0) + 1,
                };

                setCartItems(updatedCart);

                localStorage.setItem(
                    "guestCart",
                    JSON.stringify(updatedCart)
                );

                toast.success("Added to cart");
                return;
            }

            const token = await getToken();

            const { data } = await axios.post(
                "/api/cart/update",
                {
                    itemId,
                    quantity: (cartItems[itemId] || 0) + 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                setCartItems(data.cartItems);
                toast.success("Added to cart");
            }
        } catch (error) {
            console.error("ADD CART ERROR:", error);
            toast.error("Something went wrong");
        }
    };

    /* =========================================================
       UPDATE CART
    ========================================================= */

    const updateCartQuantity = async (itemId, quantity) => {
        try {
            if (!user) {
                const updatedCart = {
                    ...cartItems,
                    [itemId]: quantity,
                };

                if (quantity <= 0) {
                    delete updatedCart[itemId];
                }

                setCartItems(updatedCart);

                localStorage.setItem(
                    "guestCart",
                    JSON.stringify(updatedCart)
                );

                return;
            }

            const token = await getToken();

            const { data } = await axios.post(
                "/api/cart/update",
                {
                    itemId,
                    quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                setCartItems(data.cartItems);
            }
        } catch (error) {
            console.error("UPDATE CART ERROR:", error);
        }
    };

    /* =========================================================
       CART COUNT
    ========================================================= */

    const getCartCount = () => {
        return Object.values(cartItems).reduce(
            (total, quantity) => total + Number(quantity || 0),
            0
        );
    };

    /* =========================================================
       CART AMOUNT
    ========================================================= */

    const getCartAmount = () => {
        return Object.entries(cartItems).reduce(
            (total, [itemId, quantity]) => {
                const product = products.find(
                    (product) => product._id === itemId
                );

                if (!product) return total;

                return (
                    total +
                    Number(product.offerPrice || product.price || 0) *
                        Number(quantity || 0)
                );
            },
            0
        );
    };

    /* =========================================================
       USER EFFECT
    ========================================================= */

    useEffect(() => {
        if (user) {
            fetchUserData();
        } else {
            setUserData(false);
            setIsSeller(false);
        }
    }, [user]);

    /* =========================================================
       GUEST CART
    ========================================================= */

    useEffect(() => {
        if (!user) {
            try {
                const guestCart = JSON.parse(
                    localStorage.getItem("guestCart") || "{}"
                );

                setCartItems(guestCart);
            } catch (error) {
                console.error("GUEST CART ERROR:", error);
                setCartItems({});
            }
        }
    }, [user]);

    /* =========================================================
       PRODUCTS
    ========================================================= */

    useEffect(() => {
        fetchProductData();
    }, []);

    /* =========================================================
       CONTEXT VALUE
    ========================================================= */

    const value = {
        currency,
        router,
        user,
        products,
        setProducts,
        userData,
        setUserData,
        isSeller,
        setIsSeller,
        cartItems,
        setCartItems,
        addToCart,
        updateCartQuantity,
        getCartCount,
        getCartAmount,
        fetchProductData,
        fetchUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;