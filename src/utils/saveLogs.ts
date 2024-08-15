import axios from 'axios';

export const savingLogs = async (
  startTime: any,
  totalDurationSec: any,
  scraper_name: string
) => {
  const logData = {
    scraper_name: scraper_name,
    startTime: new Date(startTime).toISOString(),
    totalDurationSec,
  };

  try {
    await axios.post('https://in.logs.betterstack.com', logData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.BETTER_STACK_LOG_API_KEY,
      },
    });
  } catch (error) {
    console.error(
      'Bro there was an error while sending data to betterstack',
      error
    );
  }
};
