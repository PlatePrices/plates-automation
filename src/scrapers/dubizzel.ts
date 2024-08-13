import { Plate } from "../types/plates.js";
import SELECTORS from "../config/selectors.js";
import { validatePlate } from "../validation/zod.js";

export const dubizzelRunner = async (): Promise<Plate[]> => {
  let pageNumber = 0;
  const results: Plate[] = [];

  while (true) {
    const data = JSON.stringify({
      requests: [
        {
          indexName: "motors.com",
          query: "",
          params: `page=${pageNumber}&attributesToHighlight=[]&hitsPerPage=25&attributesToRetrieve=["is_premium","is_featured_agent","location_list","objectID","name","price","neighbourhood","agent_logo","can_chat","has_whatsapp_number","details","photo_thumbnails","photos","highlighted_ad","absolute_url","id","category_id","uuid","category","has_phone_number","category_v2","photos_count","created_at","site","permalink","has_vin","auto_agent_id","is_trusted_seller","show_trusted_seller_logo","trusted_seller_logo","trusted_seller_id","created_at","added","jobs_logo","vas","seller_type","is_verified_user","has_video","cotd_on","is_super_ad","categories","city","bedrooms","bathrooms","size","neighborhoods","agent","room_type","is_reserved","is_coming_soon","inventory_type"]&filters=("category_v2.slug_paths":"motors/number-plates") AND ("site.id":"2" OR "multi_site":true)`,
        },
      ],
    });

    const config: RequestInit = {
      method: "POST",
      headers: {
        ...SELECTORS.DUBIZZEL.CONFIG.HEADERS,
        "Content-Type": "application/json",
      },
      body: data,
    };

    let errorPlate = null;
    try {
      const response = await fetch(
        "https://wd0ptz13zs-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.11.0);%20Browser%20(lite)&x-algolia-api-key=cef139620248f1bc328a00fddc7107a6&x-algolia-application-id=WD0PTZ13ZS",
        config
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      const carPlates = responseData["results"][0]["hits"];

      if (carPlates.length === 0) {
        break;
      }

      for (const plate of carPlates) {
        errorPlate = plate;
        const price = plate["price"];
        const number = plate["details"]["Plate number"]["ar"]["value"];

        const link = plate["absolute_url"]["ar"];
        const img = plate["photos"]["main"];
        const emirate = plate["site"]["en"];
        let character;
        if (plate["details"]["Plate code"] !== undefined) {
          character = plate["details"]["Plate code"]["ar"]["value"];
        } else {
          character = "";
        }

        if(character.length > 3) {
          character = ""
        }

        const newPlate: Plate = {
          link: link,
          price: `${price}`,
          number: `${number}`,
          character: character,
          img: img,
          emirate: emirate,
          source: "dubizzle"
        };
        const isItValidPlate = await validatePlate(newPlate);

        if (isItValidPlate) {
          results.push(newPlate);
        } else {
          console.log('Plate with the following attributes is not valid: ', newPlate, 'dubizzel')
        }
      }

      pageNumber++;
    } catch (error) {
      console.error(`Error fetching data for page ${pageNumber}:`, error);
      break;
    }
  }
  return results;
};
