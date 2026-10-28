// Shared build-time copy. Only the current page’s UI strings are sent to the browser.
export const locales = ["en", "id", "ja"] as const;
export type Locale = (typeof locales)[number];

export const messages = {
  "nav-theme-light": {
    "en": "Light",
    "id": "Terang",
    "ja": "ライト"
  },
  "nav-theme-dark": {
    "en": "Dark",
    "id": "Gelap",
    "ja": "ダーク"
  },
  "back-home": {
    "id": "← Kembali ke Beranda",
    "ja": "← ホームに戻る",
    "en": "← Back to Home"
  },
  "view-cert": {
    "id": "Lihat Sertifikat",
    "ja": "証明書を見る",
    "en": "View Certificate"
  },
  "view-repo": {
    "id": "Lihat Repositori →",
    "ja": "リポジトリを見る →",
    "en": "View Repository →"
  },
  "sec-exp": {
    "id": "Pengalaman",
    "ja": "経歴",
    "en": "Experience"
  },
  "sec-edu": {
    "id": "Pendidikan",
    "ja": "学歴",
    "en": "Education"
  },
  "sec-skills": {
    "id": "Keahlian Teknis",
    "ja": "テクニカルスキル",
    "en": "Technical Skills"
  },
  "sec-proj": {
    "id": "Proyek",
    "ja": "プロジェクト",
    "en": "Projects"
  },
  "sec-ach": {
    "id": "Pencapaian",
    "ja": "実績",
    "en": "Achievements"
  },
  "ctx-label": {
    "id": "Konteks",
    "ja": "制作の背景",
    "en": "Context"
  },
  "ts-label": {
    "id": "Teknologi yang Digunakan",
    "ja": "技術スタック",
    "en": "Tech Stack"
  },
  "prob-label": {
    "id": "Masalah",
    "ja": "課題",
    "en": "The Problem"
  },
  "sol-label": {
    "id": "Solusi",
    "ja": "解決策",
    "en": "The Solution"
  },
  "imp-label": {
    "id": "Dampak",
    "ja": "成果",
    "en": "Impact"
  },
  "gal-label": {
    "id": "Galeri Proyek",
    "ja": "プロジェクトギャラリー",
    "en": "Project Gallery"
  },
  "ctx-ac": {
    "id": "Proyek Akademik",
    "ja": "学業でのプロジェクト",
    "en": "Academic Project"
  },
  "ctx-pe": {
    "id": "Proyek Pribadi",
    "ja": "個人制作プロジェクト",
    "en": "Personal Project"
  },
  "my-name": {
    "id": "Aaron Nathanael",
    "ja": "アーロン・ナタナエル",
    "en": "Aaron Nathanael"
  },
  "hero-desc": {
    "id": "Mahasiswa S1 Ilmu Komputer di BINUS University | Magang Pengembang Aplikasi di PT Bank Central Asia Tbk.",
    "ja": "ビヌス大学 コンピュータサイエンス学部生 | PT Bank Central Asia Tbk アプリケーション開発インターン。",
    "en": "Computer Science Undergraduate @ BINUS University | Application Developer Intern @ PT Bank Central Asia Tbk."
  },
  "exp-bca": {
    "id": "Magang Pengembang Aplikasi",
    "ja": "アプリケーション開発インターン",
    "en": "Application Developer Intern"
  },
  "exp-bca-desc": {
    "id": "Bekerja dalam tim pengembangan iOS yang bertanggung jawab atas pengembangan dan pemeliharaan aplikasi Merchant BCA secara berkelanjutan.",
    "ja": "iOS開発チームに所属し、Merchant BCAアプリケーションの継続的な開発と保守を担当しています。",
    "en": "Working in the iOS Development team responsible for continuously developing and maintaining the Merchant BCA application."
  },
  "exp-guide": {
    "id": "Pemandu Wisata",
    "ja": "ツアーガイド",
    "en": "Tour Guide"
  },
  "exp-guide-desc": {
    "id": "Memandu tur Museum Ghibli di Mitaka, Tokyo. Tur dilaksanakan sepenuhnya dalam bahasa Inggris dan bahasa Jepang dasar. Sebagian besar tamu adalah penutur bahasa Inggris yang sedang berwisata di Jepang.",
    "ja": "東京・三鷹のジブリ美術館でツアーガイドを務めました。案内はすべて英語と基礎的な日本語で行い、参加者の多くは日本を旅行中の英語を話す方々でした。",
    "en": "Lead tours of the Ghibli Museum in Mitaka, Tokyo. The tours were conducted entirely in English and basic Japanese. The guests were mostly English-speakers traveling in Japan."
  },
  "exp-aca": {
    "id": "Aktivis Acara Akademik",
    "ja": "学術イベント運営メンバー",
    "en": "Academic Events Activist"
  },
  "exp-aca-desc": {
    "id": "Bekerja dalam tim berbasis proyek untuk merancang dan menyelenggarakan acara HIMTI.",
    "ja": "プロジェクトごとにチームで協力し、HIMTIのイベントを企画・運営しました。",
    "en": "Worked in teams, based on projects, to create and carry out HIMTI events."
  },
  "exp-web": {
    "id": "Aktivis Pengembangan Web",
    "ja": "ウェブ開発メンバー",
    "en": "Web Development Activist"
  },
  "exp-web-desc": {
    "id": "Bekerja dalam tim berbasis proyek untuk mengembangkan antarmuka situs web HIMTI menggunakan HTML, CSS, dan JavaScript.",
    "ja": "プロジェクトごとにチームで協力し、HTML、CSS、JavaScriptを使用してHIMTIのウェブサイトのフロントエンドを開発しました。",
    "en": "Worked in teams, based on projects, to develop the frontend of HIMTI websites using HTML, CSS, and JS."
  },
  "exp-sic": {
    "id": "Peserta",
    "ja": "参加者",
    "en": "Participant"
  },
  "exp-sic-desc": {
    "en": "Completed the intensive bootcamps for AI/ML, Python, and IoT. Delivered \"SafeFall\", a real-time fall detection app using YOLO computer vision models. Reached the semi-finals among the top {sicSemiFinalists} of {sicParticipants} participants.",
    "id": "Menyelesaikan pelatihan intensif AI/ML, Python, dan IoT. Mengembangkan \"SafeFall\", aplikasi deteksi jatuh secara real-time menggunakan model visi komputer YOLO. Lolos ke babak semifinal sebagai salah satu dari {sicSemiFinalists} peserta terbaik dari total {sicParticipants} peserta.",
    "ja": "AI・機械学習、Python、IoTの集中講座を修了しました。YOLOのコンピュータビジョンモデルを使用したリアルタイム転倒検知アプリ「SafeFall」を開発し、参加者{sicParticipants}名中、上位{sicSemiFinalists}名の準決勝進出者に選ばれました。"
  },
  "exp-bncc": {
    "id": "Aktivis Pembelajaran & Pelatihan",
    "ja": "学習・研修運営メンバー",
    "en": "Learning & Training Activist"
  },
  "exp-bncc-desc": {
    "id": "Bekerja dalam tim berbasis proyek untuk merencanakan dan menyusun modul pembelajaran ilmu komputer yang menyeluruh bagi mahasiswa.",
    "ja": "プロジェクトごとにチームで協力し、大学生向けの体系的なコンピュータサイエンス学習教材を企画・作成しました。",
    "en": "Worked in teams, based on project, to plan out and create comprehensive computer science learning modules for university students."
  },
  "exp-ios": {
    "id": "Peserta",
    "ja": "参加者",
    "en": "Participant"
  },
  "exp-ios-desc": {
    "id": "Bekerja dalam tim untuk mengembangkan aplikasi iOS berbasis AR yang dapat memproyeksikan desain rumah tradisional Bali pada permukaan di dunia nyata.",
    "ja": "チームで協力し、バリの伝統的な住宅デザインを現実の空間の表面に投影できるARベースのiOSアプリを開発しました。",
    "en": "Worked in a team to develop an AR-based iOS mobile app which is able to project traditional Balinese house designs onto real-world surfaces."
  },
  "edu-sit-sub": {
    "id": "Program Pertukaran Pelajar",
    "ja": "交換留学プログラム",
    "en": "Student Exchange Program"
  },
  "edu-sit-desc": {
    "id": "Mengikuti pertukaran pelajar di Shibaura Institute of Technology, Tokyo. Mempelajari bidang teknik di Jepang serta cara berkomunikasi dan bekerja sama dengan orang-orang dari budaya dan latar belakang yang sangat berbeda.",
    "ja": "東京の芝浦工業大学に交換留学しました。日本の工学を学ぶとともに、文化や背景が大きく異なる人々とのコミュニケーションや協働について学びました。",
    "en": "Exchanged at Shibaura Institute of Technology, Tokyo. Learned about engineering in Japan, as well as communicating and working with people with very different culture and backgrounds."
  },
  "edu-binus-sub": {
    "id": "S1 Ilmu Komputer",
    "ja": "コンピュータサイエンス学士課程",
    "en": "Bachelor of Computer Science"
  },
  "edu-binus-desc": {
    "id": "Mahasiswa S1 Ilmu Komputer tahun keempat dengan IPK kumulatif {gpa}. Mengikuti program Global Class, dengan seluruh materi dan perkuliahan disampaikan sepenuhnya dalam bahasa Inggris serta pertukaran pelajar internasional wajib selama satu semester.",
    "ja": "累積GPA {gpa}のコンピュータサイエンス学部4年生です。教材も講義もすべて英語で提供され、1学期間の国際交換留学が必修となるグローバルクラスプログラムに在籍しています。",
    "en": "4th-year Computer Science undergraduate with a cumulative GPA of {gpa}. Within the Global Class program, where all the materials and lectures are provided entirely in English, as well as a compulsory international study exchange for one semester."
  },
  "edu-smak-sub": {
    "id": "Ijazah SMA",
    "ja": "高校卒業資格",
    "en": "High School Diploma"
  },
  "edu-smak-desc": {
    "id": "Sekolah menengah atas jurusan Matematika dan Ilmu Pengetahuan Alam (MIPA).",
    "ja": "高校では数学・自然科学（MIPA）を専攻しました。",
    "en": "General high school in the Mathematics and Natural Sciences (MIPA) major."
  },
  "ach-dl": {
    "id": "Dean's List 2025",
    "ja": "成績優秀者 (Dean's List) 2025",
    "en": "Dean's List 2025"
  },
  "ach-dl-desc": {
    "id": "Fakultas Ilmu Komputer Universitas BINUS",
    "ja": "ビヌス大学 コンピュータサイエンス学部",
    "en": "BINUS University School of Computer Science"
  },
  "ach-gj": {
    "id": "Juara 3 Game Jam",
    "ja": "ゲームジャム第3位",
    "en": "2nd Runner-Up Game Jam"
  },
  "ach-sic": {
    "id": "Semifinalis",
    "ja": "セミファイナリスト",
    "en": "Semi Finalist"
  },
  "ach-sic-desc": {
    "id": "Samsung Innovation Campus by Skilvul",
    "ja": "Samsung Innovation Campus by Skilvul",
    "en": "Samsung Innovation Campus by Skilvul"
  },
  "proj-pa-title": {
    "id": "Aplikasi Posture Alert",
    "ja": "姿勢警告アプリ",
    "en": "Posture Alert App"
  },
  "proj-pa-desc": {
    "id": "Aplikasi web deteksi postur menggunakan webcam.",
    "ja": "ウェブカメラを使用した姿勢検知ウェブアプリ。",
    "en": "Posture detection web app using webcam."
  },
  "pa-prob": {
    "id": "Membungkuk menyebabkan nyeri punggung, tetapi alat koreksi postur fisik tidak nyaman dipakai. Ada alternatif perangkat lunak, tetapi biasanya tidak berfungsi dengan baik jika pengguna memakai headphone atau memiliki latar belakang visual yang ramai.",
    "ja": "猫背は背中の痛みの原因になりますが、物理的な姿勢矯正器具は煩わしいものです。ソフトウェアの代替品もありますが、ヘッドフォンを使用していたり、背景が複雑だと正常に動作しないことがよくあります。",
    "en": "Slouching causes back pain, but physical posture correctors are annoying to wear. Software alternatives exist, but they usually break if the user wears headphones or has a busy background."
  },
  "pa-sol": {
    "id": "Aplikasi web dibangun untuk memantau postur menggunakan webcam biasa. Untuk mengatasi masalah headphone, pelacakan menggunakan koordinat mata, bukan telinga. Tahap kalibrasi ditambahkan untuk menyesuaikan pelacakan dengan ukuran tubuh pengguna dan mengabaikan gerakan di latar belakang.",
    "ja": "一般的なウェブカメラで姿勢を追跡するウェブアプリを構築しました。ヘッドホンによる問題を解決するため、耳ではなく目の座標を追跡します。さらに、ユーザーの体の大きさに合わせて追跡を固定し、背景の動きを無視するキャリブレーション機能を追加しました。",
    "en": "A web app was built to track posture using a regular webcam. To fix the headphone issue, tracking was mapped to eye coordinates instead of ears. A calibration step was added to lock onto the user's size and ignore background movement."
  },
  "pa-imp": {
    "id": "Alat pemantau postur gratis yang tidak memerlukan perangkat keras tambahan dan dapat digunakan dalam kondisi nyata. Sistem memperingatkan pengguna saat membungkuk dan menyediakan data kebiasaan selama sesi yang dapat diekspor.",
    "ja": "追加のハードウェアを必要とせず、実際の利用環境で動作する無料の姿勢モニターです。猫背になった際に警告し、セッション中の姿勢の習慣に関するデータをエクスポートできます。",
    "en": "A free, zero-hardware posture monitor that works in real-world conditions. It alerts the user when they slouch and provides exportable data on their session habits."
  },
  "pa-gal-1": {
    "id": "Deteksi Postur Membungkuk",
    "ja": "猫背の検知",
    "en": "Slouch Detection"
  },
  "pa-gal-2": {
    "id": "Penanganan Oklusi",
    "ja": "オクルージョン対応",
    "en": "Occlusion Handling"
  },
  "pa-gal-3": {
    "id": "Penyaringan Latar Belakang",
    "ja": "背景フィルタリング",
    "en": "Background Filtering"
  },
  "pa-gal-4": {
    "id": "Deteksi Kemiringan Kepala",
    "ja": "頭の傾き検知",
    "en": "Head Tilt Detection"
  },
  "proj-cd-title": {
    "id": "Pembuat Dokumentasi Kode",
    "ja": "コードドキュメント生成ツール",
    "en": "Code Documentation Generator"
  },
  "proj-cd-desc": {
    "id": "Aplikasi web dan antarmuka baris perintah (CLI) untuk menghasilkan dokumentasi kode Python.",
    "ja": "Pythonコードのドキュメントを生成するウェブアプリとコマンドラインツール（CLI）。",
    "en": "Python documentation generator web app and CLI."
  },
  "cd-prob": {
    "id": "Menulis dokumentasi membutuhkan pekerjaan yang berulang dan membosankan. Alat AI yang ada sering berhalusinasi dengan menyebut variabel yang sebenarnya tidak ada dalam kode, atau memerlukan biaya untuk digunakan melalui API cloud.",
    "ja": "ドキュメントの作成は面倒です。既存のAIツールはコードに存在しない変数を捏造（ハルシネーション）したり、クラウドAPI経由で使用するとコストがかかることがよくあります。",
    "en": "Writing documentation is tedious. Existing AI tools often hallucinate, making up variables that don't exist in the code, or they cost money to use via cloud APIs."
  },
  "cd-sol": {
    "id": "Alat Python yang mengutamakan pemrosesan lokal dibuat menggunakan model Qwen2.5. Format keluaran JSON diterapkan secara ketat untuk menghindari respons bertele-tele. Tahap validasi ditambahkan untuk mencocokkan keluaran AI dengan pohon sintaks abstrak (AST) kode asli, sehingga parameter yang tidak ada dalam kode dapat sepenuhnya diblokir.",
    "ja": "Qwen2.5を使用し、ローカルでの実行を重視したPythonツールを作成しました。出力を厳密にJSON形式に限定することで、冗長な応答を防ぎます。AIの出力を実際のコードの抽象構文木（AST）と照合し、存在しないパラメーターを完全に排除する検証処理を追加しました。",
    "en": "A local-first Python tool was created using the Qwen2.5 model. By strictly enforcing JSON outputs, it avoids chatty responses. A validation step was added to check the AI's output against the actual code's Abstract Syntax Tree (AST) to completely block fake parameters."
  },
  "cd-imp": {
    "id": "Menghasilkan docstring secara cepat, gratis, dan akurat dalam 5–20 detik per berkas tanpa memerlukan koneksi internet. Kualitas keluarannya diverifikasi menggunakan tolok ukur standar pemrosesan bahasa alami (NLP), seperti BLEU dan ROUGE-L.",
    "ja": "インターネット接続なしで、1ファイルあたり5〜20秒で高速、無料、正確なDocstringを生成します。出力品質は、BLEUやROUGE-Lなどの標準的なNLPベンチマークで検証されました。",
    "en": "Fast, free, and accurate docstrings generated in 5-20 seconds per file without needing an internet connection. The output quality was verified using standard NLP benchmarks like BLEU and ROUGE-L."
  },
  "cd-gal-1": {
    "id": "Antarmuka Web",
    "ja": "ウェブインターフェース",
    "en": "Web Interface"
  },
  "cd-gal-2": {
    "id": "Keluaran Tervalidasi",
    "ja": "検証済みの出力",
    "en": "Validated Outputs"
  },
  "proj-sf-title": {
    "id": "SafeFall",
    "ja": "SafeFall",
    "en": "SafeFall"
  },
  "proj-sf-desc": {
    "id": "Aplikasi web deteksi jatuh.",
    "ja": "転倒検知ウェブアプリ。",
    "en": "Fall detection web app."
  },
  "sf-prob": {
    "id": "Deteksi jatuh pada lansia biasanya bergantung pada smartwatch atau perangkat berbentuk kalung. Sayangnya, perangkat ini mudah terlupakan, dilepas untuk diisi daya, atau sengaja dihindari oleh pengguna yang paling membutuhkannya.",
    "ja": "高齢者の転倒検知は通常、スマートウォッチやペンダントに依存しています。しかし、これらのデバイスは忘れられやすく、充電のために外されたり、最も必要とするユーザーに敬遠されたりすることがよくあります。",
    "en": "Elderly fall detection usually relies on smartwatches or pendants. Unfortunately, these devices are easily forgotten, taken off to charge, or actively avoided by the users who need them most."
  },
  "sf-sol": {
    "id": "Model visi komputer YOLOv8 dilatih untuk mendeteksi jatuh dari rekaman kamera biasa. Sistem melacak gerakan vertikal mendadak, mencatat setiap kejadian beserta skor keyakinannya, dan mengirimkan peringatan tanpa memerlukan tindakan fisik dari pengguna.",
    "ja": "一般的なカメラ映像から転倒を検知するYOLOv8コンピュータビジョンモデルを学習させました。急激な垂直方向の動きを追跡し、各イベントを信頼度スコアとともに記録します。ユーザーが操作しなくてもアラートを送信します。",
    "en": "A YOLOv8 computer vision model was trained to detect falls using standard camera feeds. It tracks sudden vertical movement and logs each event with a confidence score, sending alerts without any physical interaction from the user."
  },
  "sf-imp": {
    "en": "A non-intrusive safety net designed to work continuously in the background. SafeFall was selected as a semi-finalist in the Samsung Innovation Campus program, among the top {sicSemiFinalists} of {sicParticipants} participants.",
    "id": "Sistem perlindungan yang tidak mengganggu dan dirancang untuk bekerja terus-menerus di latar belakang. SafeFall terpilih sebagai semifinalis program Samsung Innovation Campus, sebagai salah satu dari {sicSemiFinalists} peserta terbaik dari total {sicParticipants} peserta.",
    "ja": "利用者の妨げにならず、バックグラウンドで継続的に動作するよう設計された安全支援システムです。SafeFallはSamsung Innovation Campusで、参加者{sicParticipants}名中、上位{sicSemiFinalists}名の準決勝進出者に選ばれました。"
  },
  "sf-gal-1": {
    "id": "Jatuh Terdeteksi",
    "ja": "転倒を検知",
    "en": "Fall Detected"
  },
  "sf-gal-2": {
    "id": "Keadaan Normal",
    "ja": "通常状態",
    "en": "Normal State"
  },
  "sf-gal-3": {
    "id": "Log Peristiwa",
    "ja": "イベントログ",
    "en": "Event Logs"
  },
  "proj-rp-title": {
    "id": "Perencana Rute Transportasi Publik",
    "ja": "公共交通機関ルートプランナー",
    "en": "Public Transport Route Planner"
  },
  "proj-rp-desc": {
    "id": "Aplikasi web perencana rute transportasi publik.",
    "ja": "公共交通機関ルートプランナーのウェブアプリ。",
    "en": "Public transport route planner web app."
  },
  "rp-prob": {
    "id": "Transportasi publik bisa tidak dapat diandalkan dan membuat penggunanya frustrasi. Penumpang sering tidak tahu apakah bus terlambat atau kapan tepatnya bus akan tiba, sementara sumber informasi yang terpusat jarang tersedia.",
    "ja": "公共交通機関は運行が不安定で、利用者が不便を感じることがあります。バスが遅れているか、正確にいつ到着するかが分からないことが多く、こうした情報を一元的に確認できる場所もほとんどありません。",
    "en": "Public transport can be frustratingly unreliable. Commuters often don't know if a bus is delayed or exactly when it will arrive, and a single centralized source for this information rarely exists."
  },
  "rp-sol": {
    "id": "Aplikasi full-stack dibangun menggunakan Laravel dan Leaflet.js. Aplikasi mengambil koordinat GPS terkini dari Firebase untuk pelacakan real-time. Agar tetap andal, sistem cadangan ditambahkan: jika koneksi langsung terputus, aplikasi secara otomatis beralih ke data jadwal statis di MySQL.",
    "ja": "LaravelとLeaflet.jsを使用してフルスタックアプリを構築しました。FirebaseからリアルタイムのGPS座標を取得して追跡します。さらに信頼性を高めるため、リアルタイム接続が切断された場合、自動的にMySQLの静的なスケジュールデータに切り替わるフォールバックシステムを追加しました。",
    "en": "A full-stack app was built using Laravel and Leaflet.js. It pulls live GPS coordinates from Firebase for real-time tracking. However, to make it truly reliable, a fallback system was added: if the live connection drops, it automatically defaults to static schedule data in MySQL."
  },
  "rp-imp": {
    "id": "Menyediakan perkiraan waktu kedatangan (ETA) yang jelas dan interaktif, langsung pada peta. Fitur tambahan menghitung penilaian ketepatan waktu berdasarkan riwayat berbagai rute untuk membantu pengguna mengambil keputusan perjalanan yang lebih baik.",
    "ja": "地図上に直接描画される、明確でインタラクティブな到着予定時刻(ETA)をユーザーに提供します。また、様々なルートの過去の「定時運行」評価を計算する機能も追加し、人々の通勤の意思決定を支援します。",
    "en": "Provides users with clear, interactive ETAs drawn directly on a map. A feature was also added that calculates a historical 'on-time' rating for different routes, helping people make better commuting decisions."
  },
  "rp-gal-1": {
    "id": "Perencana Rute Utama",
    "ja": "メインルートプランナー",
    "en": "Main Route Planner"
  },
  "rp-gal-2": {
    "id": "Registrasi Akun",
    "ja": "アカウント登録",
    "en": "Account Registration"
  },
  "proj-cy-title": {
    "id": "Prediktor Hasil Panen",
    "ja": "収穫量予測ツール",
    "en": "Crop Yield Predictor"
  },
  "proj-cy-desc": {
    "id": "Model prediktif hasil pertanian.",
    "ja": "農業収穫量の予測モデル。",
    "en": "Agricultural yield predictive model."
  },
  "cy-prob": {
    "id": "Memperkirakan hasil produksi pertanian sulit karena cuaca dan ketersediaan sumber daya sangat bervariasi. Prediksi yang tidak akurat menyebabkan pemborosan sumber daya dan perencanaan keuangan yang buruk bagi petani.",
    "ja": "天候や資源の変動が大きいため、農場の生産量を予測することは困難です。不正確な予測は、資源の無駄遣いや農家の不適切な資金計画につながります。",
    "en": "Predicting how much a farm will produce is tough because weather and resources vary wildly. Inaccurate predictions lead to wasted resources and poor financial planning for farmers."
  },
  "cy-sol": {
    "id": "Data pertanian mentah dibersihkan dan diproses untuk menangani nilai yang hilang. Variabel lokasi dengan banyak kategori dikodekan menggunakan One-Hot Encoding. Beberapa model pembelajaran mesin kemudian dibandingkan untuk menentukan model dengan prediksi hasil panen terbaik berdasarkan masukan seperti curah hujan, suhu, dan pestisida.",
    "ja": "農業の生データを整備して欠損値を処理し、カテゴリー数の多い所在地データをOne-Hotエンコーディングで表現しました。その後、複数の機械学習モデルを比較し、降雨量、気温、農薬などの入力から最も正確に収穫量を予測できるモデルを選びました。",
    "en": "Raw agricultural data was cleaned and processed to handle missing values, and high-cardinality locations were categorized using One-Hot Encoding. Several machine learning models were then benchmarked against each other to determine which predicted yields best based on inputs like rainfall, temperature, and pesticides."
  },
  "cy-imp": {
    "id": "Model Gradient Boosting akhir mencapai akurasi 96%. Simulasi juga dilakukan untuk mengidentifikasi kelompok anomali dan menunjukkan bagaimana data tersebut dapat digunakan untuk menargetkan pertanian berkinerja rendah, lengkap dengan perkiraan imbal hasil investasi (ROI).",
    "ja": "最終的な勾配ブースティングモデルは96%の精度を達成しました。異常なクラスターを特定し、生産性の低い農場を対象にするためにデータをどう活用できるかを示すシミュレーションも行い、推定投資収益率（ROI）を算出しました。",
    "en": "The final Gradient Boosting model reached 96% accuracy. A simulation was also run to identify anomaly clusters and show how this data could be used to target underperforming farms, complete with an estimated financial ROI."
  },
  "cy-gal-1": {
    "id": "Perbandingan Kinerja Model",
    "ja": "モデルのベンチマーク",
    "en": "Model Benchmarking"
  },
  "cy-gal-2": {
    "id": "Deteksi Anomali",
    "ja": "異常検知",
    "en": "Anomaly Detection"
  },
  "cy-gal-3": {
    "id": "Simulasi Nilai Bisnis",
    "ja": "ビジネス価値シミュレーション",
    "en": "Business Value Simulation"
  },
  "proj-pp-title": {
    "id": "Prediktor Kepribadian",
    "ja": "性格予測ツール",
    "en": "Personality Predictor"
  },
  "proj-pp-desc": {
    "id": "Aplikasi web prediktor sifat kepribadian berdasarkan pakaian.",
    "ja": "服装に基づく性格特性予測ウェブアプリ。",
    "en": "Personality trait predictor web app based on clothing."
  },
  "pp-prob": {
    "id": "Tes kepribadian biasanya bergantung pada survei laporan diri, yang secara inheren dipengaruhi oleh bagaimana seseorang ingin dipersepsikan. Tes ini tidak memiliki keterkaitan visual yang objektif dengan cara seseorang benar-benar menampilkan diri kepada orang lain.",
    "ja": "性格テストは伝統的に自己申告のアンケートに依存しており、個人が「どう見られたいか」によるバイアスが本質的に生じます。個人の実際の外見との客観的で視覚的な相関関係が欠けています。",
    "en": "Personality tests traditionally rely on self-reported surveys, which are inherently biased by how individuals wish to be perceived. They lack an objective, visual correlation to an individual's actual presentation to the outside world."
  },
  "pp-sol": {
    "id": "Jaringan saraf PyTorch dikembangkan untuk menganalisis foto pakaian pengguna. Sistem mengekstrak fitur fesyen tertentu secara terprogram dan memprosesnya melalui model klasifikasi, lalu memetakan pilihan pakaian secara langsung ke lima dimensi kepribadian Big Five (OCEAN).",
    "ja": "ユーザーの服装写真を分析するためにPyTorchニューラルネットワークを開発しました。システムは特定のファッションの特徴をプログラム的に抽出し、分類モデルを通じて処理することで、視覚的な服装の選択をビッグファイブ（OCEAN）の性格特性に直接マッピングします。",
    "en": "A PyTorch neural network was developed to analyze photographs of user outfits. The system programmatically extracts specific fashion features and processes them through a classification model, mapping visual clothing choices directly to the Big Five (OCEAN) personality traits."
  },
  "pp-imp": {
    "id": "Aplikasi web interaktif diluncurkan dengan memadukan psikologi perilaku dan visi komputer. Aplikasi memberikan prediksi psikologis berbasis AI secara instan yang dapat dibandingkan dengan penilaian diri pengguna.",
    "ja": "行動心理学とコンピュータービジョンをシームレスに組み合わせたインタラクティブなウェブアプリケーションを展開しました。ユーザーの自己評価と比較できる、AI駆動の心理予測を即座に提供します。",
    "en": "An interactive web application was deployed, seamlessly combining behavioral psychology with computer vision. It provides users with instant, AI-driven psychological predictions to contrast against their own self-assessments."
  },
  "pp-gal-1": {
    "id": "Unggah dan Survei",
    "ja": "アップロードとアンケート",
    "en": "Upload & Survey"
  },
  "pp-gal-2": {
    "id": "Analisis Sifat dengan AI",
    "ja": "AI特性分析",
    "en": "AI Trait Analysis"
  },
  "pp-gal-3": {
    "id": "Rincian Sifat Kepribadian",
    "ja": "特性の分析結果",
    "en": "Trait Breakdowns"
  },
  "site-description": {
    "en": "Computer Science undergraduate and application developer. Explore my projects, experience, education, and technical skills.",
    "id": "Mahasiswa Ilmu Komputer dan pengembang aplikasi. Jelajahi proyek, pengalaman, pendidikan, dan keahlian teknis saya.",
    "ja": "コンピュータサイエンス専攻の大学生・アプリケーション開発者。プロジェクト、職歴、学歴、技術スキルをご紹介します。"
  },
  "skip-content": {
    "en": "Skip to content",
    "id": "Lewati ke konten",
    "ja": "本文へ移動"
  },
  "language-label": {
    "en": "Change language",
    "id": "Ubah bahasa",
    "ja": "言語を変更"
  },
  "appearance-label": {
    "en": "Change appearance",
    "id": "Ubah tampilan",
    "ja": "外観を切り替える"
  },
  "theme-to-dark": {
    "en": "Switch to dark appearance",
    "id": "Beralih ke tampilan gelap",
    "ja": "ダークモードに切り替える"
  },
  "theme-to-light": {
    "en": "Switch to light appearance",
    "id": "Beralih ke tampilan terang",
    "ja": "ライトモードに切り替える"
  },
  "back-short": {
    "en": "Home",
    "id": "Beranda",
    "ja": "ホーム"
  },
  "present": {
    "en": "Present",
    "id": "Sekarang",
    "ja": "現在"
  },
  "open-image": {
    "en": "Open image: {title}",
    "id": "Buka gambar: {title}",
    "ja": "画像を開く：{title}"
  },
  "portrait-title": {
    "en": "Portrait of Aaron Nathanael",
    "id": "Foto Aaron Nathanael",
    "ja": "アーロン・ナタナエルのポートレート"
  },
  "close": {
    "en": "Close",
    "id": "Tutup",
    "ja": "閉じる"
  },
  "image-viewer": {
    "en": "Image viewer",
    "id": "Penampil gambar",
    "ja": "画像ビューアー"
  },
  "image-loading": {
    "en": "Loading image…",
    "id": "Memuat gambar…",
    "ja": "画像を読み込み中…"
  },
  "image-error": {
    "en": "The image could not be loaded. Please try again.",
    "id": "Gambar tidak dapat dimuat. Silakan coba lagi.",
    "ja": "画像を読み込めませんでした。もう一度お試しください。"
  },
  "open-original": {
    "en": "Open original image",
    "id": "Buka gambar asli",
    "ja": "元の画像を開く"
  },
  "zoom-in": {
    "en": "Zoom in",
    "id": "Perbesar",
    "ja": "拡大"
  },
  "zoom-out": {
    "en": "Zoom out",
    "id": "Perkecil",
    "ja": "縮小"
  },
  "zoom-reset": {
    "en": "Reset zoom",
    "id": "Atur ulang pembesaran",
    "ja": "拡大をリセット"
  },
  "zoom-level": {
    "en": "Zoom level",
    "id": "Tingkat pembesaran",
    "ja": "拡大率"
  },
  "rotate-image": {
    "en": "Rotate image",
    "id": "Putar gambar",
    "ja": "画像を回転"
  },
  "copy-email": {
    "en": "Copy email address",
    "id": "Salin alamat email",
    "ja": "メールアドレスをコピー"
  },
  "copied": {
    "en": "Email address copied.",
    "id": "Alamat email disalin.",
    "ja": "メールアドレスをコピーしました。"
  },
  "copy-error": {
    "en": "Could not copy. Select the address to copy it manually.",
    "id": "Tidak dapat menyalin. Pilih alamat email untuk menyalinnya secara manual.",
    "ja": "コピーできませんでした。アドレスを選択して手動でコピーしてください。"
  },
  "email-label": {
    "en": "Email",
    "id": "Email",
    "ja": "メール"
  },
  "contact-title": {
    "en": "Contact",
    "id": "Kontak",
    "ja": "連絡先"
  },
  "skill-languages": {
    "en": "Languages",
    "id": "Bahasa pemrograman",
    "ja": "プログラミング言語"
  },
  "skill-web": {
    "en": "Web development",
    "id": "Pengembangan web",
    "ja": "ウェブ開発"
  },
  "skill-ai": {
    "en": "AI and machine learning",
    "id": "Kecerdasan buatan dan pembelajaran mesin",
    "ja": "AI・機械学習"
  },
  "skill-tools": {
    "en": "Tools and data",
    "id": "Alat dan data",
    "ja": "ツール・データ"
  },
  "skill-specialties": {
    "en": "Specialties",
    "id": "Bidang keahlian",
    "ja": "専門分野"
  },
  "skill-ml": {
    "en": "Machine Learning",
    "id": "Pembelajaran Mesin",
    "ja": "機械学習"
  },
  "skill-cv": {
    "en": "Computer Vision",
    "id": "Visi Komputer",
    "ja": "コンピュータビジョン"
  },
  "skill-wd": {
    "en": "Web Development",
    "id": "Pengembangan Web",
    "ja": "ウェブ開発"
  },
  "not-found-title": {
    "en": "Page not found",
    "id": "Halaman tidak ditemukan",
    "ja": "ページが見つかりません"
  },
  "not-found-desc": {
    "en": "This page may have moved. Return home to explore my portfolio.",
    "id": "Halaman ini mungkin telah dipindahkan. Kembali ke beranda untuk menjelajahi portofolio saya.",
    "ja": "ページが移動した可能性があります。ホームに戻ってポートフォリオをご覧ください。"
  },
  "gpa-label": {
    "en": "GPA",
    "id": "IPK",
    "ja": "GPA"
  },
  "page-loading": {
    "en": "Loading page…",
    "id": "Memuat halaman…",
    "ja": "ページを読み込み中…"
  },
  "page-error": {
    "en": "This page could not be loaded. Check your connection and try again.",
    "id": "Halaman ini tidak dapat dimuat. Periksa koneksi Anda dan coba lagi.",
    "ja": "ページを読み込めませんでした。接続を確認して、もう一度お試しください。"
  },
  "retry": {
    "en": "Try again",
    "id": "Coba lagi",
    "ja": "再試行"
  },
  "go-back": {
    "en": "Go back",
    "id": "Kembali",
    "ja": "戻る"
  },
  "inst-sit": {
    "en": "Shibaura Institute of Technology",
    "id": "Shibaura Institute of Technology",
    "ja": "芝浦工業大学"
  },
  "inst-binus": {
    "en": "BINUS University",
    "id": "BINUS University",
    "ja": "ビヌス大学"
  },
  "skill-data": {
    "en": "Data Analytics",
    "id": "Analisis Data",
    "ja": "データ分析"
  }
} as const satisfies Record<string, Record<Locale, string>>;

export type MessageKey = keyof typeof messages;
