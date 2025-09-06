// Wait for the HTML document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Get all necessary HTML elements
    const form = document.getElementById('image-form');
    const promptInput = document.getElementById('prompt');
    const numImagesSelect = document.getElementById('num-images');
    const imageResults = document.getElementById('image-results');
    const errorMessage = document.getElementById('error-message');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // Check if the form exists before adding an event listener
    if (form) {
        form.addEventListener('submit', async (e) => {
            // Prevent the default form submission behavior
            e.preventDefault();
            
            // Get user input from the form
            const prompt = promptInput.value.trim();
            const numImages = parseInt(numImagesSelect.value);

            // Validate that a prompt has been entered
            if (!prompt) {
                errorMessage.textContent = 'Kripya ek prompt likhein.'; // Please write a prompt
                return;
            }

            // Clear previous results and error messages
            imageResults.innerHTML = '';
            errorMessage.textContent = '';
            
            // Show the loading spinner
            loadingSpinner.innerHTML = '<div class="spinner"></div><p>Images generate ho rahe hain... Thoda samay lag sakta hai.</p>';
            loadingSpinner.style.display = 'block';

            // Loop to generate the requested number of images
            for (let i = 0; i < numImages; i++) {
                try {
                    // Send a request to your custom backend endpoint
                    // This endpoint will contain your secret API key
                    const response = await fetch('/api/generate-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // Send the user's prompt in the request body
                        body: JSON.stringify({ prompt: prompt }),
                    });

                    // Check if the response from the server is successful
                    if (!response.ok) {
                        const errorData = await response.json();
                        if (response.status === 503) {
                             throw new Error('Server busy hai. Kripya 1-2 minute baad dobara prayas karein.'); // Server is busy. Please try again in 1-2 minutes.
                        }
                        throw new Error(`API se koi response nahi aaya ya error hai: ${errorData.error || 'Unknown Error'}`); // No response from API or an error has occurred
                    }

                    // Get the image data from the response
                    const imageBlob = await response.blob();
                    const imageUrl = URL.createObjectURL(imageBlob);

                    // Create HTML elements for the generated image and download link
                    const imageItem = document.createElement('div');
                    imageItem.className = 'image-item';
                    imageItem.innerHTML = `
                        <img src="${imageUrl}" alt="Generated Image" class="generated-img">
                        <a href="${imageUrl}" download="Azan_World_Image_${i + 1}.png" class="download-link">
                            <i class="fas fa-download"></i>
                        </a>
                    `;

                    // Add the new image to the grid
                    imageResults.appendChild(imageItem);

                } catch (error) {
                    // Display a user-friendly error message if something goes wrong
                    console.error("Image generation failed:", error);
                    errorMessage.textContent = `Error: ${error.message}. Kripya API status check karein ya thodi der baad dobara koshish karein.`; // Please check API status or try again later.
                    // Stop further attempts if an error occurs
                    break; 
                }
            }

            // Hide the loading spinner once all images are processed
            loadingSpinner.style.display = 'none';
        });
    }
});
