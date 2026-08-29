import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const login = async () => {
    if (!email || !password) {
      setError(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/upload");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password"
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
        max-w-md
        rounded-3xl
        shadow-xl
        border
        p-8
        "
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Sign in to continue
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your username"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && login()
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" && login()
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
              text-sm
              "
            >
              {error}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-400
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
            "
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="
              text-blue-600
              font-medium
              hover:text-blue-700
              "
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}