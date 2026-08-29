import { useEffect, useState } from "react";
import api from "../api/axios";

interface Props {
  id: string;
  onClose: () => void;
}

export default function ExplanationModal({
  id,
  onClose,
}: Props) {
  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadExplanation();
  }, []);

  const loadExplanation =
    async () => {
      try {
        const res =
          await api.post(
            `/llm/explain/${id}`
          );

        setData(res.data);
      } catch {
        setError(
          "Unable to generate AI explanation."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
      fixed inset-0
      bg-black/60
      flex
      items-center
      justify-center
      z-50
      "
    >
      <div
        className="
        bg-white
        rounded-2xl
        shadow-2xl
        w-[750px]
        max-w-[90vw]
        max-h-[85vh]
        overflow-y-auto
        p-8
        "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            AI Analysis
          </h2>

          <button
            onClick={onClose}
            className="
            bg-slate-200
            hover:bg-slate-300
            px-4
            py-2
            rounded-lg
            "
          >
            Close
          </button>
        </div>

        {loading && (
          <div className="text-center py-10">
            Generating analysis...
          </div>
        )}

        {error && (
          <div className="text-red-600">
            {error}
          </div>
        )}

        {!loading && data && (
          <div className="space-y-6">

            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                Summary
              </h3>

              <p className="text-slate-700">
                {data.summary}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-2">
                Likely Cause
              </h3>

              <p className="text-slate-700">
                {data.likelyCause}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Recommended Action
              </h3>

              <p className="text-slate-700">
                {data.recommendedAction}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Severity
              </h3>

              <span
                className="
                inline-block
                px-3
                py-1
                rounded-full
                bg-red-100
                text-red-700
                font-medium
                "
              >
                {data.severity}
              </span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}