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

export const AppContext = createContext(null);

export const useAppContext = () => {
    return useContext(AppContext);
};

const getInitialGuestCart = () => {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        const savedCart =
            localStorage.getItem("guestCart");

        return savedCart
            ? JSON.parse(savedCart)
            : {};
    } catch (error) {
        console.error(
            "GUEST CART ERROR:",
            error
        );

        return {};
    }
};

export const AppContextProvider = ({
    children,
}) => {
    const router = useRouter();

    const { user, isLoaded: userLoaded } =
        useUser();

    const { getToken, isLoaded: authLoaded } =
        useAuth();

    const [products, setProducts] = useState([]);

    const [userData, setUserData] =
        useState(false);

    const [isSeller, setIsSeller] =
        useState(false);

    const [cartItems, setCartItems] =
        useState(getInitialGuestCart);

    /*
    |--------------------------------------------------------------------------
    | CURRENCY
    |--------------------------------------------------------------------------
    */

    const currency = "Rs.";

    /*
    |--------------------------------------------------------------------------
    | FETCH PRODUCTS
    |--------------------------------------------------------------------------
    */

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get(
                "/api/product/list"
            );

            if (data?.success) {
                setProducts(
                    data.products || []
                );
            }
        } catch (error) {
            console.error(
                "FETCH PRODUCT ERROR:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | FETCH USER DATA
    |--------------------------------------------------------------------------
    */

    const fetchUserData = async () => {
        try {
            if (!user) {
                setUserData(false);
                setIsSeller(false);

                return;
            }

            if (
                typeof getToken !==
                "function"
            ) {
                console.error(
                    "Clerk getToken is not available"
                );

                return;
            }

            const token =
                await getToken();

            if (!token) {
                setUserData(false);
                setIsSeller(false);

                return;
            }

            const { data } =
                await axios.get(
                    "/api/user/data",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (data?.success) {
                setUserData(
                    data.user || false
                );

                setCartItems(
                    data.user
                        ?.cartItems || {}
                );

                setIsSeller(
                    user?.publicMetadata
                        ?.role === "seller"
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

    /*
    |--------------------------------------------------------------------------
    | ADD TO CART
    |--------------------------------------------------------------------------
    */

    const addToCart = async (
        itemId
    ) => {
        try {
            if (!itemId) {
                return;
            }

            /*
            | GUEST USER
            */

            if (!user) {
                setCartItems(
                    (previousCart) => {
                        const updatedCart = {
                            ...previousCart,
                            [itemId]:
                                Number(
                                    previousCart[
                                        itemId
                                    ] || 0
                                ) + 1,
                        };

                        try {
                            localStorage.setItem(
                                "guestCart",
                                JSON.stringify(
                                    updatedCart
                                )
                            );
                        } catch (
                            storageError
                        ) {
                            console.error(
                                "LOCAL STORAGE ERROR:",
                                storageError
                            );
                        }

                        return updatedCart;
                    }
                );

                toast.success(
                    "Added to cart"
                );

                return;
            }

            /*
            | LOGGED-IN USER
            */

            if (
                typeof getToken !==
                "function"
            ) {
                toast.error(
                    "Authentication is not ready"
                );

                return;
            }

            const token =
                await getToken();

            if (!token) {
                toast.error(
                    "Please login first"
                );

                return;
            }

            const currentQuantity =
                Number(
                    cartItems[itemId] || 0
                );

            const { data } =
                await axios.post(
                    "/api/cart/update",
                    {
                        itemId,
                        quantity:
                            currentQuantity +
                            1,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (data?.success) {
                setCartItems(
                    data.cartItems || {}
                );

                toast.success(
                    "Added to cart"
                );
            }
        } catch (error) {
            console.error(
                "ADD CART ERROR:",
                error
            );

            toast.error(
                "Something went wrong"
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | UPDATE CART QUANTITY
    |--------------------------------------------------------------------------
    */

    const updateCartQuantity = async (
        itemId,
        quantity
    ) => {
        try {
            if (!itemId) {
                return;
            }

            /*
            | GUEST USER
            */

            if (!user) {
                setCartItems(
                    (previousCart) => {
                        const updatedCart = {
                            ...previousCart,
                        };

                        if (
                            quantity <= 0
                        ) {
                            delete updatedCart[
                                itemId
                            ];
                        } else {
                            updatedCart[
                                itemId
                            ] = quantity;
                        }

                        try {
                            localStorage.setItem(
                                "guestCart",
                                JSON.stringify(
                                    updatedCart
                                )
                            );
                        } catch (
                            storageError
                        ) {
                            console.error(
                                "LOCAL STORAGE ERROR:",
                                storageError
                            );
                        }

                        return updatedCart;
                    }
                );

                return;
            }

            /*
            | LOGGED-IN USER
            */

            if (
                typeof getToken !==
                "function"
            ) {
                return;
            }

            const token =
                await getToken();

            if (!token) {
                return;
            }

            const { data } =
                await axios.post(
                    "/api/cart/update",
                    {
                        itemId,
                        quantity,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (data?.success) {
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

    /*
    |--------------------------------------------------------------------------
    | CART COUNT
    |--------------------------------------------------------------------------
    */

    const getCartCount = () => {
        return Object.values(
            cartItems || {}
        ).reduce(
            (total, quantity) =>
                total +
                Number(quantity || 0),
            0
        );
    };

    /*
    |--------------------------------------------------------------------------
    | CART AMOUNT
    |--------------------------------------------------------------------------
    */

    const getCartAmount = () => {
        return Object.entries(
            cartItems || {}
        ).reduce(
            (
                total,
                [itemId, quantity]
            ) => {
                const product =
                    products.find(
                        (item) =>
                            item._id ===
                            itemId
                    );

                if (!product) {
                    return total;
                }

                const productPrice =
                    Number(
                        product.offerPrice ||
                            product.price ||
                            0
                    );

                return (
                    total +
                    productPrice *
                        Number(
                            quantity || 0
                        )
                );
            },
            0
        );
    };

    /*
    |--------------------------------------------------------------------------
    | LOAD PRODUCTS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchProductData();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | LOAD USER
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!userLoaded || !authLoaded) {
            return;
        }

        fetchUserData();
    }, [
        user,
        userLoaded,
        authLoaded,
    ]);

    /*
    |--------------------------------------------------------------------------
    | CONTEXT VALUE
    |--------------------------------------------------------------------------
    */

    const value = {
        currency,

        router,

        user,

        getToken,

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