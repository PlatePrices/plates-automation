import dubaiXplate from './plate-nodes/dubaixplates/scripts/plates.js';
import dubizzle from './plate-nodes/dubizzle/scripts/plates.js';
import numberae from './plate-nodes/numberae/scripts/plates.js';
import xplate from './plate-nodes/xplate/scripts/plates.js';
import logger from './plate-utils/logger/logger.js';

void (async () => {
  try {
    const allPlates = await Promise.all([
      xplate.extractPlates(1, 10),
      dubizzle.extractPlates(1, 10),
      dubaiXplate.extractPlates(1, 10),
      numberae.extractPlates(1, 10),
    ]);

    let validCounter: number = 0;
    let invalidCounter: number = 0;

    for (const groupPlate of allPlates) {
      validCounter += groupPlate.validPlates.length;
      invalidCounter += groupPlate.invalidPlates.length;
    }

    logger.debub('this is the counter of valid plates : ', validCounter);
    logger.debub('this is the counter of invalid plates : ', invalidCounter);
  } catch (error) {
    logger.error('Error in xplate.extractPlates:', error);

    console.log('this is the error : ', error);
  }
})();
