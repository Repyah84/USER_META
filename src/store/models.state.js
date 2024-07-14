// @ts-check
/// <reference path="../types/model.type.js" />

"use strict";

/** @type {Map<string, Model>} */
const models = new Map();

/**
 * @param {string} key
 * @param {Model} data
 * @returns {void}
 */
const addModel = (key, data) => {
  models.set(key, data);
};

/**
 * @param {string} key
 * @returns {Model | undefined}
 */
const getModel = (key) => {
  return models.get(key);
};

/**
 * @returns {Array<Model>}
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

/**
 * @returns {[string, Model][]}
 */
const getModelEntries = () => {
  return Array.from(models.entries());
};

export { addModel, getModel, getModelsValue, getModelsSize, getModelEntries };
