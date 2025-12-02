document.addEventListener('DOMContentLoaded', () => {

    // 1. อ่าน 'topic' จาก URL
    // เราต้องใช้สิ่งนี้ในทุกหน้าเพื่อส่งค่าต่อ
    const urlParams = new URLSearchParams(window.location.search);
    const topic = urlParams.get('topic'); // เช่น "LOVE"

    // 2. ตรวจสอบว่าเราอยู่หน้าไหน
    const pageId = document.body.id;

    // ------------------------------------
    //  หน้า 1: สับไพ่ (reading.html)
    // ------------------------------------
    if (pageId === 'page-reading') {
        const shuffleBtn = document.getElementById('shuffle-btn');
        
        shuffleBtn.addEventListener('click', () => {
            // ไปยังหน้าวิดีโอ โดยยังคงส่ง 'topic' ต่อไป
            window.location.href = `video.html?topic=${topic}`;
        });
    }

    // ------------------------------------
    //  หน้า 2: วิดีโอ (video.html)
    // ------------------------------------
    else if (pageId === 'page-video') {
        const shuffleVideo = document.getElementById('shuffle-video');
        
        // เมื่อวิดีโอเล่นจบ
        shuffleVideo.addEventListener('ended', () => {
            // ไปยังหน้าเลือกไพ่ โดยยังคงส่ง 'topic' ต่อไป
            window.location.href = `select.html?topic=${topic}`;
        });
    }

    // ------------------------------------
    //  หน้า 3: เลือกไพ่ (select.html)
    // ------------------------------------
    else if (pageId === 'page-select') {
        const wangpaiImg = document.getElementById('wangpai-img');
        const cardResults = document.getElementById('card-results');
        const getReadingBtn = document.getElementById('get-reading-btn');
        const loadingModal = document.getElementById('loading-modal');
        const resultModal = document.getElementById('result-modal');
        const resultText = document.getElementById('result-text');
        const closeResultBtn = document.getElementById('close-result-btn');

        let cardsRevealed = 0;

        // คลิกที่กองไพ่ (wangpai.png)
        wangpaiImg.addEventListener('click', () => {
            if (cardsRevealed < 3) {
                cardsRevealed++;
                
                // สร้างไพ่ (ใช้ back_card.jpg)
                const img = document.createElement('img');
                img.src = 'image/back_card.jpg';
                img.alt = 'ไพ่';
                img.classList.add('tarot-card');
                cardResults.appendChild(img);
            }
            
            // ถ้าเลือกครบ 3 ใบ
            if (cardsRevealed === 3) {
                wangpaiImg.classList.add('hidden'); // ซ่อนกองไพ่
                getReadingBtn.classList.remove('hidden'); // แสดงปุ่มดูดวง
            }
        });

        // กดปุ่มดูคำทำนาย
        getReadingBtn.addEventListener('click', async () => {
            loadingModal.style.display = 'flex';
            
            // ยิง API โดยใช้ 'topic' ที่ส่งต่อมาจากหน้าแรก
            const apiUrl = `https://dev.abdul.in.th/wee/api/v1/doo3?content={topic}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }
                const fortuneText = await response.text();
                
                loadingModal.style.display = 'none';
                resultText.textContent = fortuneText;
                resultModal.style.display = 'flex';

            } catch (error) {
                console.error('เกิดข้อผิดพลาด:', error);
                loadingModal.style.display = 'none';
                resultText.textContent = `เกิดข้อผิดพลาด: ${error.message}`;
                resultModal.style.display = 'flex';
            }
        });

        // ปุ่มปิด Modal
        closeResultBtn.addEventListener('click', () => {
            resultModal.style.display = 'none';
        });
    }


});

