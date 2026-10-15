// Shared build-time copy. Only the current page’s UI strings are sent to the browser.
export const locales = ["en", "id", "ja"] as const;
export type Locale = (typeof locales)[number];

export const messages = {
  "nav-term": {
    "id": "Terminal",
    "ja": "ターミナル",
    "en": "Terminal"
  },
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
    "ja": "コンテキスト",
    "en": "Context"
  },
  "ts-label": {
    "id": "Tech Stack",
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
    "ja": "インパクト",
    "en": "Impact"
  },
  "gal-label": {
    "id": "Galeri Proyek",
    "ja": "プロジェクトギャラリー",
    "en": "Project Gallery"
  },
  "ctx-ac": {
    "id": "Proyek Akademik",
    "ja": "学術プロジェクト",
    "en": "Academic Project"
  },
  "ctx-pe": {
    "id": "Proyek Pribadi",
    "ja": "個人プロジェクト",
    "en": "Personal Project"
  },
  "my-name": {
    "id": "Aaron Nathanael",
    "ja": "アーロン・ナタナエル",
    "en": "Aaron Nathanael"
  },
  "hero-desc": {
    "id": "Mahasiswa S1 Ilmu Komputer tahun ke-4 di BINUS University. Saat ini sedang magang sebagai Application Developer di PT Bank Central Asia Tbk. Aktif mempelajari cara teknologi diimplementasikan dalam skenario bisnis dunia nyata.",
    "ja": "ビヌス大学のコンピュータサイエンス学部4年生。現在、PT Bank Central Asia Tbkでアプリケーション開発インターンとして勤務。現実のビジネスシナリオでテクノロジーがどのように実装されているかを積極的に学んでいます。",
    "en": "4th-year Computer Science undergraduate at BINUS University. Currently interning as an Application Developer at PT Bank Central Asia Tbk. Actively learning ways tech is implemented in real-world business scenarios."
  },
  "exp-bca": {
    "id": "Application Developer Intern",
    "ja": "アプリケーション開発インターン",
    "en": "Application Developer Intern"
  },
  "exp-bca-desc": {
    "id": "Bekerja di tim iOS Development yang bertanggung jawab untuk terus mengembangkan dan memelihara aplikasi Merchant BCA.",
    "ja": "iOS開発チームに所属し、Merchant BCAアプリケーションの継続的な開発と保守を担当しています。",
    "en": "Working in the iOS Development team responsible for continuously developing and maintaining the Merchant BCA application."
  },
  "exp-guide": {
    "id": "Pemandu Wisata",
    "ja": "ツアーガイド",
    "en": "Tour Guide"
  },
  "exp-guide-desc": {
    "id": "Memandu tur Museum Ghibli di Mitaka, Tokyo. Tur dilakukan sepenuhnya dalam bahasa Inggris dan bahasa Jepang dasar. Sebagian besar tamu adalah penutur bahasa Inggris yang bepergian di Jepang.",
    "ja": "東京・三鷹のジブリ美術館でツアーを案内。ツアーはすべて英語と基礎的な日本語で行われました。ゲストは主に日本を旅行中の英語圏の方々でした。",
    "en": "Lead tours of the Ghibli Museum in Mitaka, Tokyo. The tours were conducted entirely in English and basic Japanese. The guests were mostly English-speakers traveling in Japan."
  },
  "exp-aca": {
    "id": "Aktivis Acara Akademik",
    "ja": "学術イベント推進メンバー",
    "en": "Academic Events Activist"
  },
  "exp-aca-desc": {
    "id": "Bekerja dalam tim, berbasis proyek, untuk membuat dan melaksanakan acara HIMTI.",
    "ja": "プロジェクトベースでチームと協力し、HIMTIのイベントを企画・実行しました。",
    "en": "Worked in teams, based on projects, to create and carry out HIMTI events."
  },
  "exp-web": {
    "id": "Aktivis Web Development",
    "ja": "ウェブ開発推進メンバー",
    "en": "Web Development Activist"
  },
  "exp-web-desc": {
    "id": "Bekerja dalam tim, berbasis proyek, untuk mengembangkan frontend situs web HIMTI menggunakan HTML, CSS, dan JS.",
    "ja": "プロジェクトベースでチームと協力し、HTML、CSS、JSを使用してHIMTIウェブサイトのフロントエンドを開発しました。",
    "en": "Worked in teams, based on projects, to develop the frontend of HIMTI websites using HTML, CSS, and JS."
  },
  "exp-sic": {
    "id": "Peserta",
    "ja": "参加者",
    "en": "Participant"
  },
  "exp-sic-desc": {
    "en": "Completed the intensive bootcamps for AI/ML, Python, and IoT. Delivered \"SafeFall\", a real-time fall detection app using YOLO computer vision models. Reached the semi-finals among the top {sicSemiFinalists} of {sicParticipants} participants.",
    "id": "Menyelesaikan bootcamp intensif untuk AI/ML, Python, dan IoT. Membangun \"SafeFall\", aplikasi deteksi jatuh real-time menggunakan model visi komputer YOLO. Mencapai babak semi-final sebagai {sicSemiFinalists} terbaik dari {sicParticipants} peserta.",
    "ja": "AI/ML、Python、IoTの集中ブートキャンプを修了。YOLOモデルを使用したリアルタイム転倒検知アプリ「SafeFall」を開発。{sicParticipants}人の参加者の中からトップ{sicSemiFinalists}としてセミファイナルに進出。"
  },
  "exp-bncc": {
    "id": "Aktivis Pembelajaran & Pelatihan",
    "ja": "学習・トレーニング推進メンバー",
    "en": "Learning & Training Activist"
  },
  "exp-bncc-desc": {
    "id": "Bekerja dalam tim, berbasis proyek, untuk merencanakan dan membuat modul pembelajaran ilmu komputer yang komprehensif untuk mahasiswa.",
    "ja": "プロジェクトベースでチームと協力し、大学生向けの包括的なコンピュータサイエンス学習モジュールを計画および作成しました。",
    "en": "Worked in teams, based on project, to plan out and create comprehensive computer science learning modules for university students."
  },
  "exp-ios": {
    "id": "Peserta",
    "ja": "参加者",
    "en": "Participant"
  },
  "exp-ios-desc": {
    "id": "Bekerja dalam tim untuk mengembangkan aplikasi seluler iOS berbasis AR yang dapat memproyeksikan desain rumah tradisional Bali ke permukaan dunia nyata.",
    "ja": "チームで協力し、現実世界の表面に伝統的なバリの家のデザインを投影できるARベースのiOSモバイルアプリを開発しました。",
    "en": "Worked in a team to develop an AR-based iOS mobile app which is able to project traditional Balinese house designs onto real-world surfaces."
  },
  "edu-sit-sub": {
    "id": "Program Pertukaran Pelajar",
    "ja": "交換留学プログラム",
    "en": "Student Exchange Program"
  },
  "edu-sit-desc": {
    "id": "Pertukaran pelajar di Shibaura Institute of Technology, Tokyo. Mempelajari tentang teknik di Jepang, serta berkomunikasi dan bekerja dengan orang-orang dari budaya dan latar belakang yang sangat berbeda.",
    "ja": "東京の芝浦工業大学で交換留学。日本のエンジニアリングについて学び、全く異なる文化や背景を持つ人々とのコミュニケーションや協働を経験しました。",
    "en": "Exchanged at Shibaura Institute of Technology, Tokyo. Learned about engineering in Japan, as well as communicating and working with people with very different culture and backgrounds."
  },
  "edu-binus-sub": {
    "id": "S1 Ilmu Komputer",
    "ja": "コンピュータサイエンス学士",
    "en": "Bachelor of Computer Science"
  },
  "edu-binus-desc": {
    "id": "Mahasiswa S1 Ilmu Komputer dengan IPK kumulatif {gpa}. Tergabung dalam Global Class Program, yang berarti seluruh materi diberikan dalam bahasa Inggris, beserta satu semester Pertukaran Pelajar Internasional. Saat ini mendalami iOS App Development, Full-Stack Web Development, dan Machine Learning.",
    "ja": "累積GPA {gpa}のコンピュータサイエンス学部生。グローバルクラスプログラムに在籍し、すべての教材が英語で提供されるほか、1学期分の国際交換留学も含まれます。現在、iOSアプリ開発、フルスタックウェブ開発、機械学習を専攻しています。",
    "en": "Computer Science undergraduate with a cumulative GPA of {gpa}. In the Global Class Program, meaning that all the material is provided in English, along with one semester of International Study Exchange. Currently pursuing iOS App Development, Full-Stack Web Development, and Machine Learning."
  },
  "edu-smak-sub": {
    "id": "Ijazah SMA",
    "ja": "高校卒業証明",
    "en": "High School Diploma"
  },
  "edu-smak-desc": {
    "id": "Sekolah menengah atas jurusan Matematika dan Ilmu Pengetahuan Alam (MIPA).",
    "ja": "数学・自然科学（MIPA）を専攻する普通科高校。",
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
    "ja": "Game Jam 3位",
    "en": "2nd Runner-Up Game Jam"
  },
  "ach-sic": {
    "id": "Semi Finalis",
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
    "id": "Postur yang buruk menyebabkan sakit punggung, namun alat fisik mengganggu. Perangkat lunak sering gagal jika pengguna memakai headphone atau memiliki latar belakang yang ramai.",
    "ja": "猫背は背中の痛みの原因になりますが、物理的な姿勢矯正器具は煩わしいものです。ソフトウェアの代替品もありますが、ヘッドフォンを使用していたり、背景が複雑だと正常に動作しないことがよくあります。",
    "en": "Slouching causes back pain, but physical posture correctors are annoying to wear. Software alternatives exist, but they usually break if the user wears headphones or has a busy background."
  },
  "pa-sol": {
    "id": "Aplikasi web dibangun untuk melacak postur menggunakan webcam biasa. Untuk masalah headphone, pelacakan dipetakan ke mata, bukan telinga. Kalibrasi ditambahkan untuk mengunci ukuran dan mengabaikan latar belakang.",
    "ja": "一般的なウェブカメラを使用して姿勢を追跡するウェブアプリを構築しました。ヘッドフォンの問題を解決するため、耳ではなく目の座標にマッピングしました。また、ユーザーのサイズをロックし、背景の動きを無視するキャリブレーション機能を追加しました。",
    "en": "A web app was built to track posture using a regular webcam. To fix the headphone issue, tracking was mapped to eye coordinates instead of ears. A calibration step was added to lock onto the user's size and ignore background movement."
  },
  "pa-imp": {
    "id": "Monitor postur gratis tanpa perangkat keras yang bekerja dengan baik. Sistem mengingatkan pengguna saat membungkuk dan menyediakan data yang dapat diekspor.",
    "ja": "追加のハードウェアを必要としない、無料で実用的な姿勢モニターです。猫背になったときにユーザーに警告し、習慣データをエクスポートできます。",
    "en": "A free, zero-hardware posture monitor that works in real-world conditions. It alerts the user when they slouch and provides exportable data on their session habits."
  },
  "pa-gal-1": {
    "id": "Deteksi Bungkuk",
    "ja": "猫背の検知",
    "en": "Slouch Detection"
  },
  "pa-gal-2": {
    "id": "Penanganan Oklusi",
    "ja": "オクルージョン対応",
    "en": "Occlusion Handling"
  },
  "pa-gal-3": {
    "id": "Penyaringan Latar",
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
    "ja": "コード仕様書自動生成",
    "en": "Code Documentation Generator"
  },
  "proj-cd-desc": {
    "id": "Aplikasi web dan CLI pembuat dokumentasi Python.",
    "ja": "Pythonドキュメント生成ウェブアプリおよびCLI。",
    "en": "Python documentation generator web app and CLI."
  },
  "cd-prob": {
    "id": "Menulis dokumentasi itu membosankan. Alat AI yang ada sering berhalusinasi, membuat variabel yang tidak ada, atau berbayar via API cloud.",
    "ja": "ドキュメントの作成は面倒です。既存のAIツールはコードに存在しない変数を捏造（ハルシネーション）したり、クラウドAPI経由で使用するとコストがかかることがよくあります。",
    "en": "Writing documentation is tedious. Existing AI tools often hallucinate, making up variables that don't exist in the code, or they cost money to use via cloud APIs."
  },
  "cd-sol": {
    "id": "Alat Python lokal dibuat menggunakan model Qwen2.5. Dengan menerapkan output JSON, respons bertele-tele dihindari. Validasi ditambahkan untuk memeriksa output AI dengan AST kode asli untuk memblokir parameter palsu.",
    "ja": "Qwen2.5モデルを使用してローカルファーストのPythonツールを作成しました。JSON出力を厳格に適用することで、不要な応答を回避します。AIの出力を実際のコードの抽象構文木（AST）と照合する検証ステップを追加し、偽のパラメータを完全にブロックしました。",
    "en": "A local-first Python tool was created using the Qwen2.5 model. By strictly enforcing JSON outputs, it avoids chatty responses. A validation step was added to check the AI's output against the actual code's Abstract Syntax Tree (AST) to completely block fake parameters."
  },
  "cd-imp": {
    "id": "Docstring cepat, gratis, dan akurat dihasilkan dalam 5-20 detik per file tanpa koneksi internet. Kualitas output diverifikasi dengan tolok ukur NLP seperti BLEU dan ROUGE-L.",
    "ja": "インターネット接続なしで、1ファイルあたり5〜20秒で高速、無料、正確なDocstringを生成します。出力品質は、BLEUやROUGE-Lなどの標準的なNLPベンチマークで検証されました。",
    "en": "Fast, free, and accurate docstrings generated in 5-20 seconds per file without needing an internet connection. The output quality was verified using standard NLP benchmarks like BLEU and ROUGE-L."
  },
  "cd-gal-1": {
    "id": "Antarmuka Web",
    "ja": "ウェブインターフェース",
    "en": "Web Interface"
  },
  "cd-gal-2": {
    "id": "Output Tervalidasi",
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
    "id": "Deteksi jatuh lansia biasanya bergantung pada smartwatch. Sayangnya, perangkat ini mudah terlupa, dilepas untuk diisi daya, atau dihindari oleh pengguna yang paling membutuhkannya.",
    "ja": "高齢者の転倒検知は通常、スマートウォッチやペンダントに依存しています。しかし、これらのデバイスは忘れられやすく、充電のために外されたり、最も必要とするユーザーに敬遠されたりすることがよくあります。",
    "en": "Elderly fall detection usually relies on smartwatches or pendants. Unfortunately, these devices are easily forgotten, taken off to charge, or actively avoided by the users who need them most."
  },
  "sf-sol": {
    "id": "Model visi komputer YOLOv8 dilatih untuk mendeteksi jatuh dari kamera standar. Ini melacak gerakan vertikal tiba-tiba dan mencatat setiap peristiwa dengan skor keyakinan, mengirim peringatan tanpa interaksi fisik.",
    "ja": "一般的なカメラ映像から転倒を検知するために、YOLOv8コンピュータービジョンモデルを訓練しました。突然の垂直方向の動きを追跡し、各イベントを信頼度スコアと共に記録し、ユーザーとの物理的な接触なしにアラートを送信します。",
    "en": "A YOLOv8 computer vision model was trained to detect falls using standard camera feeds. It tracks sudden vertical movement and logs each event with a confidence score, sending alerts without any physical interaction from the user."
  },
  "sf-imp": {
    "en": "A non-intrusive safety net designed to work continuously in the background. SafeFall was selected as a semi-finalist in the Samsung Innovation Campus program, among the top {sicSemiFinalists} of {sicParticipants} participants.",
    "id": "Jaring pengaman non-intrusif yang dirancang untuk bekerja terus-menerus di latar belakang. SafeFall terpilih sebagai semi-finalis Samsung Innovation Campus, di antara {sicSemiFinalists} terbaik dari {sicParticipants} peserta.",
    "ja": "バックグラウンドで継続的に動作する、邪魔にならないセーフティネットです。SafeFallはSamsung Innovation Campusで、{sicParticipants}人の参加者の中からトップ{sicSemiFinalists}のセミファイナリストに選ばれました。"
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
    "id": "Transportasi publik bisa sangat tidak bisa diandalkan. Penumpang sering tidak tahu kapan bus akan tiba, dan sumber informasi terpusat jarang ada.",
    "ja": "公共交通機関は時に非常に信頼性が低く、ストレスの原因となります。通勤者はバスが遅れているのか、正確にいつ到着するのかわからないことが多く、情報の一元化されたソースが存在することは稀です。",
    "en": "Public transport can be frustratingly unreliable. Commuters often don't know if a bus is delayed or exactly when it will arrive, and a single centralized source for this information rarely exists."
  },
  "rp-sol": {
    "id": "Aplikasi full-stack dibangun dengan Laravel dan Leaflet.js. Aplikasi ini menarik GPS dari Firebase untuk pelacakan real-time. Sebagai cadangan jika koneksi terputus, aplikasi beralih ke jadwal statis di MySQL.",
    "ja": "LaravelとLeaflet.jsを使用してフルスタックアプリを構築しました。FirebaseからリアルタイムのGPS座標を取得して追跡します。さらに信頼性を高めるため、リアルタイム接続が切断された場合、自動的にMySQLの静的なスケジュールデータに切り替わるフォールバックシステムを追加しました。",
    "en": "A full-stack app was built using Laravel and Leaflet.js. It pulls live GPS coordinates from Firebase for real-time tracking. However, to make it truly reliable, a fallback system was added: if the live connection drops, it automatically defaults to static schedule data in MySQL."
  },
  "rp-imp": {
    "id": "Memberikan ETA interaktif yang digambar di peta. Fitur tambahan menghitung peringkat ketepatan waktu historis untuk berbagai rute, membantu membuat keputusan komuter yang lebih baik.",
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
    "id": "Memprediksi produksi pertanian sulit karena cuaca dan sumber daya bervariasi. Prediksi yang tidak akurat menyebabkan pemborosan sumber daya dan perencanaan keuangan yang buruk.",
    "ja": "天候や資源の変動が激しいため、農場の生産量を予測することは困難です。不正確な予測は、資源の無駄遣いや農家の資金計画の失敗につながります。",
    "en": "Predicting how much a farm will produce is tough because weather and resources vary wildly. Inaccurate predictions lead to wasted resources and poor financial planning for farmers."
  },
  "cy-sol": {
    "id": "Data pertanian mentah dibersihkan dan diproses. Lokasi dengan kardinalitas tinggi dikategorikan dengan One-Hot Encoding. Beberapa model ML diuji untuk menentukan prediksi hasil terbaik berdasarkan curah hujan, suhu, dan pestisida.",
    "ja": "未加工の農業データをクリーニングして欠損値を処理し、高カーディナリティの場所をOne-Hotエンコーディングを使用して分類しました。その後、いくつかの機械学習モデルを比較し、降雨量、温度、農薬などの入力に基づいてどのモデルが最も正確に収穫量を予測できるかを決定しました。",
    "en": "Raw agricultural data was cleaned and processed to handle missing values, and high-cardinality locations were categorized using One-Hot Encoding. Several machine learning models were then benchmarked against each other to determine which predicted yields best based on inputs like rainfall, temperature, and pesticides."
  },
  "cy-imp": {
    "id": "Model Gradient Boosting mencapai akurasi 96%. Simulasi dijalankan untuk mengidentifikasi cluster anomali dan menunjukkan bagaimana data ini digunakan untuk menargetkan pertanian berkinerja buruk, lengkap dengan perkiraan ROI.",
    "ja": "最終的なGradient Boostingモデルは96%の精度を達成しました。また、異常なクラスタを特定し、このデータを活用してパフォーマンスの低い農場をターゲットにする方法を示すシミュレーションを実行し、推定される財務ROIも算出しました。",
    "en": "The final Gradient Boosting model reached 96% accuracy. A simulation was also run to identify anomaly clusters and show how this data could be used to target underperforming farms, complete with an estimated financial ROI."
  },
  "cy-gal-1": {
    "id": "Benchmarking Model",
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
    "id": "Tes kepribadian umumnya bergantung pada survei yang bias oleh bagaimana individu ingin dilihat. Tes ini kurang memiliki korelasi visual yang objektif terhadap presentasi nyata seseorang di dunia luar.",
    "ja": "性格テストは伝統的に自己申告のアンケートに依存しており、個人が「どう見られたいか」によるバイアスが本質的に生じます。個人の実際の外見との客観的で視覚的な相関関係が欠けています。",
    "en": "Personality tests traditionally rely on self-reported surveys, which are inherently biased by how individuals wish to be perceived. They lack an objective, visual correlation to an individual's actual presentation to the outside world."
  },
  "pp-sol": {
    "id": "Jaringan saraf PyTorch dikembangkan untuk menganalisis foto pakaian pengguna. Sistem mengekstrak fitur mode dan memprosesnya melalui model klasifikasi, memetakan pilihan pakaian visual ke sifat kepribadian OCEAN.",
    "ja": "ユーザーの服装写真を分析するためにPyTorchニューラルネットワークを開発しました。システムは特定のファッションの特徴をプログラム的に抽出し、分類モデルを通じて処理することで、視覚的な服装の選択をビッグファイブ（OCEAN）の性格特性に直接マッピングします。",
    "en": "A PyTorch neural network was developed to analyze photographs of user outfits. The system programmatically extracts specific fashion features and processes them through a classification model, mapping visual clothing choices directly to the Big Five (OCEAN) personality traits."
  },
  "pp-imp": {
    "id": "Aplikasi web interaktif diterapkan, menggabungkan psikologi perilaku dengan visi komputer. Ini memberikan prediksi psikologis berbasis AI secara instan untuk dikontraskan dengan penilaian diri mereka sendiri.",
    "ja": "行動心理学とコンピュータービジョンをシームレスに組み合わせたインタラクティブなウェブアプリケーションを展開しました。ユーザーの自己評価と比較できる、AI駆動の心理予測を即座に提供します。",
    "en": "An interactive web application was deployed, seamlessly combining behavioral psychology with computer vision. It provides users with instant, AI-driven psychological predictions to contrast against their own self-assessments."
  },
  "pp-gal-1": {
    "id": "Unggah & Survei",
    "ja": "アップロードとアンケート",
    "en": "Upload & Survey"
  },
  "pp-gal-2": {
    "id": "Analisis Sifat AI",
    "ja": "AI特性分析",
    "en": "AI Trait Analysis"
  },
  "pp-gal-3": {
    "id": "Rincian Sifat",
    "ja": "特性の分析結果",
    "en": "Trait Breakdowns"
  },
  "term-intro": {
    "id": "Ketik 'help' untuk melihat perintah.",
    "ja": "コマンドを見るには 'help' と入力してください。",
    "en": "Type 'help' to see available commands."
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
    "ja": "表示を切り替える"
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
  "open-terminal": {
    "en": "Open terminal",
    "id": "Buka terminal",
    "ja": "ターミナルを開く"
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
    "en": "The image could not be loaded. You can open the original image instead.",
    "id": "Gambar tidak dapat dimuat. Anda dapat membuka gambar aslinya.",
    "ja": "画像を読み込めませんでした。元の画像を開くことができます。"
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
  "terminal-title": {
    "en": "Terminal",
    "id": "Terminal",
    "ja": "ターミナル"
  },
  "terminal-command": {
    "en": "Terminal command",
    "id": "Perintah terminal",
    "ja": "ターミナルのコマンド"
  },
  "command-unknown": {
    "en": "Unknown command: {command}. Type help to see available commands.",
    "id": "Perintah tidak dikenal: {command}. Ketik help untuk melihat perintah yang tersedia.",
    "ja": "不明なコマンド：{command}。help と入力すると利用可能なコマンドを表示します。"
  },
  "terminal-updated": {
    "en": "Command output updated.",
    "id": "Hasil perintah diperbarui.",
    "ja": "コマンドの出力を更新しました。"
  },
  "terminal-cleared": {
    "en": "Terminal cleared.",
    "id": "Terminal dibersihkan.",
    "ja": "ターミナルをクリアしました。"
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
    "id": "Tidak dapat menyalin. Pilih alamat untuk menyalinnya secara manual.",
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
    "ja": "言語"
  },
  "skill-web": {
    "en": "Web development",
    "id": "Pengembangan web",
    "ja": "ウェブ開発"
  },
  "skill-ai": {
    "en": "AI and machine learning",
    "id": "AI dan machine learning",
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
    "id": "Machine Learning",
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
  }
} as const satisfies Record<string, Record<Locale, string>>;

export type MessageKey = keyof typeof messages;
