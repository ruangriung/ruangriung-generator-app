// AI Model Manager - Complete Implementation with Password Generator
const AIModelManager = (function() {
    // Private variables
    const API_KEYS = {
        dalle3: {
            key: localStorage.getItem('dalle3_api_key') || '',
            timestamp: localStorage.getItem('dalle3_api_key_timestamp') || 0
        },
        stability: {
            key: localStorage.getItem('stability_api_key') || '',
            timestamp: localStorage.getItem('stability_api_key_timestamp') || 0
        },
        turbo: {
            key: localStorage.getItem('turbo_password') || '',
            timestamp: localStorage.getItem('turbo_password_timestamp') || 0
        }
    };

    const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const MODEL_ENDPOINTS = {
        dalle3: 'https://api.openai.com/v1/images/generations',
        stability: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image'
    };
    
    const REFERRER_DOMAIN = 'ruangriung.my.id';
    
    let TURBO_PASSWORD = ''; // Will be set when password is generated
    let currentModel = 'flux'; // Default to flux
    let expiryInterval;
    
    // DOM Elements
    const modelSelect = document.getElementById('model');
    const apiKeyModal = document.getElementById('api-key-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const apiKeyTitle = document.getElementById('api-key-modal-title');
    const apiKeyInstructions = document.getElementById('api-key-instructions');
    const apiKeyNote = document.getElementById('api-key-note');
    const validateApiKeyBtn = document.getElementById('validate-api-key-btn');
    const cancelApiKeyBtn = document.getElementById('cancel-api-key-btn');
    const closeApiKeyModal = document.getElementById('close-api-key-modal');
    const safeFilterCheckbox = document.getElementById('safe-filter');
    const resetBtn = document.getElementById('reset-btn');
    
    // Private methods
    function generateRandomPassword() {
        const prefix = "ruangriung";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let suffix = "";
        
        // Generate 8-character random suffix
        for (let i = 0; i < 4; i++) {
            suffix += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return prefix + suffix;
    }

    function showApiKeyModal(model) {
        currentModel = model;
        
        // Clear any existing password toggle
        const oldShowPassword = document.getElementById('show-password');
        if (oldShowPassword) {
            oldShowPassword.replaceWith(oldShowPassword.cloneNode(true));
        }

        // Apply responsive styles to modal
        apiKeyModal.style.cssText = `
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
            align-items: flex-start;
            justify-content: center;
        `;

        const modalContent = apiKeyModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.cssText = `
                background: #e0e5ec;
                padding: 25px;
                border-radius: 15px;
                width: 100%;
                max-width: 500px;
                margin: 20px auto;
                box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
                position: relative;
                box-sizing: border-box;
            `;
        }

        if (model === 'dalle3') {
            apiKeyTitle.innerHTML = '<i class="fas fa-key"></i> OpenAI API Key Required';
            apiKeyInstructions.textContent = 'Please enter your OpenAI API key to use DALL-E 3.';
            apiKeyNote.innerHTML = `
                <div>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI</a>.</div>
                <div style="margin-top: 10px; color: #FF6B6B; font-size: 0.9em;">
                    <i class="fas fa-clock"></i> For security reasons, API keys will expire after 24 hours
                </div>
            `;
            apiKeyInput.value = API_KEYS.dalle3.key;
            apiKeyInput.placeholder = 'sk-...';
            apiKeyInput.type = 'password';
        } else if (model === 'stability') {
            apiKeyTitle.innerHTML = '<i class="fas fa-key"></i> Stability AI API Key Required';
            apiKeyInstructions.textContent = 'Please enter your Stability AI API key.';
            apiKeyNote.innerHTML = `
                <div>Get your API key from <a href="https://platform.stability.ai/account/keys" target="_blank">Stability AI</a>.</div>
                <div style="margin-top: 10px; color: #FF6B6B; font-size: 0.9em;">
                    <i class="fas fa-clock"></i> For security reasons, API keys will expire after 24 hours
                </div>
            `;
            apiKeyInput.value = API_KEYS.stability.key;
            apiKeyInput.placeholder = 'sk-...';
            apiKeyInput.type = 'password';
        } else if (model === 'turbo') {
            apiKeyTitle.innerHTML = '<i class="fas fa-bolt"></i> Turbo Model Access';
            apiKeyInstructions.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: 500;">
                    Generate a password first, then enter it below to enable high-speed generation
                </div>
            `;
            
            apiKeyNote.innerHTML = `
                <div style="background: linear-gradient(135deg, #6c5ce755, #a29bfe55); 
                    padding: 15px; border-radius: 12px; margin-bottom: 15px;
                    border: 1px dashed #6c5ce7;">
                    <div style="display: flex; justify-content: space-between; align-items: center;
                        background: #ffffff; padding: 12px; border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 12px;">
                        <div style="font-weight: bold;">Generated Password:</div>
                        <div id="generated-password" style="font-family: 'Courier New', monospace; font-weight: bold;
                            color: #6c5ce7; letter-spacing: 1px; word-break: break-all;"></div>
                    </div>
                    
                    <button id="generate-password-btn" style="width: 100%; 
                        background: #6c5ce7; color: white; border: none; 
                        padding: 12px; border-radius: 8px; cursor: pointer; 
                        transition: all 0.2s; font-weight: bold; margin-bottom: 8px;">
                        <i class="fas fa-sync-alt"></i> Generate New Password
                    </button>
                    
                    <button id="autofill-password-btn" style="width: 100%; 
                        background: #00b894; color: white; border: none; 
                        padding: 12px; border-radius: 8px; cursor: pointer; 
                        transition: all 0.2s; font-weight: bold;">
                        <i class="fas fa-magic"></i> Auto Fill Password
                    </button>
                    
                    <div style="display: flex; align-items: center; margin-top: 12px;">
                        <input type="checkbox" id="show-password" style="margin-right: 8px;">
                        <label for="show-password" style="font-size: 14px;">
                            Show password field
                        </label>
                    </div>
                </div>
                
                <div style="margin: 15px 0;">
                    <div style="display: flex; align-items: center; padding: 8px 12px;
                        background: #fff5f5; border-radius: 8px; margin-bottom: 8px;">
                        <i class="fas fa-exclamation-triangle" style="color: #d63031; margin-right: 8px;"></i>
                        <span style="font-size: 14px;">You are responsible for all generated content</span>
                    </div>
                    
                    <div style="display: flex; align-items: center; padding: 8px 12px;
                        background: #f0f5ff; border-radius: 8px; margin-bottom: 8px;">
                        <i class="fas fa-info-circle" style="color: #0984e3; margin-right: 8px;"></i>
                        <span style="font-size: 14px;">Generate a new password each time you want to use Turbo mode</span>
                    </div>
                    
                    <div style="display: flex; align-items: center; padding: 8px 12px;
                        background: #fff9e6; border-radius: 8px;">
                        <i class="fas fa-clock" style="color: #fdcb6e; margin-right: 8px;"></i>
                        <span style="font-size: 14px;">Password expires after 24 hours</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 15px;">
                    <a href="https://www.facebook.com/groups/1182261482811767" target="_blank"
                        style="color: #6c5ce7; text-decoration: none; font-weight: bold;">
                        <i class="fab fa-facebook" style="margin-right: 5px;"></i> Contact Admin for Support
                    </a>
                </div>
            `;

            // Generate initial password
            const generatedPassword = generateRandomPassword();
            document.getElementById('generated-password').textContent = generatedPassword;
            
            // Setup generate password button
            document.getElementById('generate-password-btn')?.addEventListener('click', (e) => {
                const newPassword = generateRandomPassword();
                document.getElementById('generated-password').textContent = newPassword;
                apiKeyInput.focus();
            });

            // Setup autofill password button
            document.getElementById('autofill-password-btn')?.addEventListener('click', (e) => {
                const currentPassword = document.getElementById('generated-password').textContent;
                apiKeyInput.value = currentPassword;
                
                // Beri feedback visual
                const btn = e.target.closest('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Password Filled!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            });

            // Setup password field
            apiKeyInput.value = '';
            apiKeyInput.placeholder = 'Paste generated password here';
            apiKeyInput.type = 'password';
            apiKeyInput.readOnly = false;

            // Toggle password field visibility
            document.getElementById('show-password')?.addEventListener('change', function(e) {
                apiKeyInput.type = e.target.checked ? 'text' : 'password';
            });
        }
        
        apiKeyModal.style.display = 'flex';
        apiKeyInput.focus();
        
        // Prevent modal from closing when clicking inside the content
        apiKeyModal.querySelector('.modal-content')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    function hideApiKeyModal() {
        apiKeyModal.style.display = 'none';
    }
    
    function clearAllData() {
        // Save coin data before reset
        const savedCoins = localStorage.getItem('ruangriung_coin_data');
        
        // Clear memory
        API_KEYS.dalle3.key = '';
        API_KEYS.dalle3.timestamp = 0;
        API_KEYS.stability.key = '';
        API_KEYS.stability.timestamp = 0;
        API_KEYS.turbo.key = '';
        API_KEYS.turbo.timestamp = 0;
        TURBO_PASSWORD = ''; // Reset password
        
        // Clear localStorage but keep coins
        localStorage.removeItem('dalle3_api_key');
        localStorage.removeItem('dalle3_api_key_timestamp');
        localStorage.removeItem('stability_api_key');
        localStorage.removeItem('stability_api_key_timestamp');
        localStorage.removeItem('turbo_password');
        localStorage.removeItem('turbo_password_timestamp');
        
        // Restore coin data if exists
        if (savedCoins) {
            localStorage.setItem('ruangriung_coin_data', savedCoins);
        }
        
        // Reset form values
        if (modelSelect) modelSelect.value = 'flux';
        if (safeFilterCheckbox) safeFilterCheckbox.checked = true;
        if (apiKeyInput) apiKeyInput.value = '';
        
        // Reset current model
        currentModel = 'flux';
        
        // Clear session data except what's needed
        sessionStorage.clear();
        
        // Clear expiry interval
        clearInterval(expiryInterval);
        
        // Update backToTop button
        initBackToTopButton();
    }
    
    function isKeyExpired(timestamp) {
        if (!timestamp) return true;
        return Date.now() - parseInt(timestamp) > EXPIRATION_TIME;
    }
    
    function formatTimeRemaining(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    
    function updateExpiryInfo() {
        const expiryDisplay = document.getElementById('model-expiry-display');
        if (!expiryDisplay) return;
        
        const keyData = API_KEYS[currentModel];
        if (!keyData.key) {
            expiryDisplay.textContent = '';
            expiryDisplay.style.display = 'none';
            return;
        }
        
        if (isKeyExpired(keyData.timestamp)) {
            expiryDisplay.innerHTML = `
                <span style="color: #FF6B6B; background: rgba(255,107,107,0.1); padding: 4px 8px; border-radius: 4px;">
                    <i class="fas fa-exclamation-circle"></i> Expired
                </span>
            `;
            expiryDisplay.style.display = 'block';
        } else {
            const timeLeft = EXPIRATION_TIME - (Date.now() - parseInt(keyData.timestamp));
            expiryDisplay.innerHTML = `
                <span style="color: #51CF66; background: rgba(81,207,102,0.1); padding: 4px 8px; border-radius: 4px;">
                    <i class="fas fa-clock"></i> Expires in: ${formatTimeRemaining(timeLeft)}
                </span>
            `;
            expiryDisplay.style.display = 'block';
        }
    }
    
    function startExpiryTimer() {
        clearInterval(expiryInterval);
        updateExpiryInfo();
        expiryInterval = setInterval(updateExpiryInfo, 1000);
    }
    
    async function validateApiKey() {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showError('Please enter a valid API key/password');
            return;
        }
        
        validateApiKeyBtn.disabled = true;
        validateApiKeyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validating...';
        
        try {
            let isValid = false;
            
            if (currentModel === 'dalle3') {
                isValid = await validateOpenAIKey(apiKey);
            } else if (currentModel === 'stability') {
                isValid = await validateStabilityKey(apiKey);
            } else if (currentModel === 'turbo') {
                const generatedPassword = document.getElementById('generated-password')?.textContent;
                isValid = apiKey === generatedPassword;
                if (isValid) {
                    if (safeFilterCheckbox) safeFilterCheckbox.checked = false;
                    TURBO_PASSWORD = apiKey; // Update the current password
                    console.log('Turbo mode activated with valid password');
                } else {
                    console.warn('Failed Turbo access attempt with password:', apiKey);
                    showError('Invalid Turbo password. Please generate and use the displayed password.');
                }
            }
            
            if (isValid) {
                // Save key and current timestamp
                API_KEYS[currentModel].key = apiKey;
                API_KEYS[currentModel].timestamp = Date.now();
                
                localStorage.setItem(
                    currentModel === 'turbo' ? 'turbo_password' : 
                    currentModel === 'dalle3' ? 'dalle3_api_key' : 'stability_api_key', 
                    apiKey
                );
                localStorage.setItem(
                    currentModel === 'turbo' ? 'turbo_password_timestamp' : 
                    currentModel === 'dalle3' ? 'dalle3_api_key_timestamp' : 'stability_api_key_timestamp', 
                    Date.now().toString()
                );
                
                hideApiKeyModal();
                
                if (modelSelect) modelSelect.value = currentModel;
                
                showSuccess(
                    currentModel === 'turbo' ? 
                    '<div style="text-align: center;">' +
                    '<i class="fas fa-bolt" style="font-size: 2rem; color: #fdcb6e; margin-bottom: 10px;"></i>' +
                    '<div style="font-size: 1.2rem; font-weight: bold;">Turbo Mode Activated!</div>' +
                    '<div style="margin-top: 10px; font-size: 0.9em; color: #FF6B6B;">' +
                    '<i class="fas fa-exclamation-triangle"></i> NSFW filter has been disabled' +
                    '</div></div>' : 
                    'API key validated successfully!'
                );
                
                startExpiryTimer();
            } else {
                showError('Invalid credentials. Please check and try again.');
                if (modelSelect) modelSelect.value = 'flux';
                currentModel = 'flux';
            }
        } catch (error) {
            console.error('Validation error:', error);
            showError('Error validating credentials. Please try again.');
            if (modelSelect) modelSelect.value = 'flux';
            currentModel = 'flux';
        } finally {
            validateApiKeyBtn.disabled = false;
            validateApiKeyBtn.textContent = 'Validate & Save';
        }
    }
    
    async function validateOpenAIKey(apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            return response.ok && (await response.json()).data;
        } catch (error) {
            console.error('OpenAI validation error:', error);
            return false;
        }
    }
    
    async function validateStabilityKey(apiKey) {
        try {
            const response = await fetch('https://api.stability.ai/v1/user/account', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Stability validation error:', error);
            return false;
        }
    }
    
    function handleModelChange() {
        if (!modelSelect) return true;
        
        const selectedModel = modelSelect.value;
        
        if (['turbo', 'dalle3', 'stability'].includes(selectedModel)) {
            // Check if key exists and is not expired
            const keyData = API_KEYS[selectedModel];
            if (!keyData.key || isKeyExpired(keyData.timestamp)) {
                showApiKeyModal(selectedModel);
                return false;
            }
            
            if (selectedModel === 'turbo' && safeFilterCheckbox) {
                safeFilterCheckbox.checked = false;
            }
            
            currentModel = selectedModel;
            startExpiryTimer();
        } else if (selectedModel === 'flux' && safeFilterCheckbox) {
            safeFilterCheckbox.checked = true;
            clearInterval(expiryInterval);
            const expiryDisplay = document.getElementById('model-expiry-display');
            if (expiryDisplay) expiryDisplay.style.display = 'none';
        }
        
        currentModel = selectedModel;
        return true;
    }
    
    function setupResetButton() {
        if (!resetBtn) return;
        
        resetBtn.addEventListener('click', function() {
            Swal.fire({
                title: 'Reset All Data?',
                html: `
                    <div style="color: #FF6B6B; margin-bottom: 15px;">
                        <i class="fas fa-exclamation-triangle"></i> This will permanently delete:
                    </div>
                    <ul style="text-align: left; margin-left: 20px;">
                        <li>All API keys and passwords</li>
                        <li>Application preferences</li>
                        <li>Session data</li>
                    </ul>
                    <div style="margin-top: 15px; color: #51CF66;">
                        <i class="fas fa-info-circle"></i> Note: Your coins will NOT be reset
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#51CF66',
                cancelButtonColor: '#FF6B6B',
                confirmButtonText: 'Yes, reset everything',
                cancelButtonText: 'Cancel',
                background: '#2B2D42',
                color: '#EDF2F4',
                width: '90%',
                maxWidth: '500px'
            }).then((result) => {
                if (result.isConfirmed) {
                    clearAllData();
                    showSuccess('All data has been reset successfully!').then(() => {
                        location.reload();
                    });
                }
            });
        });
    }
    
    function initBackToTopButton() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }
    
    // Helper functions
    function showError(message) {
        return Swal.fire({
            title: 'Error',
            html: message,
            icon: 'error',
            confirmButtonColor: '#51CF66',
            background: '#2B2D42',
            color: '#EDF2F4',
            width: '90%',
            maxWidth: '500px'
        });
    }
    
    function showSuccess(message) {
        return Swal.fire({
            title: 'Success',
            html: message,
            icon: 'success',
            confirmButtonColor: '#51CF66',
            background: '#2B2D42',
            color: '#EDF2F4',
            width: '90%',
            maxWidth: '500px'
        });
    }
    
    // Public methods
    async function generateImage(prompt, settings) {
        if (!handleModelChange()) return null;
        
        try {
            switch(currentModel) {
                case 'dalle3':
                    return await generateWithDalle3(prompt, settings);
                case 'stability':
                    return await generateWithStability(prompt, settings);
                case 'turbo':
                    return generateWithPollinations(prompt, settings, 'turbo');
                case 'gptimage':
                    return generateWithPollinations(prompt, settings, 'gptimage');
                default:
                    return generateWithPollinations(prompt, settings, 'flux');
            }
        } catch (error) {
            console.error('Generation error:', error);
            showError(error.message || 'Failed to generate image');
            throw error;
        }
    }
    
    async function generateWithDalle3(prompt, settings) {
        const response = await fetch(MODEL_ENDPOINTS.dalle3, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.dalle3.key}`
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "dall-e-3",
                size: `${settings.width}x${settings.height}`,
                quality: settings.quality === 'ultra' ? 'hd' : 'standard',
                n: 1
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'DALL-E 3 generation failed');
        }
        
        return (await response.json()).data[0].url;
    }
    
    async function generateWithStability(prompt, settings) {
        const response = await fetch(MODEL_ENDPOINTS.stability, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.stability.key}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt }],
                cfg_scale: 7,
                height: parseInt(settings.height),
                width: parseInt(settings.width),
                samples: 1,
                steps: 30
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Stability AI generation failed');
        }
        
        return `data:image/png;base64,${(await response.json()).artifacts[0].base64}`;
    }
    
function generateWithPollinations(prompt, settings, modelType = 'flux') {
    const params = new URLSearchParams({
        width: settings.width || 1024,
        height: settings.height || 1024,
        nologo: true,
        safe: modelType === 'turbo' ? false : settings.safeFilter !== false,
        model: modelType,
        referrer: REFERRER_DOMAIN  // Tambahkan parameter referrer di sini
    });
    
    if (settings.seed) params.set('seed', settings.seed);
    
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
}
    
    // Initialize
    function init() {
        if (modelSelect) {
            // Create container for model select and expiry info
            const modelSelectContainer = document.createElement('div');
            modelSelectContainer.style.display = 'flex';
            modelSelectContainer.style.alignItems = 'center';
            modelSelectContainer.style.gap = '10px';
            modelSelectContainer.style.width = '100%';
            modelSelectContainer.style.marginBottom = '15px';

            // Wrap the existing select
            modelSelect.parentNode.insertBefore(modelSelectContainer, modelSelect);
            modelSelectContainer.appendChild(modelSelect);

            // Create expiry display element
            const expiryDisplay = document.createElement('div');
            expiryDisplay.id = 'model-expiry-display';
            expiryDisplay.style.fontSize = '0.85em';
            expiryDisplay.style.marginLeft = 'auto';
            expiryDisplay.style.wordBreak = 'break-word';
            expiryDisplay.style.maxWidth = '60%';
            modelSelectContainer.appendChild(expiryDisplay);

            modelSelect.innerHTML = `
                <option value="flux">FLUX</option>
                <option value="turbo">Turbo (AI NSFW)</option>
                <option value="gptimage">GPTImage</option>
                <option value="dalle3">DALL-E 3 (OpenAI)</option>
                <option value="stability">Stability AI</option>
                <option value="imagefx" disabled>ImageFX (Coming Soon)</option>
                <option value="leonardo" disabled>Leonardo (Coming Soon)</option>
                <option value="tensor" disabled>Tensor AI (Coming Soon)</option>
                <option value="ideogram" disabled>Ideogram (Coming Soon)</option>
            `;
            modelSelect.value = currentModel;
            modelSelect.addEventListener('change', handleModelChange);
        }

        if (validateApiKeyBtn) validateApiKeyBtn.addEventListener('click', validateApiKey);
        if (cancelApiKeyBtn) cancelApiKeyBtn.addEventListener('click', () => {
            if (modelSelect) modelSelect.value = 'flux';
            hideApiKeyModal();
        });
        if (closeApiKeyModal) closeApiKeyModal.addEventListener('click', () => {
            if (modelSelect) modelSelect.value = 'flux';
            hideApiKeyModal();
        });
        if (apiKeyModal) apiKeyModal.addEventListener('click', (e) => {
            if (e.target === apiKeyModal) {
                if (modelSelect) modelSelect.value = 'flux';
                hideApiKeyModal();
            }
        });
        
        setupResetButton();
        initBackToTopButton();
        
        // Initialize expiry timer if a key is already set
        if (API_KEYS[currentModel].key && !isKeyExpired(API_KEYS[currentModel].timestamp)) {
            startExpiryTimer();
        }
    }
    
    // Public API
    return {
        init: init,
        generateImage: generateImage,
        clearAllData: clearAllData,
        // Admin function to update password
        updateTurboPassword: function(newPassword) {
            API_KEYS.turbo.key = newPassword;
            API_KEYS.turbo.timestamp = Date.now();
            localStorage.setItem('turbo_password', newPassword);
            localStorage.setItem('turbo_password_timestamp', Date.now().toString());
            return 'Turbo password updated successfully';
        }
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', AIModelManager.init);