import React from "react";

const ServiceSection = ({ number, imgSrc, title, children }) => (
  <section style={{ display: "flex", alignItems: "flex-start", marginBottom: "40px" }}>
    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#027C9D", marginRight: "20px", userSelect: "none" }}>
      {number}.
    </div>
    <div style={{ flex: "1", marginRight: "30px" }}>
      <img
        src={imgSrc}
        alt={title}
        style={{ maxWidth: "330px", borderRadius: "10px", border: "2px solid #eee", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
      />
    </div>
    <div style={{ flex: "2" }}>
      <h2 style={{ marginTop: 0, color: "#265085" }}>{title}</h2>
      {children}
    </div>
  </section>
);

const Footer = () => (
  <footer style={{
    background: "linear-gradient(to right, #6BBFD4, #4CAFC4, #027C9D)",
    color: "#fff",
    textAlign: "center",
    padding: "20px 12px",
    marginTop: "40px",
    borderRadius: "8px"
  }}>
    <p style={{ margin: 0, fontSize: "0.9rem", userSelect: "none" }}>
      © {new Date().getFullYear()} EV Service. Mọi quyền được bảo lưu.
    </p>
  </footer>
);

export default function Service() {
  return (
    <div style={{ fontFamily: "sans-serif", color: "#263238", backgroundColor: "#f7fafd", padding: "32px", maxWidth: "960px", margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: "46px" }}>
        <h1 style={{ margin: 0, color: "#0a213d" }}>Pulse Battery Tech Center</h1>
        <p style={{ fontSize: "1.11rem", color: "#6480a3" }}>
          Chăm sóc tận tâm – Vận hành bền bỉ, an toàn
        </p>
        <img
          src="/path/to/banner.jpg"
          alt="Trung tâm bảo dưỡng xe điện"
          style={{ maxWidth: "100%", marginTop: 25, marginBottom: 14 }}
        />
      </header>

      <section style={{ margin: "0 auto 40px" }}>
        <p>
          Pulse Battery Tech Center cung cấp dịch vụ bảo dưỡng toàn diện cho xe điện. Đội ngũ kỹ thuật viên chuyên nghiệp, trang thiết bị hiện đại, đảm bảo hiệu suất tối ưu và an toàn tuyệt đối cho phương tiện của bạn.
        </p>
      </section>

      <ServiceSection number={1} imgSrc="/images/pin-dongco.jpg" title="Kéo dài tuổi thọ pin & động cơ">
        <p>
          Pin và động cơ là “trái tim” quyết định hiệu suất và trải nghiệm lái xe điện. Bảo dưỡng định kỳ giúp pin duy trì khả năng sạc/xả ổn định, hạn chế chai pin, đồng thời động cơ được vệ sinh và căn chỉnh kỹ càng, đảm bảo vận hành luôn êm ái, bền bỉ.
        </p>
      </ServiceSection>

      <ServiceSection number={2} imgSrc="/images/controller.jpg" title="Bộ điều khiển – Bộ não của xe điện">
        <p>
          Bộ điều khiển kiểm soát toàn bộ hệ thống điện và tốc độ xe. Việc làm sạch, cân chỉnh và kiểm tra các kết nối điện giúp xe vận hành mượt mà, tiết kiệm năng lượng và luôn an toàn trên mọi cung đường.
        </p>
      </ServiceSection>

      <ServiceSection number={3} imgSrc="/images/phanh.jpg" title="Hệ thống phanh – An toàn tuyệt đối">
        <p>
          Má phanh, dầu phanh và cơ cấu phanh đều được kiểm tra, bảo dưỡng định kỳ. Nhờ đó đảm bảo khả năng kiểm soát tốc độ và hạn chế tối đa rủi ro an toàn khi di chuyển.
        </p>
      </ServiceSection>

      <ServiceSection number={4} imgSrc="/images/suspension.jpg" title="Hệ thống treo – Ổn định & êm ái">
        <p>
          Hệ thống treo được kiểm tra, điều chỉnh thường xuyên giúp xe vận hành ổn định, giảm xóc và rung lắc, tăng cảm giác êm ái cho người dùng trên mọi địa hình.
        </p>
      </ServiceSection>

      <ServiceSection number={5} imgSrc="/images/frame.jpg" title="Khung sườn & Thân xe">
        <p>
          Khung sườn được siết chặt, kiểm tra mối hàn và bảo vệ chống gỉ sét, giữ kết cấu xe luôn vững chắc, bền bỉ theo thời gian.
        </p>
      </ServiceSection>

      <ServiceSection number={6} imgSrc="/images/dayedien.jpg" title="Dây điện & Giắc cắm">
        <p>
          Hệ thống dây điện và giắc cắm được kiểm tra độ kín, chống oxy hóa & xử lý đứt gãy, ngăn chuột cắn. Đảm bảo nguồn điện an toàn và ổn định suốt quá trình sử dụng.
        </p>
      </ServiceSection>

      <ServiceSection number={7} imgSrc="/images/khoasmart.jpg" title="Khóa & Hệ thống điện tử">
        <p>
          Pin remote được kiểm tra và thay thế nếu yếu. Ứng dụng hoặc IoT luôn được cập nhật, giúp kết nối thông minh liền mạch, tiện lợi và an toàn khi sử dụng xe điện.
        </p>
      </ServiceSection>

      <section style={{ background: "#eaf5fc", borderRadius: "8px", margin: "40px 0", padding: "28px 18px" }}>
        <h2 style={{ color: "#0a213d", marginTop: 0 }}>Vì sao chọn Pulse Battery Tech Center?</h2>
        <ul>
          <li>Đội ngũ kỹ thuật viên chuyên nghiệp, tận tâm</li>
          <li>Trang thiết bị tối tân, quy trình nhanh gọn, minh bạch</li>
          <li>Tiết kiệm chi phí – Gia tăng tuổi thọ xe tối đa</li>
          <li>Dịch vụ tận nơi, đặt lịch linh hoạt</li>
        </ul>
      </section>

      <Footer />
    </div>
  );
}