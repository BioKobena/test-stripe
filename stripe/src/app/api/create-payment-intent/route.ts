import { NextRequest, NextResponse } from "next/server";
const Stripe = require("stripe");
const stripe = Stripe(
    "sk_test_51R4sTpB2GOJonx3K4imsYow1sNG7Lw2ZFiORUNhknF9OtmThbKbAa4mFgwU6gRaEnaUQBVtVcNoHncmNYD7VcpGJ00mPqvSXiR",
);

export async function POST(request: NextRequest) {
    try {
        const { amount } = await request.json();
        console.log(amount);

        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: amount,
        //     currency: "usd",
        //     automatic_payment_methods: { enable: true },
        // });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.log("Something went wrong");
        return NextResponse.json({ error: `Une erreur est survenue${error}` }, {
            status: 500,
        });
    }
}

export async function GET(request: NextRequest) {
    try {
        // const { amount } = await request.json();
        // console.log(amount);

        const paymentIntents = await stripe.paymentIntents.list({
            limit: 100, // Limite le nombre d'intentions de paiement retournées
        });

        // console.log(paymentIntents);

        return NextResponse.json(paymentIntents);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des intentions de paiement:",
            error,
        );
        return NextResponse.json(
            { error: `Une erreur est survenue: ${error}` },
            {
                status: 500,
            },
        );
    }
}
