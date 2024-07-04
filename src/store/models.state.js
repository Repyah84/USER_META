// @ts-check
/// <reference path="../types/model-data-parser.js" />

"use strict";

/** @type {Map<string, ModelDataPars>} */
const models = new Map();

/**
 * @param {string} key
 * @param {ModelDataPars} data
 * @returns {void}
 */
const addModel = (key, data) => {
  models.set(key, data);
};

/**
 * @param {string} key
 * @returns {ModelDataPars | undefined}
 */
const getModel = (key) => {
  return models.get(key);
};

/**
 * @returns {Array<ModelDataPars>}
 */
const getModelsValue = () => {
  return Array.from(models.values());
};

/**
 * @returns {number}
 */
const getModelsSize = () => {
  return getModelsValue().length;
};

export { addModel, getModel, getModelsValue, getModelsSize };
