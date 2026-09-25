"use client";

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

const getInitialGuestCart = () => {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        return JSON.parse(
            localStorage.getItem("guestCart") || "{}"
        );
    } catch {
        return {};
    }
};

export const AppContextProvider = ({ children }) => {
    const currency = "Rs.";

    const router = useRouter();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isSeller, setIsSeller] = useState(false);

    // Load guest cart during initial state creation.
    // This avoids calling setState synchronously inside an effect.
    const [cartItems, setCartItems] = useState(
        getInitialGuestCart
    );

    /* =========================================================
       FETCH PRODUCTS
    ========================================================= */

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get(
                "/api/product/list"
            );

            if (data.success) {
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error(
                "FETCH PRODUCT ERROR:",
                error
            );
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

            const token = await getToken();

            if (!token) {
                setUserData(false);
                setIsSeller(false);
                return;
            }

            const { data } = await axios.get(
                "/api/user/data",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                setUserData(data.user);

                setCartItems(
                    data.user?.cartItems || {}
                );

                setIsSeller(
                    user?.publicMetadata?.role ===
                        "seller"
                );
            } else {
                setUserData(false);
                setIsSeller(false);
            }
        } catch (error) {
            console.error(
                "FETCH USER DATA ERROR:",
                error
            );

            setUserData(false);
            setIsSeller(false);
        }
    };

    /* =========================================================
       ADD TO CART
    ========================================================= */

    const addToCart = async (itemId) => {
        try {
            if (!user) {
                setCartItems((previousCart) => {
                    const updatedCart = {
                        ...previousCart,
                        [itemId]:
                            (previousCart[itemId] || 0) + 1,
                    };

                    localStorage.setItem(
                        "guestCart",
                        JSON.stringify(updatedCart)
                    );

                    return updatedCart;
                });

                toast.success("Added to cart");
                return;
            }

            const token = await getToken();

            if (!token) {
                toast.error("Please login first");
                return;
            }

            const { data } = await axios.post(
                "/api/cart/update",
                {
                    itemId,
                    quantity:
                        (cartItems[itemId] || 0) + 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                setCartItems(data.cartItems || {});
                toast.success("Added to cart");
            }
        } catch (error) {
            console.error(
                "ADD CART ERROR:",
                error
            );

            toast.error("Something went wrong");
        }
    };

    /* =========================================================
       UPDATE CART
    ========================================================= */

    const updateCartQuantity = async (
        itemId,
        quantity
    ) => {
        try {
            if (!user) {
                setCartItems((previousCart) => {
                    const updatedCart = {
                        ...previousCart,
                        [itemId]: quantity,
                    };

                    if (quantity <= 0) {
                        delete updatedCart[itemId];
                    }

                    localStorage.setItem(
                        "guestCart",
                        JSON.stringify(updatedCart)
                    );

                    return updatedCart;
                });

                return;
            }

            const token = await getToken();

            if (!token) {
                return;
            }

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
                setCartItems(
                    data.cartItems || {}
                );
            }
        } catch (error) {
            console.error(
                "UPDATE CART ERROR:",
                error
            );
        }
    };

    /* =========================================================
       CART COUNT
    ========================================================= */

    const getCartCount = () => {
        return Object.values(cartItems).reduce(
            (total, quantity) =>
                total + Number(quantity || 0),
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
                    (product) =>
                        product._id === itemId
                );

                if (!product) {
                    return total;
                }

                return (
                    total +
                    Number(
                        product.offerPrice ||
                            product.price ||
                            0
                    ) *
                        Number(quantity || 0)
                );
            },
            0
        );
    };

    /* =========================================================
       USER
    ========================================================= */

    useEffect(() => {
        fetchUserData();
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