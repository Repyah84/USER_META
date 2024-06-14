import { getModels } from "../../api/get-models.js";

/**
 *
 * @param {number} page
 * @returns {Promise<string[]>}
 */
export const models = async (page) => {
  const modelsIds = new Set();

  const modelsResponse = await getModels(page);

  if (modelsResponse) {
    for (const model of modelsResponse.creators) {
      if (model.guid) {
        console.log("MODEL_ID_ADD", model.guid, page);

        modelsIds.add(model.guid);
      }
    }
  }
  //!modelsResponse || modelsResponse.totalPages === page

  if (page === 2) {
    console.log("MODELS_ID_READY", modelsIds.size);

    console.log(modelsIds, "PAGE", page);

    return Array.from(modelsIds.values());
  }

  page++;

  await models(page);
};
