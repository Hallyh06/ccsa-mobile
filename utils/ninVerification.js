// utils/ninVerification.js

export const verifyNIN = async ({ nin, firstName, lastName }) => {
  const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
  const url = `https://e-nvs.digitalpulseapi.net/api/lookup/nin?op=level-4&nin=${nin}&first_name=${firstName}&last_name=${lastName}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });

    const result = await response.json();

    if (response.ok && result.status === 200) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.message || 'Verification failed' };
    }
  } catch (error) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
};
