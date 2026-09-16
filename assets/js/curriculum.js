// curriculum.js — nguồn dữ liệu tĩnh cho toàn bộ site (đọc trực tiếp qua <script>, không fetch).
// Cấu trúc: window.CURRICULUM = mảng tầng, mỗi tầng chứa mảng bài.
// status: "ready" CHỈ khi file lessons/<slug>.html đã tồn tại — tools/check-site.js enforce điều này.
// slug: khớp đường dẫn file lessons/<slug>.html (không có phần mở rộng ở đây).
// icon: khóa tra vào ICONS trong site.js (mỗi tầng 1 icon chủ đề).
window.CURRICULUM = [
    {
        tier: 0,
        key: "tang-0",
        name: "Nền móng",
        blurb: "Hiểu game là gì và vai trò thật của người thiết kế, trước khi học bất kỳ kỹ thuật nào.",
        icon: "foundation",
        lessons: [
            {
                slug: "tang-0/01-game-la-gi",
                title: "Game là gì",
                summary: "So sánh các định nghĩa game nổi tiếng (Suits, Juul, Salen & Zimmerman...) và dùng chúng làm công cụ phân tích, không phải câu trả lời đúng duy nhất.",
                goals: [
                    "Nêu và so sánh được vài định nghĩa game nổi tiếng",
                    "Dùng 6 đặc điểm của Juul để xét một sản phẩm có phải game kinh điển hay là ca ranh giới",
                    "Dùng 8 formal elements của Fullerton để soi một ý tưởng game đang thiếu gì"
                ],
                minutes: 18,
                level: "Cơ bản",
                status: "ready"
            },
            {
                slug: "tang-0/02-game-designer-lam-gi",
                title: "Game Designer thực sự làm gì",
                summary: "Designer không phải người chỉ nghĩ ý tưởng — phân biệt design với lập trình, đồ họa, các chuyên môn thật trong studio và một ngày làm việc thật.",
                goals: [
                    "Hiểu vì sao designer không phải là người chỉ 'nghĩ ý tưởng hay'",
                    "Phân biệt trách nhiệm của design với lập trình và đồ họa",
                    "Nhận diện các chuyên môn designer trong studio thật"
                ],
                minutes: 12,
                level: "Cơ bản",
                status: "ready"
            },
            {
                slug: "tang-0/03-tu-duy-nguoi-choi",
                title: "Tư duy lấy người chơi làm trung tâm",
                summary: "Luôn thiết kế từ trải nghiệm người chơi, thay vì từ sở thích cá nhân của designer.",
                goals: [
                    "Phân biệt 'tôi thích' và điều người chơi thật sự cảm nhận",
                    "Nghe người chơi đúng cách: họ chỉ ra vấn đề, designer tìm lời giải",
                    "Nhận diện thiên kiến khi tự đánh giá game của chính mình"
                ],
                minutes: 12,
                level: "Cơ bản",
                status: "ready"
            }
        ]
    },
    {
        tier: 1,
        key: "tang-1",
        name: "Cốt lõi",
        blurb: "Bộ khung lý thuyết dùng hằng ngày: MDA, core loop, động lực, flow, game feel.",
        icon: "core",
        lessons: [
            {
                slug: "tang-1/01-mda",
                title: "MDA Framework",
                summary: "Khung Mechanics–Dynamics–Aesthetics để phân tích và thiết kế trải nghiệm chơi.",
                goals: [
                    "Phân biệt Mechanics, Dynamics, Aesthetics",
                    "Gọi tên cảm xúc mục tiêu bằng 8 kiểu Aesthetics",
                    "Truy ngược từ trải nghiệm ra luật cần sửa"
                ],
                minutes: 14,
                level: "Cơ bản",
                status: "ready"
            },
            {
                slug: "tang-1/02-core-loop",
                title: "Core Loop",
                summary: "Vòng lặp hành động lặp lại tạo nên xương sống của gameplay.",
                goals: [
                    "Vẽ được core loop của một game cụ thể",
                    "Phân biệt core loop và meta loop",
                    "Đánh giá một loop có 'vui khi lặp lại' hay không"
                ],
                minutes: 12,
                level: "Cơ bản",
                status: "ready"
            },
            {
                slug: "tang-1/03-fun-dong-luc",
                title: "Fun và động lực người chơi",
                summary: "Các lý thuyết về niềm vui và động lực nội tại/ngoại tại của người chơi.",
                goals: [
                    "Phân biệt động lực nội tại và ngoại tại",
                    "Liệt kê vài loại 'fun' phổ biến (thử thách, khám phá, xã hội…)",
                    "Áp dụng để giải thích vì sao một cơ chế hấp dẫn"
                ],
                minutes: 13,
                level: "Cơ bản",
                status: "planned"
            },
            {
                slug: "tang-1/04-flow-do-kho",
                title: "Flow và độ khó",
                summary: "Giữ người chơi trong vùng flow bằng cách cân bằng thử thách và kỹ năng.",
                goals: [
                    "Vẽ đồ thị flow (thử thách và kỹ năng)",
                    "Nhận diện dấu hiệu lo âu và nhàm chán",
                    "Thiết kế đường cong độ khó tăng dần"
                ],
                minutes: 13,
                level: "Cơ bản",
                status: "planned"
            },
            {
                slug: "tang-1/05-game-feel",
                title: "Game Feel",
                summary: "Cảm giác điều khiển tức thời: input, phản hồi, polish.",
                goals: [
                    "Liệt kê yếu tố tạo game feel (input, camera, hiệu ứng)",
                    "Phân tích vì sao một điều khiển 'đã tay'",
                    "Thử tinh chỉnh một thông số để cải thiện cảm giác điều khiển"
                ],
                minutes: 14,
                level: "Cơ bản",
                status: "planned"
            }
        ]
    },
    {
        tier: 2,
        key: "tang-2",
        name: "Nghề",
        blurb: "Kỹ năng hành nghề: prototype, playtest, lặp thiết kế, viết tài liệu, phối hợp đội.",
        icon: "craft",
        lessons: [
            {
                slug: "tang-2/01-prototype-giay",
                title: "Prototype trên giấy",
                summary: "Kiểm chứng ý tưởng nhanh và rẻ trước khi bắt tay vào code.",
                goals: [
                    "Chọn cơ chế nào cần test bằng paper prototype",
                    "Tự tay dựng một bản prototype giấy",
                    "Rút ra bài học từ lần thử đầu tiên"
                ],
                minutes: 12,
                level: "Trung bình",
                status: "planned"
            },
            {
                slug: "tang-2/02-playtest",
                title: "Playtest",
                summary: "Quan sát người chơi thật để tìm vấn đề, không hỏi họ thích gì.",
                goals: [
                    "Chuẩn bị một buổi playtest có mục tiêu rõ ràng",
                    "Phân biệt hành vi quan sát được và ý kiến chủ quan",
                    "Ghi chép và tổng hợp phát hiện sau buổi test"
                ],
                minutes: 13,
                level: "Trung bình",
                status: "planned"
            },
            {
                slug: "tang-2/03-vong-lap-iteration",
                title: "Vòng lặp iteration",
                summary: "Thiết kế — thử — đo — sửa liên tục để cải thiện game từng bước.",
                goals: [
                    "Vẽ vòng lặp thiết kế-thử-đo-sửa",
                    "Ưu tiên thay đổi nào nên test trước",
                    "Tránh bẫy sửa quá nhiều thứ cùng một lúc"
                ],
                minutes: 11,
                level: "Trung bình",
                status: "planned"
            },
            {
                slug: "tang-2/04-tai-lieu-thiet-ke",
                title: "Viết tài liệu thiết kế (One-pager, GDD, Spec)",
                summary: "Chọn đúng loại tài liệu cho đúng mục đích giao tiếp trong đội.",
                goals: [
                    "Phân biệt one-pager, GDD, spec dùng khi nào",
                    "Viết một spec tính năng đủ để dev implement",
                    "Giữ tài liệu ngắn gọn và luôn cập nhật được"
                ],
                minutes: 15,
                level: "Trung bình",
                status: "planned"
            },
            {
                slug: "tang-2/05-lam-viec-voi-dev-art",
                title: "Làm việc với dev và art",
                summary: "Giao tiếp hiệu quả với lập trình viên và họa sĩ để ý tưởng thành hình.",
                goals: [
                    "Diễn đạt ý tưởng bằng ngôn ngữ dev/art hiểu được",
                    "Xử lý khi kỹ thuật không đáp ứng được ý tưởng ban đầu",
                    "Feedback art/build đúng trọng tâm, không mơ hồ"
                ],
                minutes: 12,
                level: "Trung bình",
                status: "planned"
            }
        ]
    },
    {
        tier: 3,
        key: "tang-3",
        name: "Chuyên sâu",
        blurb: "Đi sâu vào hệ thống, kinh tế, cân bằng số liệu, tiến trình, level, UX và narrative.",
        icon: "deep",
        lessons: [
            {
                slug: "tang-3/01-systems-design",
                title: "Systems design",
                summary: "Thiết kế các hệ thống tương tác lẫn nhau, thay vì từng cơ chế đơn lẻ.",
                goals: [
                    "Vẽ sơ đồ hệ thống với biến và quan hệ nhân quả",
                    "Nhận diện vòng phản hồi dương và âm",
                    "Dự đoán hệ quả không mong muốn của một hệ thống"
                ],
                minutes: 16,
                level: "Trung bình",
                status: "planned"
            },
            {
                slug: "tang-3/02-economy-sources-sinks",
                title: "Economy: sources và sinks",
                summary: "Cân bằng dòng chảy tài nguyên vào và ra trong nền kinh tế game.",
                goals: [
                    "Liệt kê source và sink trong một game cụ thể",
                    "Phát hiện economy bị lạm phát",
                    "Thiết kế sink hợp lý để giữ giá trị tài nguyên"
                ],
                minutes: 15,
                level: "Trung bình",
                status: "planned"
            },
            {
                slug: "tang-3/03-balance-spreadsheet",
                title: "Balance bằng spreadsheet",
                summary: "Dùng bảng tính để mô hình hóa và cân bằng số liệu game.",
                goals: [
                    "Dựng bảng tính so sánh sức mạnh giữa các lựa chọn",
                    "Dùng công thức để mô phỏng thay đổi số liệu",
                    "Đọc kết quả mô phỏng để ra quyết định balance"
                ],
                minutes: 17,
                level: "Nâng cao",
                status: "planned"
            },
            {
                slug: "tang-3/04-progression-phan-thuong",
                title: "Progression và phần thưởng",
                summary: "Thiết kế đường tiến trình và lịch trình phần thưởng giữ chân người chơi.",
                goals: [
                    "Phân biệt progression tuyến tính và phân nhánh",
                    "Thiết kế lịch trình phần thưởng hợp lý",
                    "Tránh phần thưởng vô nghĩa hoặc trùng lặp"
                ],
                minutes: 14,
                level: "Trung bình",
                status: "planned"
            },
            {
                slug: "tang-3/05-level-design",
                title: "Level design",
                summary: "Dàn dựng không gian và nhịp độ để dẫn dắt trải nghiệm người chơi.",
                goals: [
                    "Dùng landmark và ánh sáng để dẫn hướng người chơi",
                    "Thiết kế nhịp độ căng — nghỉ trong một màn chơi",
                    "Blockout một khu vực nhỏ"
                ],
                minutes: 16,
                level: "Trung bình",
                status: "planned"
            },
            {
                slug: "tang-3/06-ux-onboarding",
                title: "UX và onboarding",
                summary: "Dẫn dắt người chơi mới hiểu game mà không cần đọc hướng dẫn dài.",
                goals: [
                    "Thiết kế onboarding dạy qua hành động thay vì qua text",
                    "Giảm ma sát trong luồng UX cốt lõi",
                    "Đánh giá UX bằng vài heuristic cơ bản"
                ],
                minutes: 14,
                level: "Trung bình",
                status: "planned"
            },
            {
                slug: "tang-3/07-narrative-design",
                title: "Narrative design",
                summary: "Kể chuyện qua gameplay, không chỉ qua cutscene và thoại.",
                goals: [
                    "Phân biệt narrative design và viết kịch bản",
                    "Kể chuyện qua môi trường và cơ chế",
                    "Lồng ghép cốt truyện vào core loop"
                ],
                minutes: 15,
                level: "Trung bình",
                status: "planned"
            }
        ]
    },
    {
        tier: 4,
        key: "tang-4",
        name: "Nâng cao",
        blurb: "Vận hành game sau khi ra mắt: LiveOps, số liệu, đạo đức thiết kế, mổ xẻ đối thủ.",
        icon: "advanced",
        lessons: [
            {
                slug: "tang-4/01-f2p-liveops",
                title: "F2P và LiveOps",
                summary: "Vận hành game free-to-play lâu dài qua sự kiện, mùa giải, cập nhật.",
                goals: [
                    "Hiểu các mô hình doanh thu F2P phổ biến",
                    "Lên kế hoạch một sự kiện LiveOps đơn giản",
                    "Cân bằng giữa monetization và trải nghiệm chơi"
                ],
                minutes: 16,
                level: "Nâng cao",
                status: "planned"
            },
            {
                slug: "tang-4/02-metrics-ab-test",
                title: "Metrics và A/B test",
                summary: "Dùng số liệu để ra quyết định thiết kế thay vì cảm tính.",
                goals: [
                    "Chọn metric đúng cho câu hỏi thiết kế",
                    "Thiết kế một A/B test đơn giản",
                    "Tránh kết luận sai từ dữ liệu nhiễu"
                ],
                minutes: 15,
                level: "Nâng cao",
                status: "planned"
            },
            {
                slug: "tang-4/03-dao-duc-dark-patterns",
                title: "Đạo đức thiết kế và dark patterns",
                summary: "Nhận diện và tránh các thủ thuật thao túng người chơi.",
                goals: [
                    "Nhận diện các dark pattern phổ biến",
                    "Phân tích ranh giới giữa thuyết phục và thao túng",
                    "Đề xuất thiết kế đạo đức hơn cho một tính năng"
                ],
                minutes: 13,
                level: "Nâng cao",
                status: "planned"
            },
            {
                slug: "tang-4/04-mo-xe-game",
                title: "Mổ xẻ game (deconstruction)",
                summary: "Phân tích game đã ra mắt để rút ra bài học thiết kế.",
                goals: [
                    "Áp dụng quy trình deconstruction có hệ thống",
                    "Tách bạch quan sát và suy đoán khi mổ xẻ",
                    "Viết một bài phân tích game ngắn"
                ],
                minutes: 14,
                level: "Nâng cao",
                status: "planned"
            },
            {
                slug: "tang-4/05-portfolio-con-duong",
                title: "Portfolio và con đường sự nghiệp",
                summary: "Xây dựng portfolio và định hướng nghề designer.",
                goals: [
                    "Chọn dự án phù hợp để đưa vào portfolio",
                    "Trình bày quá trình tư duy, không chỉ kết quả cuối",
                    "Định hướng con đường sự nghiệp designer"
                ],
                minutes: 12,
                level: "Nâng cao",
                status: "planned"
            }
        ]
    },
    {
        tier: "C",
        key: "capstone",
        name: "Capstone",
        blurb: "Áp dụng toàn bộ lộ trình vào một dự án game nhỏ, trọn vẹn từ đầu đến cuối.",
        icon: "capstone",
        lessons: [
            {
                slug: "capstone/01-thiet-ke-game-nho",
                title: "Thiết kế một game nhỏ trọn vòng",
                summary: "Đi từ ý tưởng đến prototype chơi được, áp dụng mọi kỹ năng đã học.",
                goals: [
                    "Xác định core loop và MDA cho ý tưởng của bạn",
                    "Prototype, playtest và lặp ít nhất một vòng",
                    "Tổng hợp thành một tài liệu thiết kế ngắn gọn"
                ],
                minutes: 20,
                level: "Nâng cao",
                status: "planned"
            }
        ]
    }
];
