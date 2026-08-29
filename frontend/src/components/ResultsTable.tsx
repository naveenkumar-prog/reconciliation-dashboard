import { useEffect, useState } from "react";
import api from "../api/axios";
import ExplanationModal from "./ExplanationModal";

export default function ResultsTable() {
  const [results, setResults] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [selectedId, setSelectedId] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/dashboard/results?search=${search}&type=${type}`
      );

      setResults(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const badgeColors: any = {
    MISSING_PAYMENT:
      "bg-red-100 text-red-700",

    AMOUNT_MISMATCH:
      "bg-yellow-100 text-yellow-700",

    ORPHAN_PAYMENT:
      "bg-purple-100 text-purple-700",

    FULL_REFUND:
      "bg-green-100 text-green-700",

    PARTIAL_REFUND:
      "bg-orange-100 text-orange-700",
  };

  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      border
      p-6
      "
    >
      <h2 className="text-xl font-semibold mb-6">
        Discrepancy Details
      </h2>

      {/* Filters */}

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
          border
          rounded-lg
          px-4
          py-2
          flex-1
          "
          placeholder="Search Order Ref"
        />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="
          border
          rounded-lg
          px-4
          py-2
          "
        >
          <option value="">
            All Types
          </option>

          <option value="MISSING_PAYMENT">
            Missing Payment
          </option>

          <option value="AMOUNT_MISMATCH">
            Amount Mismatch
          </option>

          <option value="ORPHAN_PAYMENT">
            Orphan Payment
          </option>

          <option value="FULL_REFUND">
            Full Refund
          </option>

          <option value="PARTIAL_REFUND">
            Partial Refund
          </option>
        </select>

        <button
          onClick={fetchResults}
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5
          py-2
          rounded-lg
          "
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="py-10 text-center">
          Loading...
        </div>
      )}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-3 text-left">
                  Order Ref
                </th>

                <th className="p-3 text-left">
                  Type
                </th>

                <th className="p-3 text-left">
                  Order
                </th>

                <th className="p-3 text-left">
                  Payment
                </th>

                <th className="p-3 text-left">
                  Risk
                </th>

                <th className="p-3 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8"
                  >
                    No records available
                  </td>
                </tr>
              ) : (
                results.map((row: any) => (
                  <tr
                    key={row.id}
                    className="
                    border-b
                    hover:bg-slate-50
                    "
                  >
                    <td className="p-3">
                      {row.orderRef}
                    </td>

                    <td className="p-3">
                      <span
                        className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        ${
                          badgeColors[
                            row.discrepancyType
                          ] ||
                          "bg-gray-100 text-gray-700"
                        }
                        `}
                      >
                        {
                          row.discrepancyType
                        }
                      </span>
                    </td>

                    <td className="p-3">
                      $
                      {row.orderAmount?.toFixed?.(
                        2
                      ) ??
                        row.orderAmount}
                    </td>

                    <td className="p-3">
                      $
                      {row.paymentAmount?.toFixed?.(
                        2
                      ) ??
                        row.paymentAmount}
                    </td>

                    <td className="p-3 font-semibold text-red-600">
                      $
                      {row.riskAmount?.toFixed?.(
                        2
                      ) ??
                        row.riskAmount}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() =>
                          setSelectedId(
                            row.id
                          )
                        }
                        className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        "
                      >
                        Explain
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedId && (
        <ExplanationModal
          id={selectedId}
          onClose={() =>
            setSelectedId(null)
          }
        />
      )}
    </div>
  );
}