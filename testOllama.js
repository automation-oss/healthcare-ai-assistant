import { generateOllamaResponse } from './server/services/ollamaService.js';

(async () => {
    try {
        const response = await generateOllamaResponse('Hello', null, [], null);
        console.log('Generated response:', response);
    } catch (err) {
        console.error('Error during generation:', err);
    }
})();
