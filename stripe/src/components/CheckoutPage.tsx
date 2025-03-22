"use client";

import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const CheckoutPage = ({ amount }: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<String>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [succeeded, setSucceeded] = useState(false);

    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) }), // Assurez-vous que 'amount' est correctement défini
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("HTTP error: " + response.status);
                }
                return response.json();
            })
            .then((data) => setClientSecret(data.clientSecret))
            .catch((error) => console.error("Erreur:", error));
        console.log(clientSecret);
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        if (!stripe || !elements) {
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const { error } = await stripe?.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url:
                    `http://localhost:3000/payment-success?amount=${amount}`,
            },
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
        }

        setLoading(false);
    };

    if (!stripe || !elements || !clientSecret) {
        return (
            <div className="flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full
                border-current border-e-transparent 
                align-[-0.125em] text-surface
                motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white

                ">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden
                    !whitespace-nowrap !border-0 !p-0 ![clip:rect(0, 0, 0, 0)] 
                    ">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-2 rounded-md"
        >

            {errorMessage && (
                <div className="text-cyan-700 font-bold">{errorMessage}</div>
            )}
            {clientSecret && <PaymentElement />}
            <button
                disabled={!stripe || loading}
                className="text-white cursor-pointer w-full p-5 center bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
            >
                {!loading ? ` Pay $${amount}` : "Processing..."}
            </button>
        </form>
    );
};

export default CheckoutPage;
