document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('image-form');
    const promptInput = document.getElementById('prompt');
    const numImagesSelect = document.getElementById('num-images');
    const imageResults = document.getElementById('image-results');
    const errorMessage = document.getElementById('error-message');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const prompt = promptInput.value;
            const numImages = parseInt(numImagesSelect.value);

            if (!prompt) {
                errorMessage.textContent = 'Please enter a prompt.';
                return;
            }

            // Clear previous results and errors
            imageResults.innerHTML = '';
            errorMessage.textContent = '';
            loadingSpinner.style.display = 'block';

            try {
                // Here you would integrate with your backend or a secure API endpoint
                // WARNING: The following is a simplified, direct API call for demonstration.
                // In a real application, you should handle this on a backend server
                // to protect your API key.

                // Example using Hugging Face's Inference API for a free model
                const modelName = "stabilityai/stable-diffusion-xl-base-1.0"; // Example model
                const API_URL = `https://api-inference.huggingface.co/models/${modelName}`;
                const API_KEY = "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"; // Replace with your actual key

                const response = await fetch(
                    API_URL, {
                        headers: { Authorization: `Bearer ${API_KEY}` },
                        method: "POST",
                        body: JSON.stringify({ inputs: prompt }),
                    }
                );

                if (!response.ok) {
                    throw new Error('API request failed. Please try again later.');
                }

                // Assuming the API returns a blob directly
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);

                // For simplicity, we'll generate one image per API call in this example.
                // A real "bulk" solution would require a different API structure or multiple calls.
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.innerHTML = `
                    <img src="${imageUrl}" alt="Generated Image">
                    <a href="${imageUrl}" download="generated-image.png" class="download-link">
                        <i class="fas fa-download"></i> </a>
                `;
                imageResults.appendChild(imageItem);

            } catch (error) {
                console.error("Image generation failed:", error);
                errorMessage.textContent = `Error: ${error.message}. Please check the API status.`;
            } finally {
                loadingSpinner.style.display = 'none';
            }
        });
    }
});
