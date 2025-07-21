document.addEventListener('DOMContentLoaded', () => {
    // ⬇️ *** THIS IS THE MOST IMPORTANT STEP *** ⬇️
    // Replace the placeholder URL with your actual Hugging Face API URL
    const apiUrl = "https://pro1222-reflect-ai.hf.space/api/analyze";

    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const uploadPrompt = document.getElementById('upload-prompt');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultArea = document.getElementById('result-area');
    const loader = document.getElementById('loader');

    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden');
                uploadPrompt.classList.add('hidden');
            };
            reader.readAsDataURL(file);
            analyzeBtn.disabled = false;
        }
    }

    analyzeBtn.addEventListener('click', async () => {
        if (!fileInput.files[0]) return;

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        // Reset UI
        resultArea.classList.add('hidden');
        loader.classList.remove('hidden');
        analyzeBtn.disabled = true;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            // Display results
            resultArea.classList.remove('hidden');
            if (response.ok) {
                // Use .replace() to make newlines show up correctly in HTML
                const formattedText = data.generated_text.replace(/\n/g, '<br>');
                resultArea.innerHTML = `
                    <p>${formattedText}</p>
                `;
            } else {
                resultArea.innerHTML = `<strong>Error:</strong> ${data.error}`;
            }

        } catch (error) {
            resultArea.classList.remove('hidden');
            resultArea.innerHTML = `<strong>Network Error:</strong> Could not connect to the API.`;
        } finally {
            loader.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    });
});
