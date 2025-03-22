"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
export default function PaymentSuccess({
    searchParams: { amount },
}: {
    searchParams: { amount: string };
}) {
    useEffect(() => {
        setTimeout(() => {
            redirect("/");
        }, 10000);
    }, []);

    return (
        <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-cyan-500 to-dark-500">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold mb-2">Merci de votre passage!</h1>
                <h2 className="text-2xl">Votre paiement a été effectué avec succès</h2>

                <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
                    ${amount}
                </div>
            </div>
        </main>
    );
}
