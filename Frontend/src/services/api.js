import axios from "axios";

// Base URL for the backend API
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1/";

/**
 * Create an Axios instance with default configurations.
 * - Base URL is set to the Django backend.
 * - Allows sending credentials (useful for authentication).
 * - Headers include JSON content type.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensures cookies (e.g., authentication tokens) are included in requests
});

/**
 * Fetches a list of news articles from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of news articles.
 */
export const fetchNews = async (page=1, tag="") => {
  try {
    const response = await apiClient.get(`news/?page=${page}${tag? `&tag=${tag}` : ""}`);
    return response.data; // Returns the list of news articles
  } catch (error) {
    console.error("Error fetching news articles:", error);
    throw error;
  }
};

/**
 * Fetches details of a single news article by ID.
 * @param {number} newsId - The ID of the news article.
 * @returns {Promise<Object>} A promise that resolves to the news article object.
 */
export const fetchNewsItem = async (newsId) => {
  try {
    const response = await apiClient.get(`news/${newsId}/`);
    return response.data; // Returns a single news article object
  } catch (error) {
    console.error(`Error fetching news article (ID: ${newsId}):`, error);
    throw error;
  }
};

/**
 * Fetches site-wide statistics such as total news articles, users, likes, and dislikes.
 * @returns {Promise<Object>} A promise that resolves to an object containing statistics.
 */
export const fetchStats = async () => {
  try {
    const response = await apiClient.get("stats/");
    return response.data; // Returns site statistics
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
};

/**
 * Submits a like or dislike action for a news article.
 * @param {number} newsId - The ID of the news article to like/dislike.
 * @param {string} action - Either "like" or "dislike".
 * @returns {Promise<Object>} A promise that resolves to the updated news article data.
 */
export const submitReaction = async (newsId, action) => {
  try {
    const response = await apiClient.post(`news/${newsId}/${action}/`);
    return response.data; // Returns the updated news article with new like/dislike counts
  } catch (error) {
    console.error(`Error submitting ${action} for news ID ${newsId}:`, error);
    throw error;
  }
};

/**
 * Creates a new news article.
 * @param {FormData} formData - The form data containing news details, including images.
 * @returns {Promise<Object>} A promise that resolves to the newly created news article.
 */
export const createNews = async (formData) => {
  try {
    const response = await apiClient.post("news/", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Required for uploading files (images)
      },
    });
    return response.data; // Returns the created news article
  } catch (error) {
    console.error("Error creating news article:", error);
    throw error;
  }
};

/**
 * Updates an existing news article.
 * @param {number} newsId - The ID of the news article to update.
 * @param {FormData} formData - The updated form data including images.
 * @returns {Promise<Object>} A promise that resolves to the updated news article.
 */
export const updateNews = async (newsId, formData) => {
  try {
    const response = await apiClient.put(`news/${newsId}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Returns the updated news article
  } catch (error) {
    console.error(`Error updating news article (ID: ${newsId}):`, error);
    throw error;
  }
};

/**
 * Deletes a news article by ID.
 * @param {number} newsId - The ID of the news article to delete.
 * @returns {Promise<void>} A promise that resolves when the news article is deleted.
 */
export const deleteNews = async (newsId) => {
  try {
    await apiClient.delete(`api/v1/news/${newsId}/`);
  } catch (error) {
    console.error(`Error deleting news article (ID: ${newsId}):`, error);
    throw error;
  }
};
