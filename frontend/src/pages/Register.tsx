import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const register = async () => {
    try {
      setLoading(true);

      await api.post(
        "/auth/register",
        {
          email,
          password,
        }
      );

      navigate("/");
    } catch {
      alert(
        "Unable to register"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-indigo-50
      via-white
      to-blue-100
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
        max-w-md
        rounded-3xl
        shadow-xl
        p-8
        border
        "
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            Create Account
          </h1>

          <p className="text-slate-500 mt-2">
            Start reconciling revenue
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
            w-full
            border
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
            w-full
            border
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "
          />

          <button
            onClick={register}
            disabled={loading}
            className="
            w-full
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            py-3
            rounded-xl
            font-semibold
            "
          >
            {loading
              ? "Creating..."
              : "Register"}
          </button>
        </div>

        <p className="text-center mt-6 text-slate-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="
            text-blue-600
            font-medium
            "
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}