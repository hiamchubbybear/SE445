import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems(res.data.cart?.courses || []);
    } catch (err) {
      toast.error("Lỗi khi tải giỏ hàng.");
    }
  };

  const handleRemove = async (courseId) => {
    try {
      await axios.post(
        "http://localhost:8080/v1/cart/remove",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Đã xoá khỏi giỏ hàng.");
      setCartItems((prev) => prev.filter((course) => course._id !== courseId));
      setSelectedIds((prev) => prev.filter((id) => id !== courseId));
    } catch (err) {
      toast.error("Không thể xoá khoá học.");
    }
  };

  const toggleSelect = (courseId) => {
    setSelectedIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, course) => {
      return selectedIds.includes(course._id)
        ? total + (course.price || 0)
        : total;
    }, 0);
  };

  const handleCheckout = async () => {
    if (selectedIds.length === 0) {
      toast.info("Vui lòng chọn ít nhất một khoá học.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/v1/purchase",
        {
          courseIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(`Thanh toán thành công! Mã đơn: ${res.data.historyId}`);

      // Xoá các khoá học đã mua khỏi cart
      setCartItems((prev) =>
        prev.filter((course) => !selectedIds.includes(course._id))
      );
      setSelectedIds([]);
    } catch (err) {
      console.error("Lỗi khi thanh toán:", err);
      toast.error("Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Giỏ hàng</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="empty cart"
            className="w-24 h-24 mb-4 opacity-70"
          />
          <p className="text-lg text-gray-500 font-medium">
            Bạn chưa thêm khoá học nào.
          </p>
        </div>
      ) : (
        <>
          <table className="w-full border text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="p-3 w-6"></th>
                <th className="p-3">Sản phẩm</th>
                <th className="p-3 text-center">Đơn giá</th>
                <th className="p-3 text-center">Số lượng</th>
                <th className="p-3 text-center">Tổng</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((course) => (
                <tr key={course._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(course._id)}
                      onChange={() => toggleSelect(course._id)}
                    />
                  </td>
                  <td className="p-3 flex gap-4 items-center">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {course.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </td>
                  <td className="p-3 text-center text-gray-800">
                    {course.price === 0
                      ? "Miễn phí"
                      : `${course.price.toLocaleString()}đ`}
                  </td>
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 text-center font-bold text-indigo-600">
                    {course.price === 0
                      ? "0đ"
                      : `${course.price.toLocaleString()}đ`}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRemove(course._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tổng tiền và thanh toán */}
          <div className="mt-6 flex justify-between items-center flex-wrap gap-3">
            <div className="text-xl font-semibold text-gray-700">
              Tổng tiền:{" "}
              <span className="text-indigo-600">
                {getTotalPrice().toLocaleString()}đ
              </span>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
              onClick={handleCheckout}
              disabled={selectedIds.length === 0}
            >
              Thanh toán
            </button>
          </div>
        </>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
