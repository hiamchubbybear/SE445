import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <section
        id="hero"
        className="  min-h-screen flex justify-center items-center flex-col relative text-center py-24 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden"
      >
        {/* BG Shapes */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-400 opacity-30 rounded-full blur-3xl animate-ping"></div>

        <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-md">
          Học lập trình <br />{" "}
          <span className="text-yellow-300">dễ dàng & chuyên sâu</span>
        </h2>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8 font-light">
          Lộ trình bài bản, luyện tập thực tế, giúp bạn đi từ số 0 đến thành
          thạo lập trình
        </p>
        <a
          href="/signup"
          className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-yellow-300 transition"
        >
          🚀 Bắt đầu học miễn phí
        </a>
      </section>

      {/* Featured Courses */}
      <section
        id="featured-courses"
        className="min-h-screen flex justify-center items-center flex-col py-20 px-6 bg-gray-100"
      >
        <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">
          🚀 Khóa học nổi bật
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 container mx-auto">
          {[
            {
              title: "JavaScript Cơ Bản",
              color: "from-yellow-200 to-yellow-100",
            },
            { title: "ReactJS Từ A-Z", color: "from-blue-200 to-blue-100" },
            {
              title: "HTML + CSS Cho Newbie",
              color: "from-pink-200 to-pink-100",
            },
            { title: "Git & Github", color: "from-purple-200 to-purple-100" },
          ].map(({ title, color }, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-md hover:scale-105 transition transform duration-300`}
            >
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                {title}
              </h4>
              <p className="text-sm text-gray-600">Miễn phí – Bắt đầu ngay</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        id="why-choose-us"
        className="min-h-screen flex justify-center items-center flex-col py-20 px-6 bg-white text-center"
      >
        <h3 className="text-3xl font-bold mb-12 text-gray-800">
          💡 Tại sao chọn Coursera?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3 text-blue-600">
              🧠 Lộ trình rõ ràng
            </h4>
            <p className="text-gray-600">
              Từng bước được hướng dẫn chi tiết, không bị lạc hướng.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3 text-indigo-600">
              👨‍🏫 Giảng viên chất lượng
            </h4>
            <p className="text-gray-600">
              Đội ngũ giảng viên nhiều năm kinh nghiệm thực tế.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3 text-purple-600">
              🧪 Quiz & Thực hành
            </h4>
            <p className="text-gray-600">
              Ôn tập và kiểm tra liên tục để nắm vững kiến thức.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3 text-green-600">
              🌍 Học mọi lúc, mọi nơi
            </h4>
            <p className="text-gray-600">
              Linh hoạt trên mọi thiết bị, phù hợp với thời gian của bạn.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3 text-yellow-600">
              🎓 Chứng chỉ uy tín
            </h4>
            <p className="text-gray-600">
              Nhận chứng chỉ từ các trường đại học và tập đoàn hàng đầu thế
              giới.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
