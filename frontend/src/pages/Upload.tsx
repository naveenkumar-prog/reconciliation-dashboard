import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Upload() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [orders, setOrders] =
    useState<File | null>(null);

  const [payments, setPayments] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [step, setStep] =
    useState("");

  const uploadFiles = async () => {
    if (!orders || !payments) {
      setError(
        "Please select both CSV files."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      setStep("Uploading Orders CSV...");

      const orderForm =
        new FormData();

      orderForm.append(
        "file",
        orders
      );

      await api.post(
        "/upload/orders",
        orderForm
      );

      setStep(
        "Uploading Payments CSV..."
      );

      const paymentForm =
        new FormData();

      paymentForm.append(
        "file",
        payments
      );

      await api.post(
        "/upload/payments",
        paymentForm
      );

      setStep(
        "Running Reconciliation Engine..."
      );

      await api.post(
        "/reconciliation/run"
      );

      setStep(
        "Preparing Dashboard..."
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-blue-50
      via-white
      to-indigo-100
      flex
      items-center
      justify-center
      px-4
      "
    >
      <div
        className="
        bg-white
        w-full
        max-w-2xl
        rounded-3xl
        shadow-xl
        border
        p-10
        "
      >
        {/* Header */}

        <div className="flex justify-end mb-4">
          <button
            onClick={logout}
            className="
            bg-red-500
            hover:bg-red-600
            text-white
            px-4
            py-2
            rounded-lg
            transition
            "
          >
            Logout
          </button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Upload Datasets
          </h1>

          <p className="text-slate-500 mt-2">
            Upload Orders and Payments
            CSV files to begin
            reconciliation.
          </p>
        </div>

        {/* Loading Status */}

        {loading && (
          <div
            className="
            bg-blue-50
            border
            border-blue-200
            rounded-xl
            p-4
            mb-6
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                w-5 h-5
                border-2
                border-blue-600
                border-t-transparent
                rounded-full
                animate-spin
                "
              />

              <span className="font-medium text-blue-700">
                {step}
              </span>
            </div>
          </div>
        )}

        {/* Upload Form */}

        <div className="space-y-8">
          {/* Orders */}

          <div>
            <label
              className="
              block
              font-semibold
              text-slate-700
              mb-3
              "
            >
              Orders CSV
            </label>

            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setOrders(
                  e.target.files?.[0] ||
                    null
                )
              }
              className="
              w-full
              border
              rounded-xl
              p-3
              "
            />

            {orders && (
              <p className="text-green-600 mt-2">
                ✓ {orders.name}
              </p>
            )}
          </div>

          {/* Payments */}

          <div>
            <label
              className="
              block
              font-semibold
              text-slate-700
              mb-3
              "
            >
              Payments CSV
            </label>

            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setPayments(
                  e.target.files?.[0] ||
                    null
                )
              }
              className="
              w-full
              border
              rounded-xl
              p-3
              "
            />

            {payments && (
              <p className="text-green-600 mt-2">
                ✓ {payments.name}
              </p>
            )}
          </div>

          {/* Error */}

          {error && (
            <div
              className="
              bg-red-50
              border
              border-red-200
              text-red-600
              px-4
              py-3
              rounded-xl
              "
            >
              {error}
            </div>
          )}

          {/* Upload Button */}

          <button
            onClick={uploadFiles}
            disabled={loading}
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-400
            disabled:cursor-not-allowed
            text-white
            py-4
            rounded-xl
            font-semibold
            text-lg
            transition
            "
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div
                  className="
                  w-5 h-5
                  border-2
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                  "
                />

                Processing...
              </div>
            ) : (
              "Upload & Reconcile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}