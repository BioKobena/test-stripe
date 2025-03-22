import { NextRequest, NextResponse } from "next/server";
const Stripe = require("stripe");
const stripe = Stripe(
process.env.STRIPE_SECRET_KEY
);

export async function POST(request: NextRequest) {
    try {
        const { amount } = await request.json();
        console.log(amount);


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

//  Cette méthode permet de récupérer tous les paiements depuis stripe
export async function GET(request: NextRequest) {
    try {


        const paymentIntents = await stripe.paymentIntents.list();


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
