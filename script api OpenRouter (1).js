// File: script.js (Versi OpenRouter)

document.addEventListener('DOMContentLoaded', () => {
    // === Ambil Elemen dari DOM ===
    const apiKeyInput = document.getElementById('apiKey');
    // Ganti placeholder untuk memperjelas
    apiKeyInput.placeholder = "Masukkan OpenRouter API Key Anda (sk-or-...)";
    
    const characterTriggerInput = document.getElementById('characterTrigger');
    const comicStyleSelect = document.getElementById('comicStyle');
    const storyPromptTextarea = document.getElementById('storyPrompt');
    const dialogInput = document.getElementById('dialog');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const comicStrip = document.getElementById('comicStrip');
    const placeholder = document.querySelector('.placeholder');
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');

    // === Fungsi Utama untuk Generate Panel ===
    const handleGenerate = async () => {
        // 1. Validasi Input
        const apiKey = apiKeyInput.value.trim();
        const characterTrigger = characterTriggerInput.value.trim();
        const storyPrompt = storyPromptTextarea.value.trim();
        
        if (!apiKey) {
            alert('Harap masukkan OpenRouter API Key Anda!');
            apiKeyInput.focus();
            return;
        }

        if (!characterTrigger) {
            alert('Harap tentukan kata pemicu (trigger) untuk karakter Anda!');
            characterTriggerInput.focus();
            return;
        }

        if (!storyPrompt) {
            alert('Harap isi deskripsi adegan (scene)!');
            storyPromptTextarea.focus();
            return;
        }

        // 2. Atur UI ke Mode Loading
        setLoading(true);

        // 3. Siapkan Data untuk API
        const dialog = dialogInput.value.trim();
        const style = comicStyleSelect.value;
        const finalPrompt = `A single comic book panel, in a ${style}. A character known as "${characterTrigger}". The scene is: ${storyPrompt}. ${dialog ? `Include a speech bubble with the text: "${dialog}".` : 'No dialog.'} Make it cinematic, high quality, and emotionally resonant.`;
        
        // 4. Panggil API OpenRouter
        try {
            const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    // Header tambahan yang direkomendasikan OpenRouter
                    'HTTP-Referer': `${window.location.host}`, 
                    'X-Title': 'Nabila Ahmad AI Comic Studio',
                },
                body: JSON.stringify({
                    // Gunakan nama model yang sesuai dengan OpenRouter
                    model: "openai/dall-e-3", 
                    prompt: finalPrompt,
                    n: 1,
                    size: "1024x1024",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Format error OpenRouter mungkin sedikit berbeda, kita coba ambil pesannya
                throw new Error(errorData.error?.message || 'Gagal mendapat respon dari AI. Cek console untuk detail.');
            }

            const data = await response.json();
            const imageUrl = data.data[0].url;

            // 5. Tampilkan hasil ke UI
            addPanelToStrip(imageUrl);

        } catch (error) {
            console.error('Error:', error);
            alert(`Terjadi kesalahan: ${error.message}`);
        } finally {
            // 6. Kembalikan UI ke Mode Normal
            setLoading(false);
        }
    };

    // === Fungsi Bantu (Tidak ada perubahan di sini) ===
    const setLoading = (isLoading) => {
        if (isLoading) {
            spinner.style.display = 'block';
            btnText.textContent = 'Memproses...';
            generateBtn.disabled = true;
        } else {
            spinner.style.display = 'none';
            btnText.textContent = 'Buat Panel';
            generateBtn.disabled = false;
        }
    };

    const addPanelToStrip = (imageUrl) => {
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        const panelDiv = document.createElement('div');
        panelDiv.className = 'comic-panel';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Generated Comic Panel';
        panelDiv.appendChild(img);
        comicStrip.appendChild(panelDiv);
        downloadBtn.disabled = false;
    };
    
    const handleDownload = () => {
        alert("Fungsi download sedang dalam pengembangan. Untuk saat ini, silakan klik kanan pada setiap gambar dan pilih 'Save Image As...' untuk menyimpannya.");
    }

    // === Tambahkan Event Listeners ===
    generateBtn.addEventListener('click', handleGenerate);
    downloadBtn.addEventListener('click', handleDownload);
});