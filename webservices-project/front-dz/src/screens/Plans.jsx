import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import useAuth from "@/lib/hooks/useAuth";
import env from "@/config/env";
import axios from "axios";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { plansList } from "./../lib/mocks/plans";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const Plans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [newActivePlan, setNewActivePlan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    setPlans(plansList);
    axios.get(env.crud + "/user?email=" + user).then((data) => {
      const userInfo = data.data.data[0];
      setActivePlan(userInfo.subscriptionPlan);
    });
  }, [user]);

  async function handlePaymentSubmit(event) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        email: user,
      },
    });

    if (error) {
      console.log("[error]", error);
    } else {
      try {
        const _newActivePlan = newActivePlan.id;
        await axios.post(env.stripeMS + "/create-subscription", {
          paymentMethodId: paymentMethod.id,
          email: user,
          plan: _newActivePlan,
        });
        setShowPaymentForm(false);
        setActivePlan(_newActivePlan);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleCancelPlan() {
    try {
      await axios.post(env.stripeMS + "/cancel-subscription", {
        email: user,
      });
      setActivePlan("plan_free");
    } catch (error) {
      console.log(error);
    }
  }

  console.log(activePlan);

  return (
    <Layout>
      <section>
        <div className="hero lg:pt-18 pt-12">
          <div className="hero-content text-center">
            <div className="flex flex-col gap-2 w-80">
              <h1 className="text-4xl lg:text-5xl font-bold">Plans</h1>
              <div className="">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={
                      plan.id === activePlan ? "plan-card currPlanCard" : "plan-card"
                    }
                  >
                    <h2 className="plan-title">{plan.label}</h2>
                    <p className="plan-description">{plan.description}</p>
                    <h1 className="text-4xl font-bold text-secondary mb-6">
                      {plan.price}€
                    </h1>
                    {plan.id === activePlan ? (
                      <div style={{ flexDirection: "column", display: "flex" }}>
                        <strong className="current-plan">Current Plan</strong>
                        {activePlan !== "plan_free" && (
                          <button
                            className="cancel-plan-button"
                            onClick={handleCancelPlan}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        className="subscribe-button"
                        onClick={() => {
                          setNewActivePlan(plan);
                          setShowPaymentForm(true);
                        }}
                      >
                        Subscribe
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {showPaymentForm && (
                <>
                  <hr />
                  <h1 className="plan-title mt-2">
                    Subscribing to the{" "}
                    <b className="text-accent">{newActivePlan.label}</b> plan
                  </h1>
                  <form onSubmit={handlePaymentSubmit} className="payment-form">
                    <CardElement />
                    <button type="submit" className="payment-button" disabled={!stripe}>
                      Pay and Subscribe
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const PlansWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <Plans />
    </Elements>
  );
};

export default PlansWrapper;
