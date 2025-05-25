import { auth } from "@/lib/auth";
import axios from "@/lib/axios";

interface IPoint {
  id: string;
  amount: number;
  expiredAt: string;
}

interface ICoupon {
  id: string;
  percen: number;
  expiredAt: string;
}

export default async function CustomerRewards() {
  const user = await auth();
  const { data } = await axios.get("/rewards", {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });

  const points: IPoint[] = data.points;
  const coupon: ICoupon = data.coupon;

  return (
    <div className="p-6 text-white mt-20">
      <h1 className="text-3xl font-bold mb-6">Customer Rewards</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Customer Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {points.length > 0 ? (points.map((point: IPoint) => (
            <div
              key={point.id}
              className="bg-white shadow-md rounded-2xl p-4 border"
            >
              <p className="text-lg font-semibold text-gray-800">
                Points:{" "}
                <span className="text-blue-600">
                  {point.amount.toLocaleString()}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Expired At:{" "}
                <span className="text-red-500">
                  {new Date(point.expiredAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          ))): (
            <p>No points available.</p>
          )}
          
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Customer Coupons</h2>
        {coupon && (
          <div className="bg-white shadow-md rounded-2xl p-4 border w-fit">
            <p className="text-lg font-semibold text-gray-800">
              Discount: <span className="text-green-600">{coupon.percen}%</span>
            </p>
            <p className="text-sm text-gray-500">
              Expired At:{" "}
              <span className="text-red-500">
                {new Date(coupon.expiredAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        )}
        {!coupon && "No coupon available."}
      </section>
    </div>
  );
}